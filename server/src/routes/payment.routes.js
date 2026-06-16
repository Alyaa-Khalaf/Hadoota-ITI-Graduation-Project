import express from 'express'
import {
  createCheckout,
  handleWebhook,
  getPortal,
  getSubscriptionStatus
} from '../controllers/paymentController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Stripe webhook — must use raw body BEFORE express.json() parses it
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook)

// Protected routes
router.use(authMiddleware)

router.post('/create-checkout', createCheckout)
router.get('/portal', getPortal)
router.get('/status', getSubscriptionStatus)

export default router
