import webpush from 'web-push'

let initialized = false

const initWebPush = () => {
  if (initialized) return Boolean(process.env.VAPID_PUBLIC_KEY)
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn('⚠️ VAPID keys not set — push notifications will be skipped')
    return false
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@hadoota.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
  initialized = true
  return true
}

export const getVapidPublicKey = () => process.env.VAPID_PUBLIC_KEY || null

export const sendPushToUser = async (user, payload) => {
  if (!initWebPush() || !user.pushSubscriptions?.length) {
    return { sent: 0, failed: 0 }
  }

  const notification = JSON.stringify(payload)
  let sent = 0
  let failed = 0
  const staleEndpoints = []

  await Promise.all(
    user.pushSubscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          notification
        )
        sent++
      } catch (error) {
        failed++
        if (error.statusCode === 404 || error.statusCode === 410) {
          staleEndpoints.push(sub.endpoint)
        }
      }
    })
  )

  return { sent, failed, staleEndpoints }
}
