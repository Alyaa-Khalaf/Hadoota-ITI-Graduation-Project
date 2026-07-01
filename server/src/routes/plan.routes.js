import express from 'express'
import { listPublicPlans } from '../controllers/planController.js'

const router = express.Router()

// Public — قائمة خطط الاشتراك المتاحة
router.get('/', listPublicPlans)

export default router
