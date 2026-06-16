import express from 'express'
import { body, param } from 'express-validator'
import { generateQuiz, submitQuiz, getChildQuizHistory } from '../controllers/quizController.js'
import authMiddleware from '../middleware/auth.js' // الميديول الخاص بكِ للحماية
import { verifyChildOwnership } from '../middleware/childOwnershipMiddleware.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// تطبيق حماية الحساب على جميع مسارات الكويزات
router.use(authMiddleware)

// 1️⃣ توليد كويز بالـ AI بعد الحدوتة
// نقرأ الـ childId من الـ body للتأكد من ملكيته قبل استدعاء OpenAI
router.post(
  '/generate/:storyId',
  [
    param('storyId').isMongoId().withMessage('معرف القصة غير صحيح'),
    body('childId').isMongoId().withMessage('معرف الطفل مطلوب وصحيح')
  ],
  validate,
  verifyChildOwnership, // التأكد من أن الأب يملك الطفل قبل توليد الأسئلة له
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
  verifyChildOwnership, // حماية النتيجة؛ لا يمكن لأب تسليم كويز لطفل آخر
  submitQuiz
)

// 3️⃣ تاريخ الكويزات الخاص بطفل محدد
router.get(
  '/:childId/history',
  [
    param('childId').isMongoId().withMessage('معرف الطفل غير صحيح')
  ],
  validate,
  verifyChildOwnership, // الأمان: الأب يرى تاريخ أطفاله فقط
  getChildQuizHistory
)

export default router