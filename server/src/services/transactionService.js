import User from '../models/User.js'
import School from '../models/School.js'
import Transaction from '../models/Transaction.js'

const PLAN_AMOUNTS = {
  pro: 149,
  family: 249,
  schools: 4999,
}

export const upsertTransaction = async (payload) => {
  const filter = payload.paymobTransactionId
    ? { paymobTransactionId: payload.paymobTransactionId }
    : payload.reference
      ? { reference: payload.reference }
      : payload.stripeInvoiceId
        ? { stripeInvoiceId: payload.stripeInvoiceId }
        : payload.stripeSessionId
          ? { stripeSessionId: payload.stripeSessionId }
          : null

  if (!filter) return null

  return Transaction.findOneAndUpdate(filter, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  })
}

export const recordPendingCheckout = async ({ userId, plan, reference, amount }) => {
  return upsertTransaction({
    userId,
    provider: 'paymob',
    reference,
    amount,
    currency: 'egp',
    plan,
    status: 'pending',
    description: `اشتراك ${plan} — قيد الدفع`,
  })
}

/**
 * Persist a Paymob callback transaction for the admin dashboard.
 */
export const recordPaymobTransaction = async ({ obj, userId, plan, status }) => {
  if (!obj?.id) return null

  let schoolId = null
  let resolvedUserId = userId || null

  if (resolvedUserId) {
    const user = await User.findById(resolvedUserId).select('_id schoolId role')
    if (user?.role === 'teacher' && user.schoolId) {
      schoolId = user.schoolId
    }
  }

  const reference = obj.order?.merchant_order_id || null
  const amount = (obj.amount_cents || 0) / 100

  return upsertTransaction({
    userId: resolvedUserId,
    schoolId,
    provider: 'paymob',
    paymobTransactionId: String(obj.id),
    paymobOrderId: obj.order?.id ? String(obj.order.id) : null,
    reference,
    amount,
    currency: (obj.currency || 'EGP').toLowerCase(),
    plan: plan || null,
    status,
    description: plan ? `اشتراك ${plan}` : 'عملية دفع Paymob',
  })
}

/**
 * Backfill Transaction records from users who already paid via Paymob.
 */
export const syncTransactionsFromUsers = async () => {
  const users = await User.find({
    $or: [
      { 'subscription.lastTransactionId': { $exists: true, $ne: null } },
      { 'subscription.lastReference': { $exists: true, $ne: null } },
      {
        'subscription.plan': { $in: ['pro', 'family', 'schools'] },
        'subscription.provider': 'paymob',
      },
    ],
  }).select('subscription email name')

  let synced = 0

  for (const user of users) {
    const sub = user.subscription || {}
    const plan = sub.plan
    if (!plan || plan === 'free') continue

    const amount = PLAN_AMOUNTS[plan] || 0
    const txnId = sub.lastTransactionId
    const reference = sub.lastReference

    if (!txnId && !reference) continue

    const status =
      sub.status === 'active' ? 'succeeded' : sub.status === 'inactive' ? 'failed' : 'pending'

    await upsertTransaction({
      userId: user._id,
      provider: 'paymob',
      ...(txnId && { paymobTransactionId: String(txnId) }),
      ...(reference && { reference }),
      paymobOrderId: sub.paymobOrderId || null,
      amount,
      currency: 'egp',
      plan,
      status,
      description: `اشتراك ${plan}`,
    })
    synced += 1
  }

  return synced
}
