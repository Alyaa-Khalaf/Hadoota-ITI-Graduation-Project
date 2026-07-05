import Child from '../models/Child.js'
import { io } from '../index.js'
import { screenTimeAlertTemplate } from './notifications/templates/screenTimeAlert.js'
import { sendEmail } from './emailService.js'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const HISTORY_KEEP_DAYS = 90 // نحتفظ بآخر 90 يوم بس عشان الـ document ميكبرش أوي

const getMidnight = (d = new Date()) => {
  const midnight = new Date(d)
  midnight.setHours(0, 0, 0, 0)
  return midnight
}

// بداية الأسبوع الحالي — الأسبوع يبدأ يوم السبت (6)
// مهم: لازم تفضل نفس القيمة بالظبط زي getWeekStart في progressController.js
// عشان تقرير وقت الشاشة وتقرير النقط يحسبوا نفس حدود الأسبوع
const getWeekStart = (d = new Date(), startDay = 6) => {
  const midnight = getMidnight(d)
  const day = midnight.getDay() // 0 = أحد ... 6 = سبت
  const diff = (day - startDay + 7) % 7
  midnight.setDate(midnight.getDate() - diff)
  return midnight
}

// Resets today's screen time if lastReset is before today's midnight
// وقبل ما يصفّر، يحفظ يوم أمس في الـ history عشان التقارير الأسبوعية/الشهرية
const resetIfNeeded = (child) => {
  const midnight = getMidnight()

  if (!child.screenTime.lastReset || child.screenTime.lastReset < midnight) {
    // احفظ اليوم اللي فات في الـ history (لو فيه وقت اتسجل فعلاً)
    if (child.screenTime.lastReset) {
      const dayOfEntry = getMidnight(child.screenTime.lastReset)
      child.screenTime.history.push({
        date: dayOfEntry,
        minutes: child.screenTime.today || 0
      })

      // تنضيف: امسح أي history أقدم من HISTORY_KEEP_DAYS
      const cutoff = new Date(Date.now() - HISTORY_KEEP_DAYS * MS_PER_DAY)
      child.screenTime.history = child.screenTime.history.filter(h => h.date >= cutoff)
    }

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

    if (parent) {
      const template = screenTimeAlertTemplate(parent.name, child.name, today, limit)
      await sendEmail(parent.email, template)
    }
  }

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

  let liveToday = child.screenTime.today
  if (child.screenTime.sessionStart) {
    const liveMinutes = Math.floor(
      (Date.now() - new Date(child.screenTime.sessionStart).getTime()) / 60000
    )
    liveToday += liveMinutes
  }

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

// ---------------------------------------------
// تقرير أسبوعي
// ---------------------------------------------

// Returns { weekStart, weekTotal, dailyLimit, days: [{ date, minutes }] }
export const getWeeklyStatus = async (childId) => {
  const child = await Child.findById(childId)
  if (!child) throw new Error('الطفل غير موجود')

  // ده يحفظ يوم أمس في الـ history لو فات نص الليل
  resetIfNeeded(child)
  if (child.isModified()) await child.save()

  const weekStart = getWeekStart()
  const limit = child.settings?.screenTimeLimit ?? 30

  // ابني مصفوفة السبع أيام كاملة (حتى الأيام اللي مفيهاش استخدام = صفر)
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    days.push({ date: d, minutes: 0 })
  }

  // املا من الـ history
  child.screenTime.history
    .filter(h => h.date >= weekStart)
    .forEach(h => {
      const entry = days.find(d => d.date.getTime() === getMidnight(h.date).getTime())
      if (entry) entry.minutes = h.minutes
    })

  // ضيف وقت النهاردة (اللي لسه في today، مش في history)
  let liveToday = child.screenTime.today
  if (child.screenTime.sessionStart) {
    liveToday += Math.floor((Date.now() - new Date(child.screenTime.sessionStart).getTime()) / 60000)
  }
  const todayMidnight = getMidnight()
  const todayEntry = days.find(d => d.date.getTime() === todayMidnight.getTime())
  if (todayEntry) todayEntry.minutes = liveToday

  const weekTotal = days.reduce((sum, d) => sum + d.minutes, 0)

  return {
    weekStart,
    weekTotal,
    dailyLimit: limit,
    days
  }
}