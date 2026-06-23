/** Server origin without /api suffix — devStage3 appends /api/... in fetch calls */
export const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/api\/?$/, '')

export const API_BASE = `${API_ORIGIN}/api`
