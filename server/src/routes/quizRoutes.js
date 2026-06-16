import express from 'express'
import { body, param } from 'express-validator'
import { generateQuiz, submitQuiz, getChildQuizHistory } from '../controllers/quizController.js'
import authMiddleware from '../middleware/auth.js'
import { verifyChildOwnership } from '../middleware/childOwnershipMiddleware.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// تطبيق حماية الحساب على جميع مسارات الكويزات
router.use(authMiddleware)

// 1️⃣ توليد كويز بالـ AI بعد الحدوتة
router.post(
  '/generate/:storyId',
  [
    param('storyId').isMongoId().withMessage('معرف القصة غير صحيح'),
    body('childId').isMongoId().withMessage('معرف الطفل مطلوب وصحيح')
  ],
  validate,
  verifyChildOwnership,
  generateQuiz
)

// 2️⃣ تسليم إجابات الكويز وحساب النتيجة والـ Gamification
router.post(
  '/submit',
  [
    body('quizId').isMongoId().withMessage('معرف الكويز غير صحيح'),
    body('childId').isMongoId().withMessage('معرف الطفل غير صحيح'),
    body('userAnswers').isArray({ min: 1 }).withMessage('يجب إرسال مصفوفة الإجابات الخاصة بالطفل'),
    body('userAnswers.*.questionIndex').isInt({ min: 0 }).withMessage('مؤشر السؤال غير صحيح'),
    body('userAnswers.*.selectedOption').isInt({ min: 0 }).withMessage('مؤشر الخيار المختار غير صحيح')
  ],
  validate,
  verifyChildOwnership,
  submitQuiz
)

// 3️⃣ تاريخ الكويزات الخاص بطفل محدد
router.get(
  '/:childId/history',
  [
    param('childId').isMongoId().withMessage('معرف الطفل غير صحيح')
  ],
  validate,
  verifyChildOwnership,
  getChildQuizHistory
)

export default router