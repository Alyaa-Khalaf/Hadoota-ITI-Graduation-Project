import express from 'express';
import { registerSchool, getSchoolStudents, bulkInviteStudents, updateCurriculum, getSchoolAnalytics } from '../controllers/school.controller.js';

const router = express.Router();

// 👇 حيلة ذكية: ميديول وهمي يمرر بيانات أدمن لتشغيل الـ Testing فوراً بدون لوجن
router.use((req, res, next) => {
  req.user = {
    _id: "65f1a2b3c4d5e6f7a8b9c0d1", // أي ID وهمي بصيغة المونجو
    email: "hend_admin@hadoota.com"   // إيميل وهمي لتسجيل الـ Stripe Customer
  };
  next();
});

// الـ APIs بتاعتكِ كاملة وجاهزة للاختبار الآن
router.post('/register', registerSchool);
router.get('/:id/students', getSchoolStudents);
router.post('/:id/invite', bulkInviteStudents);
router.put('/:id/curriculum', updateCurriculum);
router.get('/:id/analytics', getSchoolAnalytics);
router.get('/:id/report', getSchoolAnalytics);

export default router;