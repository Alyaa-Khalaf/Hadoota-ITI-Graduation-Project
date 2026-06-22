import Testimonial from '../models/Testimonial.js';

// @desc    Get all featured testimonials
// @route   GET /api/testimonials
// @access  Public
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
// @route   POST /api/testimonials
// @access  Private (يطلب تسجيل دخول)
export const createTestimonial = async (req, res) => {
  try {
    // التأكد من وجود بيانات المستخدم القادمة من التوكن
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'لم يتم التعرف على حساب المستخدم، تأكد من التوكن'
      });
    }

    // ربط الحساب بالـ id المظبوط اللي قفشناه من الـ Token
    req.body.user = req.user.id; 

    // تأكيد اسم الوالد من الـ body أو وضع اسم افتراضي
    if (!req.body.parentName) {
      req.body.parentName = "ولي أمر بطل حدوتة";
    }

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