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
import {
  generateStoryValidation,
  storyChoiceValidation,
  getStoryHistoryValidation,
  getSingleStoryValidation,
  updateStoryValidation
} from '../services/validation/storyValidation.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Generate new story
router.post(
  '/generate',
  generateStoryValidation,
  validate,
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
