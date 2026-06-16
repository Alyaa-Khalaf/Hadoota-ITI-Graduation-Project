import Child from '../models/Child.js';

// 1️⃣ (إضافة طفل جديد وربطه بالأب تلقائياً)
export const createChild = async (req, res, next) => {
  try {
    // 🌟 تم إضافة gender هنا لاستقباله من الـ Body
    const { name, age, gender, interests, learningLevel } = req.body;
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
      gender, // 🌟 تم تمريره لقاعدة البيانات بنجاح
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

// 2️⃣ جلب تفاصيل طفل محدد بواسطة الـ ID مع فحص الأمان (كود هند الآمن)
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

    // شرط الأمان لمنع اختراق بيانات الأطفال
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

// 3️⃣ جلب كل أطفال الأب المسجل حالياً فقط
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

// 4️⃣ تعديل بيانات الطفل (تمت تهيئته ليتماشى مع الـ Structure بتاعكِ)
export const updateChild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    // تأمين الحماية: التأكد أن الأب هو من يملك الطفل قبل التعديل
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

// 5️⃣ حذف طفل نهائياً (تمت تهيئته ليتماشى مع الـ Structure بتاعكِ)
export const deleteChild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    // تأمين الحماية: التأكد أن الأب هو من يملك الطفل قبل الحذف
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