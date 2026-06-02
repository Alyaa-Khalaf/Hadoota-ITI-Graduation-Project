import express from 'express';
import * as progressController from '../controllers/progressController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:childId', auth, progressController.getProgress);
router.put('/:childId', auth, progressController.updateProgress);
router.get('/:childId/weekly', auth, progressController.getWeeklyReport);

export default router;