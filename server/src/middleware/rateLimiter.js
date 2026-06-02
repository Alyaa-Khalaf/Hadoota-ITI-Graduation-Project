import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'محاولات كتير جداً — حاول تاني بعد 15 دقيقة',
    data: null,
    errors: []
  }
})

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'طلبات كتير جداً — حاول تاني بعد دقيقة',
    data: null,
    errors: []
  }
})
