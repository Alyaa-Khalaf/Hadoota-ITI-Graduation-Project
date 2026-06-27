import Child from '../models/Child.js';
import User from '../models/User.js';

// 1️⃣ جلب كل أطفال الأب المسجل حالياً فقط
export const getChildren = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const children = await Child.find({ parentId: userId });

    res.status(200).json({
      success: true,
      message: 'تم الحصول على أطفال المستخدم بنجاح',
      data: children,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

export const getAllChildren = getChildren;

// 2️⃣ إضافة طفل جديد وربطه بالأب تلقائياً
export const createChild = async (req, res, next) => {
  try {
    const { name, age, gender, interests, learningLevel, avatar } = req.body;
    const parentId = req.user?.id || req.user?._id;

    if (!parentId) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - لم يتم العثور على معرف المستخدم',
        data: null,
        errors: []
      });
    }

    // 🔍 نتحقق هل هذا أول طفل للأب قبل الإنشاء، عشان نعرف نحدده
    // كـ "نشط" تلقائيًا بعد كده لو كان الوحيد (يغطي حالة بعد التسجيل
    // مباشرة، حيث الأب عادة بيكون عنده طفل واحد بس ومفيش خطوة اختيار)
    const existingChildrenCount = await Child.countDocuments({ parentId });

    const child = await Child.create({
      parentId,
      name,
      age,
      gender,
      avatar: avatar || 'default-child.png',
      interests: interests || [],
      learningLevel: learningLevel || 'beginner',
      settings: {
        allowedTopics: [],
        screenTimeLimit: 30,
        difficultyLevel: 'easy'
      }
    });

    // 🆕 لو ده أول طفل للأب (مكانش عنده أي طفل قبل كده)، نحدده تلقائيًا
    // كـ "الطفل النشط" بدون ما الأب يحتاج يضغط أي اختيار
    if (existingChildrenCount === 0) {
      await User.findByIdAndUpdate(parentId, { activeChildId: child._id });
    }

    res.status(201).json({
      success: true,
      message: 'تم إنشاء ملف الطفل بنجاح',
      data: child,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// 3️⃣ جلب تفاصيل طفل محدد بواسطة الـ ID مع فحص الأمان
export const getChild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'الطفل غير موجود',
        data: null,
        errors: []
      });
    }

    if (child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح للوصول لبيانات هذا الطفل',
        data: null,
        errors: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم الحصول على بيانات الطفل',
      data: child,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// 4️⃣ تعديل بيانات الطفل
export const updateChild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const child = await Child.findById(id);
    if (!child || child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({ success: false, message: 'غير مصرح أو الطفل غير موجود' });
    }

    const updatedChild = await Child.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'تم تعديل بيانات الطفل بنجاح',
      data: updatedChild,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// 5️⃣ حذف طفل نهائياً
export const deleteChild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const child = await Child.findById(id);
    if (!child || child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({ success: false, message: 'غير مصرح أو الطفل غير موجود' });
    }

    await Child.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'تم حذف الطفل بنجاح',
      data: null,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// 6️⃣ تحديد "الطفل النشط" حالياً للأب (يُحفظ بشكل دائم في الداتابيز)
export const setActiveChild = async (req, res, next) => {
  try {
    const { childId } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!childId) {
      return res.status(400).json({
        success: false,
        message: 'childId is required',
        data: null,
        errors: []
      });
    }

    // 🔒 نتأكد إن الطفل ده فعلاً ابن هذا الأب قبل ما نحفظه كـ "نشط"،
    // عشان ما نسمحش لأب يحط طفل أب تاني كـ active child بتاعه
    const child = await Child.findById(childId);
    if (!child || child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح أو الطفل غير موجود',
        data: null,
        errors: []
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { activeChildId: childId },
      { new: true }
    ).select('activeChildId');

    res.status(200).json({
      success: true,
      message: 'تم تحديد الطفل النشط بنجاح',
      data: { activeChildId: updatedUser.activeChildId },
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// 7️⃣ جلب "الطفل النشط" حالياً للأب (بيانات الطفل كاملة، أو null لو مفيش)
export const getActiveChild = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const user = await User.findById(userId).select('activeChildId');

    if (!user?.activeChildId) {
      return res.status(200).json({
        success: true,
        message: 'لا يوجد طفل نشط محدد',
        data: null,
        errors: []
      });
    }

    const child = await Child.findById(user.activeChildId);

    // لو الطفل المحفوظ كـ "نشط" تم حذفه بعدين، نرجّع null بدل ما نرمي error
    if (!child) {
      return res.status(200).json({
        success: true,
        message: 'الطفل النشط المحفوظ غير موجود',
        data: null,
        errors: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم الحصول على الطفل النشط بنجاح',
      data: child,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};