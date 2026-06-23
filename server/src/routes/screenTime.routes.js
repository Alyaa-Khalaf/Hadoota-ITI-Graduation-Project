import express from 'express'
import { startScreenTime, endScreenTime, getTodayScreenTime } from '../controllers/screenTimeController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/:childId/start', startScreenTime)
router.post('/:childId/end', endScreenTime)
router.get('/:childId/today', getTodayScreenTime)

export default router
