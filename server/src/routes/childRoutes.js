import express from 'express'
import { body, param } from 'express-validator'
import {
  createChild,
  getChild,
  getChildren
} from '../controllers/childController.js'
import authMiddleware from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

router.use(authMiddleware)

// Create child
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('اسم الطفل مطلوب')
      .isLength({ max: 50 }).withMessage('الاسم لا يزيد عن 50 حرف'),
    body('age')
      .isInt({ min: 3, max: 12 }).withMessage('العمر يجب أن يكون بين 3 و 12 سنة'),
    body('interests')
      .optional()
      .isArray().withMessage('الاهتمامات يجب أن تكون قائمة'),
    body('learningLevel')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced']).withMessage('مستوى التعلم غير صحيح')
  ],
  validate,
  createChild
)

// Get all children for current user
router.get('/', getChildren)

// Get single child
router.get(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty().withMessage('معرف الطفل مطلوب')
      .isMongoId().withMessage('معرف الطفل غير صحيح')
  ],
  validate,
  getChild
)

export default router
