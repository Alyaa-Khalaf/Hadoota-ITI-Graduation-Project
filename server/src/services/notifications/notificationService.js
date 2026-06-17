import mongoose from 'mongoose'
import User from '../../models/User.js'
import Child from '../../models/Child.js'
import Notification from '../../models/notificationModel.js'
import StorySession from '../../models/storySessionModel.js'
import { sendEmail, sendRawEmail } from './emailService.js'
import { sendPushToUser } from './pushService.js'
import {
  welcomeTemplate,
  resetPasswordTemplate,
  weeklyReportTemplate,
  subscriptionTemplate,
  screenTimeAlertTemplate,
  inactivityReminderTemplate,
} from './templates/index.js'
import {
  getStoryAnalytics,
  getTopicAnalytics,
  getQuizAnalytics,
  getProgressAnalytics,
} from '../analyticsService.js'

const toObjectId = (id) => new mongoose.Types.ObjectId(id)

const getTodayStart = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return start
}

export const createInAppNotification = async ({
  userId,
  type,
  title,
  message,
  data = {},
  channels = ['in_app'],
}) => {
  return Notification.create({ userId, type, title, message, data, channels })
}

export const sendWelcomeEmail = async (user) => {
  if (user.notificationSettings?.email?.welcome === false) return

  await sendEmail(user.email, welcomeTemplate, user.name)
  await createInAppNotification({
    userId: user._id,
    type: 'welcome',
    title: 'أهلاً بيك في حدوتة! 🌟',
    message: `مرحباً ${user.name}، حسابك جاهز — ابدأ أول حدوتة لطفلك!`,
    channels: ['email', 'in_app'],
  })
}

export const sendResetPasswordEmail = async (user, resetToken) => {
  await sendEmail(user.email, resetPasswordTemplate, resetToken)
}

export const sendSubscriptionConfirmation = async (user, plan, amount, renewalDate) => {
  if (user.notificationSettings?.email?.subscription === false) return

  await sendEmail(user.email, subscriptionTemplate, user.name, plan, amount, renewalDate)
  await createInAppNotification({
    userId: user._id,
    type: 'subscription',
    title: 'تم تأكيد الاشتراك! 💳',
    message: `اشتراكك في خطة ${plan} تم بنجاح.`,
    data: { plan, amount, renewalDate },
    channels: ['email', 'in_app'],
  })
}

export const notifyBadgeEarned = async (childId, badgeName) => {
  const child = await Child.findById(childId).select('name parentId')
  if (!child) return

  const user = await User.findById(child.parentId)
  if (!user) return

  const title = `${child.name} كسب badge جديدة! 🏆`
  const message = `مبروك! ${child.name} حصل على "${badgeName}"`

  await createInAppNotification({
    userId: user._id,
    type: 'badge_earned',
    title,
    message,
    data: { childId, childName: child.name, badgeName },
    channels: ['push', 'in_app'],
  })

  if (user.notificationSettings?.push?.badgeEarned !== false) {
    const result = await sendPushToUser(user, {
      title,
      body: message,
      icon: '/icons/badge.png',
      data: { type: 'badge_earned', childId, badgeName },
    })
    await removeStalePushSubscriptions(user._id, result.staleEndpoints)
  }
}

export const checkAndNotifyScreenTime = async (childId, parentId) => {
  const user = await User.findById(parentId)
  if (!user) return

  const child = await Child.findById(childId).select('name')
  if (!child) return

  const limit = user.screenTimeLimitMinutes || 60
  const todayStart = getTodayStart()

  const [todayUsage] = await StorySession.aggregate([
    {
      $match: {
        childId: toObjectId(childId),
        readAt: { $gte: todayStart },
      },
    },
    { $group: { _id: null, totalSeconds: { $sum: '$durationSeconds' } } },
  ])

  const minutesUsed = Math.round((todayUsage?.totalSeconds || 0) / 60)
  if (minutesUsed < limit) return

  const alreadySent = await Notification.findOne({
    userId: user._id,
    type: 'screen_time_limit',
    'data.childId': childId,
    createdAt: { $gte: todayStart },
  })
  if (alreadySent) return

  const title = `${child.name} خلص وقت الشاشة النهارده ⏰`
  const message = `${child.name} استخدم ${minutesUsed} دقيقة من أصل ${limit} دقيقة`

  if (user.notificationSettings?.email?.screenTimeAlert !== false) {
    await sendEmail(
      user.email,
      screenTimeAlertTemplate,
      user.name,
      child.name,
      minutesUsed,
      limit
    )
  }

  await createInAppNotification({
    userId: user._id,
    type: 'screen_time_limit',
    title,
    message,
    data: { childId, childName: child.name, minutesUsed, limit },
    channels: ['email', 'push', 'in_app'],
  })

  if (user.notificationSettings?.push?.screenTimeLimit !== false) {
    const result = await sendPushToUser(user, {
      title,
      body: message,
      icon: '/icons/clock.png',
      data: { type: 'screen_time_limit', childId },
    })
    await removeStalePushSubscriptions(user._id, result.staleEndpoints)
  }
}

const buildWeeklyReport = async (childId) => {
  const [stories, topics, quiz, progress] = await Promise.all([
    getStoryAnalytics(childId, { period: 'daily', days: 7 }),
    getTopicAnalytics(childId),
    getQuizAnalytics(childId),
    getProgressAnalytics(childId),
  ])

  const topTopics = topics.topics.slice(0, 5).map((t) => t.topic)
  const summary =
    stories.totalStories > 0
      ? `${stories.totalStories} حدوتة اتسمعت الأسبوع ده — استمر!`
      : 'أسبوع هادي — شجّع طفلك يرجع للمغامرة!'

  return {
    storiesCount: stories.totalStories,
    quizScore: quiz.averageScore,
    stars: progress.stars,
    summary,
    topics: topTopics,
  }
}

