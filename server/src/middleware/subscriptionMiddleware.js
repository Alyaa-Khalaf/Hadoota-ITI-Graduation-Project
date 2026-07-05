import User from '../models/User.js'
import Plan from '../models/Plan.js'

// ─────────────────────────────────────────────
// Helper: جيب الـ plan object من الـ DB
// ─────────────────────────────────────────────
const getUserPlan = async (userId) => {
  const user = await User.findById(userId).select('subscription')
  if (!user) return { user: null, plan: null }

  const plan = await Plan.findOne({ slug: user.subscription?.plan })
  return { user, plan }
}

// ─────────────────────────────────────────────
// Helper: هل الاشتراك منتهي؟
// ─────────────────────────────────────────────
const isExpired = (user) => {
  const { expiresAt } = user.subscription
  return expiresAt && new Date(expiresAt) < new Date()
}

// ─────────────────────────────────────────────
// Middleware 1: requireSubscription
// يبلوك الـ free plan ويتأكد إن الاشتراك active ومش منتهي
// ─────────────────────────────────────────────
export const requireSubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const { user } = await getUserPlan(userId)

    if (!user) {
      return res.status(401).json({ success: false, message: 'غير مصرح', data: null, errors: [] })
    }

    const { plan, status } = user.subscription

    if (plan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'هذه الميزة متاحة للمشتركين فقط — اشترك دلوقتي',
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    if (status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'اشتراكك غير نشط — جدد اشتراكك للاستمرار',
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    if (isExpired(user)) {
      return res.status(403).json({
        success: false,
        message: 'انتهى اشتراكك — جدده للاستمرار',
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// Middleware 2: requirePlan
// يسمح بس لـ slugs معينة — زي requirePlan('premium', 'school')
// ─────────────────────────────────────────────
export const requirePlan = (...plans) => async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const user = await User.findById(userId).select('subscription')

    if (!user || !plans.includes(user.subscription?.plan)) {
      return res.status(403).json({
        success: false,
        message: `هذه الميزة متاحة لخطط: ${plans.join(', ')} فقط`,
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// Middleware 3: checkPlanLimit
// بيشيل الـ limit من الـ Plan model ويعمل check حقيقي
//
// الاستخدام في الـ routes:
//   checkPlanLimit('hasPremiumContent')         ← boolean feature
//   checkPlanLimit('storiesCount', getUserStoryCount)  ← عداد + دالة بتجيب الرقم الحالي
//
// ─────────────────────────────────────────────
export const checkPlanLimit = (limitKey, getCurrentCount = null) => async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const { user, plan } = await getUserPlan(userId)

    if (!user) {
      return res.status(401).json({ success: false, message: 'غير مصرح', data: null, errors: [] })
    }

    // لو الاشتراك منتهي — stop هنا
    if (isExpired(user)) {
      return res.status(403).json({
        success: false,
        message: 'انتهى اشتراكك — جدده للاستمرار',
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    // لو مفيش plan في الـ DB — نمشي (fail open للـ free)
    if (!plan) {
      return res.status(403).json({
        success: false,
        message: 'خطة الاشتراك غير موجودة — تواصل مع الدعم',
        data: null,
        errors: []
      })
    }

    const limitValue = plan.limits?.[limitKey]

    // ── حالة 1: Boolean feature (زي hasPremiumContent, hasDownloads)
    if (typeof limitValue === 'boolean') {
      if (!limitValue) {
        return res.status(403).json({
          success: false,
          message: 'هذه الميزة غير متاحة في خطتك الحالية — يرجى الترقية',
          data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing`, currentPlan: plan.slug },
          errors: []
        })
      }
      // attach الـ plan على الـ req عشان الـ controller يستخدمه لو احتاج
      req.userPlan = plan
      return next()
    }

    // ── حالة 2: عداد (زي storiesCount, childrenCount)
    if (typeof limitValue === 'number') {
      // (-1) يعني unlimited — اسمح فوراً
      if (limitValue === -1) {
        req.userPlan = plan
        return next()
      }

      // لو في دالة بتجيب الرقم الحالي — استخدمها
      if (getCurrentCount) {
        const currentCount = await getCurrentCount(userId)
        if (currentCount >= limitValue) {
          return res.status(403).json({
            success: false,
            message: `وصلت للحد الأقصى (${limitValue}) في خطتك الحالية — يرجى الترقية`,
            data: {
              limit: limitValue,
              current: currentCount,
              upgradeUrl: `${process.env.CLIENT_URL}/pricing`,
              currentPlan: plan.slug
            },
            errors: []
          })
        }
      }

      req.userPlan = plan
      return next()
    }

    // لو الـ limitKey مش موجود في الـ plan — اسمح (fail open)
    req.userPlan = plan
    next()
  } catch (error) {
    next(error)
  }
}