import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
} from '../services/notifications/notificationService.js'

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  })
}

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  })
}

// @desc    Register
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'الإيميل ده موجود بالفعل',
        data: null,
        errors: []
      })
    }

    const user = await User.create({ name, email, password })

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    sendWelcomeEmail(user).catch((err) =>
      console.error('Welcome email failed:', err.message)
    )

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscription: user.subscription
        },
        accessToken,
        refreshToken
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'الإيميل أو الباسورد غلط',
        data: null,
        errors: []
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'الإيميل أو الباسورد غلط',
        data: null,
        errors: []
      })
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscription: user.subscription
        },
        accessToken,
        refreshToken
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null })

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
      data: null,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'الـ Refresh Token مطلوب',
        data: null,
        errors: []
      })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'الـ Refresh Token غير صالح',
        data: null,
        errors: []
      })
    }

    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
      success: true,
      message: 'تم تجديد الـ Token بنجاح',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'مفيش حساب بالإيميل ده',
        data: null,
        errors: []
      })
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000
    await user.save({ validateBeforeSave: false })

    sendResetPasswordEmail(user, resetToken).catch((err) =>
      console.error('Reset password email failed:', err.message)
    )

    res.status(200).json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين الباسورد على إيميلك',
      data: null,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('+resetPasswordToken +resetPasswordExpires')

    if (!user || user.resetPasswordToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: 'الـ Token غير صالح',
        data: null,
        errors: []
      })
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'الـ Token منتهي الصلاحية — اطلب رابط جديد',
        data: null,
        errors: []
      })
    }

    user.password = newPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    res.status(200).json({
      success: true,
      message: 'تم تغيير الباسورد بنجاح',
      data: null,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}
