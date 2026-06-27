import User from '../models/User.js'
import { sendEmail } from '../services/emailService.js'
import { subscriptionTemplate } from '../services/notifications/templates/subscriptionConfirmation.js'
import { createIntention, buildCheckoutUrl, verifyHmac } from '../services/paymobService.js'
import { recordPaymobTransaction, recordPendingCheckout } from '../services/transactionService.js'

// Plan definitions — Paymob is one-time payment, so each plan has an
// amount (in EGP) and a duration after which the subscription expires.
export const PLANS = {
  pro: {
    name: 'Pro',
    amount: 149,          // EGP / month
    durationDays: 30
  },
  family: {
    name: 'Family',
    amount: 249,          // EGP / month
    durationDays: 30
  },
  schools: {
    name: 'Schools',
    amount: 4999,         // EGP / year
    durationDays: 365
  }
}

// POST /api/payments/create-checkout
export const createCheckout = async (req, res, next) => {
  try {
    const { plan } = req.body
    const userId = req.user?.id || req.user?._id

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'الخطة غير صحيحة — اختر: pro, family, schools',
        data: null,
        errors: []
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود', data: null, errors: [] })
    }

    const selectedPlan = PLANS[plan]

    // Unique reference echoed back by Paymob as merchant_order_id.
    const reference = `${userId}_${plan}_${Date.now()}`

    const { clientSecret } = await createIntention({
      amountCents: selectedPlan.amount * 100,
      reference,
      user,
      plan,
      planName: selectedPlan.name,
      notificationUrl: `${process.env.SERVER_URL || ''}/api/payments/webhook`,
      redirectionUrl: `${process.env.CLIENT_URL}/dashboard/subscription?payment=processing`
    })

    // Persist a pending marker so we can correlate the callback.
    user.subscription.provider = 'paymob'
    user.subscription.lastReference = reference
    await user.save({ validateBeforeSave: false })

    await recordPendingCheckout({
      userId,
      plan,
      reference,
      amount: selectedPlan.amount,
    })

    const url = buildCheckoutUrl(clientSecret)

    res.status(200).json({
      success: true,
      message: 'تم إنشاء جلسة الدفع',
      data: { url, clientSecret },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/payments/status
export const getSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const user = await User.findById(userId).select('subscription name email')

    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود', data: null, errors: [] })
    }

    res.status(200).json({
      success: true,
      message: 'تم جلب حالة الاشتراك',
      data: user.subscription,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/payments/webhook
// Paymob server-to-server "transaction processed" callback.
// Body: { type, obj: {...transaction...} }, with hmac in the query string.
export const handleCallback = async (req, res) => {
  try {
    const receivedHmac = req.query.hmac
    const obj = req.body?.obj

    if (!obj || !verifyHmac(obj, receivedHmac)) {
      console.error('Paymob callback: HMAC verification failed')
      // 200 so Paymob does not retry an unverifiable payload, but do nothing.
      return res.status(200).json({ received: true, verified: false })
    }

    const extras = obj.payment_key_claims?.extra || obj.order?.extras || {}
    const reference = obj.order?.merchant_order_id

    // Prefer extras; fall back to parsing our special_reference: `${userId}_${plan}_${ts}`
    let userId = extras.userId
    let plan = extras.plan
    if ((!userId || !plan) && typeof reference === 'string') {
      const [refUser, refPlan] = reference.split('_')
      userId = userId || refUser
      plan = plan || refPlan
    }

    const isSuccess = obj.success === true && obj.error_occured === false

    if (!isSuccess) {
      await recordPaymobTransaction({ obj, userId, plan, status: 'failed' })
      console.log(`Paymob callback: transaction ${obj.id} not successful (success=${obj.success})`)
      return res.status(200).json({ received: true })
    }

    if (!userId || !PLANS[plan]) {
      console.error(`Paymob callback: missing/invalid extras (userId=${userId}, plan=${plan})`)
      return res.status(200).json({ received: true })
    }

    const user = await User.findById(userId)
    if (!user) {
      console.error(`Paymob callback: user ${userId} not found`)
      return res.status(200).json({ received: true })
    }

    const selectedPlan = PLANS[plan]
    const expiresAt = new Date(Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000)

    user.subscription.plan = plan
    user.subscription.status = 'active'
    user.subscription.provider = 'paymob'
    user.subscription.expiresAt = expiresAt
    user.subscription.paymobOrderId = obj.order?.id ? String(obj.order.id) : user.subscription.paymobOrderId
    user.subscription.lastTransactionId = String(obj.id)
    if (reference) user.subscription.lastReference = reference

    await user.save({ validateBeforeSave: false })
    await recordPaymobTransaction({ obj, userId, plan, status: 'succeeded' })

    const renewalDate = expiresAt.toLocaleDateString('ar-EG')
    try {
      await sendEmail(
        user.email,
        subscriptionTemplate(user.name, selectedPlan.name, selectedPlan.amount, renewalDate)
      )
    } catch (emailErr) {
      console.error('Paymob callback: confirmation email failed:', emailErr.message)
    }

    console.log(`✅ Subscription activated via Paymob: ${userId} → ${plan} (txn ${obj.id})`)
    return res.status(200).json({ received: true, verified: true })
  } catch (error) {
    console.error('Paymob callback handler error:', error)
    // Still 200 — webhook errors should not trigger infinite Paymob retries.
    return res.status(200).json({ received: true, error: true })
  }
}
