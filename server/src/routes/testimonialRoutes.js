import express from 'express';
import { getTestimonials, createTestimonial } from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js'; // تأكدي من مسار واسم ميديالوير الحماية عندكم

const router = express.Router();

router.route('/')
  .get(getTestimonials)             // متاح للجميع لعرض التقييمات في الـ Landing Page
  .post(protect, createTestimonial); // محمي ويتطلب التوكن لإضافة تقييم جديد

export default router;