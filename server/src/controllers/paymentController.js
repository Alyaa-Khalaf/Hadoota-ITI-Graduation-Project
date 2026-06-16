import Stripe from 'stripe'
import User from '../models/User.js'
import { sendEmail } from '../services/emailService.js'
import { subscriptionTemplate } from '../services/notifications/templates/subscriptionConfirmation.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Plan definitions
export const PLANS = {
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO,       // $9/month
    amount: 9,
    trialDays: 7
  },
  family: {
    name: 'Family',
    priceId: process.env.STRIPE_PRICE_FAMILY,     // $15/month
    amount: 15,
    trialDays: 7
  },
  schools: {
    name: 'Schools',
    priceId: process.env.STRIPE_PRICE_SCHOOLS,    // $199/year
    amount: 199,
    trialDays: 7
  }
}

// POST /api/payments/create-checkout
export const createCheckout = async (req, res, next) => {
  try {
    const { plan, coupon } = req.body
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
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود', data: null, errors: [] })

    // Create or reuse Stripe customer
    let customerId = user.subscription?.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: userId.toString() }
      })
      customerId = customer.id
      user.subscription.stripeCustomerId = customerId
      await user.save({ validateBeforeSave: false })
    }

    const selectedPlan = PLANS[plan]

    const sessionParams = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: selectedPlan.trialDays,
        metadata: { userId: userId.toString(), plan }
      },
      success_url: `${process.env.CLIENT_URL}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?payment=cancelled`,
      metadata: { userId: userId.toString(), plan }
    }

    // Apply coupon if provided
    if (coupon) {
      try {
        await stripe.coupons.retrieve(coupon)
        sessionParams.discounts = [{ coupon }]
      } catch {
        return res.status(400).json({
          success: false,
          message: 'الكوبون غير صحيح أو منتهي الصلاحية',
          data: null,
          errors: []
        })
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    res.status(200).json({
      success: true,
      message: 'تم إنشاء جلسة الدفع',
      data: { url: session.url, sessionId: session.id },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/payments/portal
export const getPortal = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id
    const user = await User.findById(userId)

    if (!user?.subscription?.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'مفيش اشتراك نشط — اشترك الأول',
        data: null,
        errors: []
      })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`
    })

    res.status(200).json({
      success: true,
      message: 'تم إنشاء رابط البوابة',
      data: { url: portalSession.url },
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

    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود', data: null, errors: [] })

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

// POST /api/payments/webhook  (raw body required — configured in routes)
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object
        const { userId, plan } = session.metadata

        const user = await User.findById(userId)
        if (!user) break

        const trialEnd = session.subscription
          ? (await stripe.subscriptions.retrieve(session.subscription)).trial_end
          : null

        user.subscription.plan = plan
        user.subscription.status = 'active'
        user.subscription.stripeSubscriptionId = session.subscription
        user.subscription.stripeCustomerId = session.customer
        if (trialEnd) user.subscription.expiresAt = new Date(trialEnd * 1000)

        await user.save({ validateBeforeSave: false })

        const selectedPlan = PLANS[plan]
        const renewalDate = user.subscription.expiresAt
          ? user.subscription.expiresAt.toLocaleDateString('ar-EG')
          : 'شهرياً'

        await sendEmail(
          user.email,
          subscriptionTemplate(user.name, selectedPlan.name, selectedPlan.amount, renewalDate)
        )

        console.log(`✅ Subscription activated: ${userId} → ${plan}`)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const user = await User.findOne({ 'subscription.stripeSubscriptionId': sub.id })
        if (!user) break

        const statusMap = { active: 'active', trialing: 'active', past_due: 'inactive', canceled: 'cancelled', unpaid: 'inactive' }
        user.subscription.status = statusMap[sub.status] || 'inactive'
        if (sub.current_period_end) {
          user.subscription.expiresAt = new Date(sub.current_period_end * 1000)
        }

        await user.save({ validateBeforeSave: false })
        console.log(`🔄 Subscription updated: ${user.email} → ${sub.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const user = await User.findOne({ 'subscription.stripeSubscriptionId': sub.id })
        if (!user) break

        user.subscription.plan = 'free'
        user.subscription.status = 'cancelled'
        user.subscription.stripeSubscriptionId = null

        await user.save({ validateBeforeSave: false })
        console.log(`❌ Subscription cancelled: ${user.email}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const user = await User.findOne({ 'subscription.stripeCustomerId': invoice.customer })
        if (!user) break

        user.subscription.status = 'inactive'
        await user.save({ validateBeforeSave: false })
        console.log(`💳 Payment failed: ${user.email}`)
        break
      }

      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}
