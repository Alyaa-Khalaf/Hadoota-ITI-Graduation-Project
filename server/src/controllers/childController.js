import Child from '../models/Child.js';

// 1️⃣ جلب كل أطفال الأب المسجل حالياً فقط
export const getAllChildren = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    // البحث باستخدام parentId المتوافق مع الموديل
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

// 2️⃣ إضافة طفل جديد وربطه بالأب تلقائياً مع الإعدادات الافتراضية
export const createChild = async (req, res, next) => {
  try {
    const { name, age, interests, learningLevel, avatar } = req.body;
    const parentId = req.user?.id || req.user?._id;

    if (!parentId) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - لم يتم العثور على معرف المستخدم',
        data: null,
        errors: []
      });
    }

    const child = await Child.create({
      parentId,
      name,
      age,
      avatar: avatar || 'default-child.png',
      interests: interests || [],
      learningLevel: learningLevel || 'beginner',
      settings: {
        allowedTopics: [],
        screenTimeLimit: 30,
        difficultyLevel: 'easy'
      }
    });

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

// 3️⃣ جلب تفاصيل طفل محدد بواسطة الـ ID
export const getChildById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ success: false, message: 'الطفل غير موجود' });
    }

    if (child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({ success: false, message: 'غير مصرح للوصول لبيانات هذا الطفل' });
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
      message: "تم تعديل بيانات الطفل بنجاح",
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
      message: "تم حذف الطفل بنجاح",
      data: null,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};