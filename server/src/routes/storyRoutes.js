import express from 'express'
import {
  generateStory,
  recordStoryChoice,
  getStoryHistory,
  getSingleStory,
  updateStory
} from '../controllers/storyController.js'
import authMiddleware from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { checkPlanLimit } from '../middleware/subscriptionMiddleware.js'
import {
  generateStoryValidation,
  storyChoiceValidation,
  getStoryHistoryValidation,
  getSingleStoryValidation,
  updateStoryValidation
} from '../services/validation/storyValidation.js'
import Story from '../models/Story.js'
import Child from '../models/Child.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Helper: جيب عدد القصص المكتملة للـ parent ده عبر كل أطفاله
const getUserStoryCount = async (userId) => {
  const children = await Child.find({ parentId: userId }).select('_id')
  const childIds = children.map((c) => c._id)
  return Story.countDocuments({ childId: { $in: childIds }, status: 'completed' })
}

// Generate new story — محمية بـ storiesCount limit
router.post(
  '/generate',
  generateStoryValidation,
  validate,
  checkPlanLimit('storiesCount', getUserStoryCount),
  generateStory
)

// Record story choice
router.post(
  '/:id/choice',
  storyChoiceValidation,
  validate,
  recordStoryChoice
)

// Get story history for a child
router.get(
  '/history/:childId',
  getStoryHistoryValidation,
  validate,
  getStoryHistory
)

// Get single story
router.get(
  '/:id',
  getSingleStoryValidation,
  validate,
  getSingleStory
)

// Update story
router.patch(
  '/:id',
  updateStoryValidation,
  validate,
  updateStory
)

export default router