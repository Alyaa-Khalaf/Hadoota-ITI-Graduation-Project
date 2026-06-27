import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    provider: {
      type: String,
      enum: ['paymob', 'stripe'],
      default: 'paymob',
    },
    paymobTransactionId: {
      type: String,
      default: null,
    },
    paymobOrderId: String,
    reference: String,
    // Legacy Stripe fields (kept for old rows)
    stripeInvoiceId: String,
    stripeSessionId: String,
    stripeCustomerId: String,
    stripePaymentIntentId: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'egp',
    },
    plan: String,
    status: {
      type: String,
      enum: ['succeeded', 'failed', 'pending', 'refunded'],
      default: 'succeeded',
    },
    description: String,
  },
  { timestamps: true }
)

transactionSchema.index({ paymobTransactionId: 1 }, { unique: true, sparse: true })
transactionSchema.index({ stripeInvoiceId: 1 }, { unique: true, sparse: true })
transactionSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true })
transactionSchema.index({ userId: 1, createdAt: -1 })
transactionSchema.index({ createdAt: -1 })

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction
