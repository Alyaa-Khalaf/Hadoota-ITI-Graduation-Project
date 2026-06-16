import express from 'express'
import {
  getChildAnalysis,
  getTopicRecommendations,
  getWeeklySummary,
  getParentOverview
} from '../controllers/parentAgentController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

// Overview of all children (no AI, fast)
router.get('/overview', getParentOverview)

// Per-child AI endpoints
router.get('/:childId/analysis', getChildAnalysis)
router.get('/:childId/recommendations', getTopicRecommendations)
router.get('/:childId/weekly-summary', getWeeklySummary)

export default router
