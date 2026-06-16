import User from "../models/User.js";

/**
 * Middleware للتحقق من أن المستخدم الحالي هو ADMIN فقط
 * (يُستدعى دائماً بعد middleware الحماية الأساسي لضمان وجود req.user)
 */
export const isAdmin = async (req, res, next) => {
  try {
    // 1. لو الـ role جاي جاهز ومكتوب admin (من الـ Token أو الـ DB)
    if (req.user && req.user.role === 'admin') {
      return next();
    }

    // 2. خطوة أمان إضافية: لو الـ role مش مبعوت، بنشك في الداتابيز بـ الـ ID
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح — مستخدم غير معروف',
        data: null,
        errors: []
      });
    }

    const user = await User.findById(userId);
    
    if (user && user.role === 'admin') {
      return next(); // الأدمن تمام، عدي للـ Controller
    }

    // 3. لو مش أدمن، ارفع في وشه حظر فوراً
    return res.status(403).json({
      success: false,
      message: 'غير مسموح بالدخول — هذه الصلاحية خاصة بالأدمن فقط',
      data: null,
      errors: []
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من صلاحيات الأدمن',
      data: null,
      errors: [error.message]
    });
  }
};