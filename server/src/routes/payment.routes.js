import express from 'express'
import {
  createCheckout,
  handleCallback,
  getSubscriptionStatus
} from '../controllers/paymentController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Paymob server-to-server callback — public, JSON body (parsed by global express.json()).
// HMAC in query string is verified inside the handler.
router.post('/webhook', handleCallback)

// Protected routes
router.use(authMiddleware)

router.post('/create-checkout', createCheckout)
router.get('/status', getSubscriptionStatus)

export default router
