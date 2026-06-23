import express from 'express';
const router = express.Router();
import { getPersonalizationProfile, updatePersonalizationProfile } from '../controllers/personalizationController.js';

// 🌟 الـ Imports المظبوطة بالأسماء الحقيقية للملفات عندك
import { protect } from '../middleware/authMiddleware.js'; 
import { verifyChildOwnership } from '../middleware/childOwnershipMiddleware.js'; // 👈 المسار الحقيقي للملف

// الـ Routes المتأمنة وزي الفل
router.route('/:childId')
  .get(protect, verifyChildOwnership, getPersonalizationProfile)
  .put(protect, verifyChildOwnership, updatePersonalizationProfile);

export default router;