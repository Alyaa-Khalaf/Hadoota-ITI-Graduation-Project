import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js'
import authMiddleware from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// Register validation rules
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('الاسم مطلوب')
    .isLength({ max: 50 }).withMessage('الاسم لا يزيد عن 50 حرف'),
  body('email')
    .trim()
    .notEmpty().withMessage('الإيميل مطلوب')
    .isEmail().withMessage('الإيميل غير صحيح'),
  body('password')
    .notEmpty().withMessage('الباسورد مطلوب')
    .isLength({ min: 8 }).withMessage('الباسورد لا يقل عن 8 أحرف')
]

// Login validation rules
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('الإيميل مطلوب')
    .isEmail().withMessage('الإيميل غير صحيح'),
  body('password')
    .notEmpty().withMessage('الباسورد مطلوب')
]

// Forgot password validation rules
const forgotPasswordRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('الإيميل مطلوب')
    .isEmail().withMessage('الإيميل غير صحيح')
]

// Public routes
router.post('/register', registerRules, validate, register)
router.post('/login', loginRules, validate, login)
router.post('/refresh', refreshToken)
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword)

// Reset password validation rules
const resetPasswordRules = [
  body('resetToken')
    .notEmpty().withMessage('الـ Token مطلوب'),
  body('newPassword')
    .notEmpty().withMessage('الباسورد الجديد مطلوب')
    .isLength({ min: 8 }).withMessage('الباسورد لا يقل عن 8 أحرف')
]

router.post('/reset-password', resetPasswordRules, validate, resetPassword)

// Protected routes
router.post('/logout', authMiddleware, logout)

export default router
