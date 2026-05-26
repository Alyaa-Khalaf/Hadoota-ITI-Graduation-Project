import express from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword
} from '../controllers/authController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.post('/forgot-password', forgotPassword)

// Protected routes
router.post('/logout', authMiddleware, logout)

export default router
