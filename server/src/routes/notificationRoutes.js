import express from 'express'
import { body } from 'express-validator'
import { protect } from '../middleware/authMiddleware.js'
import validate from '../middleware/validate.js'
import {
  sendNotificationHandler,
  getNotifications,
  markAsRead,
  updateSettings,
  getVapidKey,
  subscribePush,
  unsubscribePush,
} from '../controllers/notificationController.js'

const router = express.Router()

router.get('/vapid-public-key', protect, getVapidKey)

router.post(
  '/send',
  protect,
  [
    body('userId').notEmpty().withMessage('userId is required'),
    body('title').notEmpty().withMessage('title is required'),
    body('message').notEmpty().withMessage('message is required'),
  ],
  validate,
  sendNotificationHandler
)

router.put(
  '/settings',
  protect,
  updateSettings
)

router.post('/subscribe', protect, subscribePush)
router.delete('/subscribe', protect, unsubscribePush)

router.get('/:userId', protect, getNotifications)
router.put('/:id/read', protect, markAsRead)

export default router
