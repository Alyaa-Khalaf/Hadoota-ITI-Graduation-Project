import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { streamMedia } from '../controllers/storyGenerationController.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/:fileId', streamMedia)

export default router