export const sendWeeklyReports = async () => {
  const parents = await User.find({ role: 'parent' })
  let sentCount = 0

  for (const parent of parents) {
    if (parent.notificationSettings?.email?.weeklyReport === false) continue

    const children = await Child.find({ parentId: parent._id })

    for (const child of children) {
      const report = await buildWeeklyReport(child._id.toString())

      await sendEmail(
        parent.email,
        weeklyReportTemplate,
        parent.name,
        child.name,
        report
      )

      const title = `تقرير ${child.name} الأسبوعي جاهز 📊`
      const message = `${report.storiesCount} حدوتة — ${report.quizScore}% متوسط الكويز`

      await createInAppNotification({
        userId: parent._id,
        type: 'weekly_report',
        title,
        message,
        data: { childId: child._id, childName: child.name, report },
        channels: ['email', 'push', 'in_app'],
      })

      if (parent.notificationSettings?.push?.weeklyReportReady !== false) {
        const result = await sendPushToUser(parent, {
          title,
          body: message,
          icon: '/icons/report.png',
          data: { type: 'weekly_report', childId: child._id.toString() },
        })
        await removeStalePushSubscriptions(parent._id, result.staleEndpoints)
      }

      sentCount++
    }
  }

  console.log(`📊 Weekly reports sent: ${sentCount}`)
  return sentCount
}

export const sendInactivityReminders = async () => {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  threeDaysAgo.setHours(0, 0, 0, 0)

  const children = await Child.find()
  let sentCount = 0

  for (const child of children) {
    const parent = await User.findById(child.parentId)
    if (!parent || parent.notificationSettings?.email?.inactivityReminder === false) {
      continue
    }

    const [lastSession] = await StorySession.aggregate([
      { $match: { childId: toObjectId(child._id) } },
      { $group: { _id: null, lastActivity: { $max: '$readAt' } } },
    ])

    const lastActivity = lastSession?.lastActivity
    if (!lastActivity || lastActivity >= threeDaysAgo) continue

    const daysInactive = Math.floor(
      (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    )

    const recentReminder = await Notification.findOne({
      userId: parent._id,
      type: 'inactivity_reminder',
      'data.childId': child._id.toString(),
      createdAt: { $gte: threeDaysAgo },
    })
    if (recentReminder) continue

    await sendEmail(
      parent.email,
      inactivityReminderTemplate,
      parent.name,
      child.name,
      daysInactive
    )

    await createInAppNotification({
      userId: parent._id,
      type: 'inactivity_reminder',
      title: `${child.name} مالعبش من ${daysInactive} أيام 📚`,
      message: `شجّع ${child.name} يرجع يكمل حدوتته!`,
      data: { childId: child._id, childName: child.name, daysInactive },
      channels: ['email', 'in_app'],
    })

    sentCount++
  }

  console.log(`📚 Inactivity reminders sent: ${sentCount}`)
  return sentCount
}

export const sendNotification = async ({
  userId,
  type = 'custom',
  title,
  message,
  data = {},
  channels = ['in_app'],
  sendEmail: shouldEmail = false,
  sendPush: shouldPush = false,
}) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const notification = await createInAppNotification({
    userId,
    type,
    title,
    message,
    data,
    channels,
  })

  if (shouldEmail) {
    await sendRawEmail(user.email, title, `<p dir="rtl">${message}</p>`)
  }

  if (shouldPush) {
    const result = await sendPushToUser(user, { title, body: message, data })
    await removeStalePushSubscriptions(user._id, result.staleEndpoints)
  }

  return notification
}

const removeStalePushSubscriptions = async (userId, staleEndpoints) => {
  if (!staleEndpoints?.length) return
  await User.findByIdAndUpdate(userId, {
    $pull: { pushSubscriptions: { endpoint: { $in: staleEndpoints } } },
  })
}

export const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const filter = { userId }
  if (unreadOnly) filter.read = false

  const skip = (page - 1) * limit
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId, read: false }),
  ])

  return { notifications, total, unreadCount, page, limit }
}

export const markNotificationRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  )
  return notification
}

export const updateNotificationSettings = async (userId, settings) => {
  const update = {}

  if (settings.email) {
    for (const [key, value] of Object.entries(settings.email)) {
      update[`notificationSettings.email.${key}`] = value
    }
  }
  if (settings.push) {
    for (const [key, value] of Object.entries(settings.push)) {
      update[`notificationSettings.push.${key}`] = value
    }
  }
  if (settings.screenTimeLimitMinutes !== undefined) {
    update.screenTimeLimitMinutes = settings.screenTimeLimitMinutes
  }

  return User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select(
    'notificationSettings screenTimeLimitMinutes'
  )
}

export const subscribeToPush = async (userId, subscription) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const exists = user.pushSubscriptions.some((s) => s.endpoint === subscription.endpoint)
  if (exists) return user

  user.pushSubscriptions.push({
    endpoint: subscription.endpoint,
    keys: subscription.keys,
  })
  await user.save()
  return user
}

export const unsubscribeFromPush = async (userId, endpoint) => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { pushSubscriptions: { endpoint } } },
    { new: true }
  )
}
