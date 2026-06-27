import User from '../models/User.js'
import School from '../models/School.js'
import Transaction from '../models/Transaction.js'

export const upsertTransaction = async (payload) => {
  const filter = payload.paymobTransactionId
    ? { paymobTransactionId: payload.paymobTransactionId }
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
