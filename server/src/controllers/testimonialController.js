import Testimonial from '../models/Testimonial.js';
import User from '../models/User.js'; // تأكدي إن اسم الموديل User أو Parent حسب مشروعكم

// @desc    Get all featured testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في جلب الآراء',
      error: error.message
    });
  }
};

// @desc    Create a new testimonial
export const createTestimonial = async (req, res) => {
  try {
    // 1. التأكد من وجود بيانات المستخدم في التوكن
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'لم يتم التعرف على حساب المستخدم، تأكد من التوكن'
      });
    }

    const userId = req.user.id;

    // 2. جلب بيانات ولي الأمر من الداتابيز
    const databaseUser = await User.findById(userId);
    
    if (!databaseUser) {
      return res.status(404).json({
        success: false,
        message: 'حساب المستخدم غير موجود في قاعدة البيانات'
      });
    }

    // 3. ربط البيانات تلقائياً
    req.body.user = userId; 
    req.body.parentName = databaseUser.name; // لقط الاسم الحقيقي تلقائياً (youssef)

    // 4. حفظ التقييم
    const newTestimonial = await Testimonial.create(req.body);
    
    res.status(201).json({
      success: true,
      data: newTestimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'فشل في إضافة الرأي، تأكد من البيانات المدخلة',
      error: error.message
    });
  }
};