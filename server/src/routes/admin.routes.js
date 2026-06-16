import express from 'express';
// 1. استدعاء الحارس الأساسي (ملف واحد فقط وبدون تكرار)
import authMiddleware from '../middleware/auth.js'; 

// 2. استدعاء حارس الأدمن المستقل اللي عملناه
import { isAdmin } from '../middleware/adminAuth.js'; 

// 3. استدعاء الـ Controllers
import { 
  getAdminStats, 
  getRecentActivity, 
  seedPlans, 
  seedKnowledge 
} from '../controllers/admin.controller.js';

const router = express.Router();

// 🔒 كل الـ Routes محمية بالبوابتين ورا بعض بالترتيب

// 📊 1. جلب إحصائيات الـ Dashboard كاملة
router.get('/stats', authMiddleware, isAdmin, getAdminStats);

// 🔄 2. جلب آخر النشاطات (آخر المستخدمين والقصص)
router.get('/recent-activity', authMiddleware, isAdmin, getRecentActivity);

// 🌱 3. إجراء سريع: زرع خطط الأسعار والاشتراكات
router.post('/seed/plans', authMiddleware, isAdmin, seedPlans);

// 📚 4. إجراء سريع: زرع بنك المعرفة والتصنيفات للقصص
router.post('/seed/knowledge', authMiddleware, isAdmin, seedKnowledge);

export default router;