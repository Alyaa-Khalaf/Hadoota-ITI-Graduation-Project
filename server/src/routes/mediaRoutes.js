import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { streamMedia } from '../controllers/storyGenerationController.js'

const router = express.Router()

router.use(protect)
router.get('/:fileId', streamMedia)

export default router
