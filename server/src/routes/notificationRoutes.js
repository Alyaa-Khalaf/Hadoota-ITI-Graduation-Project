import express from 'express'
import { body } from 'express-validator'
import authMiddleware from '../middleware/auth.js'
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

router.get('/vapid-public-key', authMiddleware, getVapidKey)

router.post(
  '/send',
  authMiddleware,
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
  authMiddleware,
  updateSettings
)

router.post('/subscribe', authMiddleware, subscribePush)
router.delete('/subscribe', authMiddleware, unsubscribePush)

router.get('/:userId', authMiddleware, getNotifications)
router.put('/:id/read', authMiddleware, markAsRead)

export default router
