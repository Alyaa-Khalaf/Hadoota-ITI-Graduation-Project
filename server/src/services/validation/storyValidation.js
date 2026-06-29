import { body, param, query } from 'express-validator'

export const generateStoryValidation = [
  body('childId')
    .trim()
    .notEmpty().withMessage('معرف الطفل مطلوب')
    .isMongoId().withMessage('معرف الطفل غير صحيح'),
  body('character')
    .trim()
    .notEmpty().withMessage('الشخصية مطلوبة')
    .isIn([
      'أسد',
      'أميرة',
      'رحالة',
      'روبوت',
      'تنين',
      'رائد فضاء',
      'البطل الخارق',
      'قطة لطيفة'
    ]).withMessage('الشخصية غير صحيحة'),
  body('topic')
    .trim()
    .notEmpty().withMessage('الموضوع مطلوب')
    .isLength({ min: 3, max: 100 }).withMessage('الموضوع يجب أن يكون بين 3 و 100 حرف')
]

export const storyChoiceValidation = [
  param('id')
    .trim()
    .notEmpty().withMessage('معرف الحدوتة مطلوب')
    .isMongoId().withMessage('معرف الحدوتة غير صحيح'),
  body('choice')
    .isInt({ min: 0, max: 2 }).withMessage('الاختيار يجب أن يكون رقماً بين 0 و 2')
]

export const getStoryHistoryValidation = [
  param('childId')
    .trim()
    .notEmpty().withMessage('معرف الطفل مطلوب')
    .isMongoId().withMessage('معرف الطفل غير صحيح'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون موجباً'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('الحد الأقصى يجب أن يكون بين 1 و 50'),
  query('character')
    .optional()
    .isIn(['أسد', 'أميرة', 'رحالة']).withMessage('الشخصية غير صحيحة'),
  query('topic')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('الموضوع طول غير صحيح')
]

export const getSingleStoryValidation = [
  param('id')
    .trim()
    .notEmpty().withMessage('معرف الحدوتة مطلوب')
    .isMongoId().withMessage('معرف الحدوتة غير صحيح')
]

export const updateStoryValidation = [
  param('id')
    .trim()
    .notEmpty().withMessage('معرف الحدوتة مطلوب')
    .isMongoId().withMessage('معرف الحدوتة غير صحيح'),
  body('isFavorite')
    .optional()
    .isBoolean().withMessage('isFavorite يجب أن يكون قيمة صحيحة'),
  body('status')
    .optional()
    .isIn(['generating', 'completed', 'failed']).withMessage('حالة غير صحيحة')
]
