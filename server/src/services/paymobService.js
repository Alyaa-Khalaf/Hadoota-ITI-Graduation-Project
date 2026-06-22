import crypto from 'crypto'

// ===== Paymob configuration (from env) =====
const BASE_URL = process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com'
const SECRET_KEY = process.env.PAYMOB_SECRET_KEY
const PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY
const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET
const INTEGRATION_ID_CARD = process.env.PAYMOB_INTEGRATION_ID_CARD

/**
 * Create a Paymob payment Intention.
 * Uses the modern Unified Intention API (secret-key auth, single call).
 *
 * @param {Object} opts
 * @param {number} opts.amountCents  Amount in piasters (EGP * 100)
 * @param {string} opts.reference    Unique merchant reference (special_reference)
 * @param {Object} opts.user         User doc ({ name, email })
 * @param {string} opts.plan         Plan key (pro|family|schools)
 * @param {string} opts.planName     Human-readable plan name (for items)
 * @param {string} opts.notificationUrl  Server-to-server callback URL
 * @param {string} opts.redirectionUrl   Browser redirect URL after checkout
 * @returns {Promise<{ clientSecret: string, raw: object }>}
 */
export const createIntention = async ({
  amountCents,
  reference,
  user,
  plan,
  planName,
  notificationUrl,
  redirectionUrl
}) => {
  if (!SECRET_KEY) throw new Error('PAYMOB_SECRET_KEY is not configured')
  if (!INTEGRATION_ID_CARD) throw new Error('PAYMOB_INTEGRATION_ID_CARD is not configured')

  // Split name into first/last for billing_data (Paymob requires both)
  const nameParts = (user.name || 'Customer').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Customer'
  const lastName = nameParts.slice(1).join(' ') || firstName

  const body = {
    amount: amountCents,
    currency: 'EGP',
    payment_methods: [Number(INTEGRATION_ID_CARD)],
    items: [
      {
        name: planName || plan,
        amount: amountCents,
        description: `Hadoota ${planName || plan} subscription`,
        quantity: 1
      }
    ],
    billing_data: {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone_number: user.phone || 'NA',
      // Paymob rejects empty strings for these — send "NA" placeholders
      apartment: 'NA',
      floor: 'NA',
      street: 'NA',
      building: 'NA',
      city: 'NA',
      state: 'NA',
      country: 'EG',
      postal_code: 'NA'
    },
    special_reference: reference,
    extras: {
      userId: (user._id || user.id).toString(),
      plan
    },
    notification_url: notificationUrl,
    redirection_url: redirectionUrl
  }

  const res = await fetch(`${BASE_URL}/v1/intention/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${SECRET_KEY}`
    },
    body: JSON.stringify(body)
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok || !data.client_secret) {
    const detail = data?.detail || JSON.stringify(data)
    throw new Error(`Paymob intention failed (${res.status}): ${detail}`)
  }

  return { clientSecret: data.client_secret, raw: data }
}

/**
 * Build the hosted Unified Checkout URL the customer is redirected to.
 */
export const buildCheckoutUrl = (clientSecret) => {
  if (!PUBLIC_KEY) throw new Error('PAYMOB_PUBLIC_KEY is not configured')
  return `${BASE_URL}/unifiedcheckout/?publicKey=${encodeURIComponent(PUBLIC_KEY)}&clientSecret=${encodeURIComponent(clientSecret)}`
}

// Fields concatenated (in this exact order) to compute the transaction HMAC.
// Order is fixed by Paymob — do not re-sort. Note Paymob's spelling: "error_occured".
const HMAC_FIELDS = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order.id',
  'owner',
  'pending',
  'source_data.pan',
  'source_data.sub_type',
  'source_data.type',
  'success'
]

// Resolve a possibly-dotted key (e.g. "order.id") from the transaction object.
const resolveField = (obj, path) => {
  const value = path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
  if (value === null || value === undefined) return ''
  // Paymob serializes booleans lowercase ("true"/"false") in the signed string.
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

/**
 * Verify a Paymob callback HMAC.
 * @param {Object} obj           The callback transaction object (req.body.obj)
 * @param {string} receivedHmac  The hmac query param / value sent by Paymob
 * @returns {boolean}
 */
export const verifyHmac = (obj, receivedHmac) => {
  if (!HMAC_SECRET) throw new Error('PAYMOB_HMAC_SECRET is not configured')
  if (!obj || !receivedHmac) return false

  const concatenated = HMAC_FIELDS.map((field) => resolveField(obj, field)).join('')
  const computed = crypto
    .createHmac('sha512', HMAC_SECRET)
    .update(concatenated)
    .digest('hex')

  // Constant-time compare to avoid timing leaks.
  const a = Buffer.from(computed)
  const b = Buffer.from(String(receivedHmac))
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export default { createIntention, buildCheckoutUrl, verifyHmac }
