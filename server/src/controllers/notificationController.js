import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { getVapidPublicKey } from '../services/notifications/pushService.js'
import {
  sendNotification,
  getUserNotifications,
  markNotificationRead,
  updateNotificationSettings,
  subscribeToPush,
  unsubscribeFromPush,
} from '../services/notifications/notificationService.js'

// POST /api/notifications/send
export const sendNotificationHandler = async (req, res) => {
  try {
    const { userId, type, title, message, data, channels, sendEmail, sendPush } = req.body

    if (!userId || !title || !message) {
      return sendError(res, 400, 'userId, title, and message are required')
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return sendError(res, 403, 'Not authorized to send notifications to this user')
    }

    const notification = await sendNotification({
      userId,
      type,
      title,
      message,
      data,
      channels,
      sendEmail,
      sendPush,
    })

    return sendSuccess(res, 201, 'Notification sent successfully', notification)
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}

// GET /api/notifications/:userId
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params

    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return sendError(res, 403, 'Not authorized to view these notifications')
    }

    const { page = 1, limit = 20, unreadOnly } = req.query
    const result = await getUserNotifications(userId, {
      page: Number(page),
      limit: Number(limit),
      unreadOnly: unreadOnly === 'true',
    })

    return sendSuccess(res, 200, 'Notifications fetched successfully', result)
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await markNotificationRead(
      req.params.id,
      req.user._id
    )

    if (!notification) {
      return sendError(res, 404, 'Notification not found')
    }

    return sendSuccess(res, 200, 'Notification marked as read', notification)
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}

// PUT /api/notifications/settings
export const updateSettings = async (req, res) => {
  try {
    const settings = await updateNotificationSettings(req.user._id, req.body)
    return sendSuccess(res, 200, 'Notification settings updated', settings)
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}

// GET /api/notifications/vapid-public-key
export const getVapidKey = async (req, res) => {
  const publicKey = getVapidPublicKey()
  if (!publicKey) {
    return sendError(res, 503, 'Push notifications not configured')
  }
  return sendSuccess(res, 200, 'VAPID public key', { publicKey })
}

// POST /api/notifications/subscribe
export const subscribePush = async (req, res) => {
  try {
    const { subscription } = req.body
    if (!subscription?.endpoint || !subscription?.keys) {
      return sendError(res, 400, 'Valid push subscription is required')
    }

    await subscribeToPush(req.user._id, subscription)
    return sendSuccess(res, 200, 'Push subscription saved')
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}

// DELETE /api/notifications/subscribe
export const unsubscribePush = async (req, res) => {
  try {
    const { endpoint } = req.body
    if (!endpoint) {
      return sendError(res, 400, 'Subscription endpoint is required')
    }

    await unsubscribeFromPush(req.user._id, endpoint)
    return sendSuccess(res, 200, 'Push subscription removed')
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}
