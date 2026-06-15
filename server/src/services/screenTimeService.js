import Child from '../models/Child.js'
import { io } from '../index.js'
import { screenTimeAlertTemplate } from './notifications/templates/screenTimeAlert.js'
import { sendEmail } from './emailService.js'

const getMidnight = () => {
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)
  return midnight
}

// Resets today's screen time if lastReset is before today's midnight
const resetIfNeeded = (child) => {
  const midnight = getMidnight()
  if (!child.screenTime.lastReset || child.screenTime.lastReset < midnight) {
    child.screenTime.today = 0
    child.screenTime.lastReset = new Date()
    child.screenTime.sessionStart = null
    child.screenTime.warningNotified = false
  }
}

// Returns { allowed, remaining, today, limit }
export const getScreenTimeStatus = (child) => {
  const limit = child.settings?.screenTimeLimit ?? 30
  const today = child.screenTime?.today ?? 0
  const remaining = Math.max(0, limit - today)
  return {
    allowed: today < limit,
    remaining,
    today,
    limit
  }
}

// Notify parent via Socket.io when child hits 80% of limit
const notifyParentIfNeeded = async (child, parent) => {
  const { today, limit } = getScreenTimeStatus(child)
  const percent = limit > 0 ? (today / limit) * 100 : 100

  if (percent >= 80 && !child.screenTime.warningNotified) {
    child.screenTime.warningNotified = true

    // Emit to parent's child room
    if (io) {
      io.to(`child:${child._id}`).emit('screentime:warning', {
        childId: child._id,
        childName: child.name,
        today,
        limit,
        percent: Math.round(percent),
        message: `${child.name} استخدم ${Math.round(percent)}% من وقت الشاشة المسموح`
      })
    }

    // Send email alert to parent
    if (parent) {
      const template = screenTimeAlertTemplate(parent.name, child.name, today, limit)
      await sendEmail(parent.email, template)
    }
  }

  // Emit block event if limit reached
  if (today >= limit) {
    if (io) {
      io.to(`child:${child._id}`).emit('screentime:blocked', {
        childId: child._id,
        childName: child.name,
        today,
        limit,
        message: `${child.name} خلص وقت الشاشة النهارده`
      })
    }
  }
}

export const startSession = async (childId) => {
  const child = await Child.findById(childId)
  if (!child) throw new Error('الطفل غير موجود')

  resetIfNeeded(child)

  const status = getScreenTimeStatus(child)
  if (!status.allowed) {
    await child.save()
    return { started: false, ...status }
  }

  // Only start a new session if none is active
  if (!child.screenTime.sessionStart) {
    child.screenTime.sessionStart = new Date()
  }

  await child.save()
  return { started: true, ...status }
}

export const endSession = async (childId, parent = null) => {
  const child = await Child.findById(childId)
  if (!child) throw new Error('الطفل غير موجود')

  resetIfNeeded(child)

  if (child.screenTime.sessionStart) {
    const sessionMinutes = Math.floor(
      (Date.now() - new Date(child.screenTime.sessionStart).getTime()) / 60000
    )
    child.screenTime.today += sessionMinutes
    child.screenTime.sessionStart = null
  }

  await notifyParentIfNeeded(child, parent)
  await child.save()

  return getScreenTimeStatus(child)
}

export const getTodayStatus = async (childId) => {
  const child = await Child.findById(childId)
  if (!child) throw new Error('الطفل غير موجود')

  resetIfNeeded(child)

  // Add live session time without saving — gives real-time reading
  let liveToday = child.screenTime.today
  if (child.screenTime.sessionStart) {
    const liveMinutes = Math.floor(
      (Date.now() - new Date(child.screenTime.sessionStart).getTime()) / 60000
    )
    liveToday += liveMinutes
  }

  // Persist reset if it happened
  if (child.isModified()) await child.save()

  const limit = child.settings?.screenTimeLimit ?? 30
  return {
    allowed: liveToday < limit,
    remaining: Math.max(0, limit - liveToday),
    today: liveToday,
    limit,
    sessionActive: !!child.screenTime.sessionStart
  }
}
