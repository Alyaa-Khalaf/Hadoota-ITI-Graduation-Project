import User from '../models/User.js'

// Blocks access if user does not have an active paid subscription
export const requireSubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const user = await User.findById(userId).select('subscription')

    if (!user) {
      return res.status(401).json({ success: false, message: 'غير مصرح', data: null, errors: [] })
    }

    const { plan, status, expiresAt } = user.subscription

    // Free plan always blocked
    if (plan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'هذه الميزة متاحة للمشتركين فقط — اشترك دلوقتي',
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    // Inactive or cancelled
    if (status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'اشتراكك غير نشط — جدد اشتراكك للاستمرار',
        data: { upgradeUrl: `${process.env.CLIENT_URL}/pricing` },
        errors: []
      })
    }

    // Expired
    if (expiresAt && new Date(expiresAt) < new Date()) {
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

// Allows only specific plans (e.g. requirePlan('schools') for school-only features)
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
