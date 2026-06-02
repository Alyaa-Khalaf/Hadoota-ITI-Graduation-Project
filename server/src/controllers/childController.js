import Child from '../models/Child.js'; // 1. تأكدي من مسار الموديل الصحيح

// 1️⃣ جلب كل أطفال الأب المسجل حالياً فقط
export const getAllChildren = async (req, res, next) => {
  try {
    const parentId = req.user.id; // التوكن فك التشفير وعرّفنا بالأب
    
    // البحث في الـ DB عن الأطفال الذين يملكون نفس الـ parent ID
    const children = await Child.find({ parent: parentId }); 
    
    res.status(200).json({
      success: true,
      message: "تم جلب الأطفال بنجاح",
      data: children
    });
  } catch (error) { next(error); }
};

// 2️⃣ إضافة طفل جديد وربطه بالأب تلقائياً
export const createChild = async (req, res, next) => {
  try {
    const parentId = req.user.id;
    
    // إنشاء نسخة جديدة من الطفل مع دمج الـ parentId القادم من التوكن
    const newChild = new Child({
      ...req.body,       // البيانات القادمة من الـ Frontend (الاسم، العمر، إلخ)
      parent: parentId   // ربطه بالأب الحالي لأمان البيانات
    });

    // حفظ في قاعدة البيانات أونلاين
    const savedChild = await newChild.save();

    res.status(201).json({
      success: true,
      message: "تم إضافة الطفل بنجاح",
      data: savedChild
    });
  } catch (error) { next(error); }
};

// 3️⃣ جلب تفاصيل طفل محدد بواسطة الـ ID الخاص به
export const getChildById = async (req, res, next) => {
  try {
    const childId = req.params.id;
    
    const child = await Child.findById(childId);
    
    if (!child) {
      return res.status(404).json({ success: false, message: "الطفل غير موجود" });
    }

    res.status(200).json({
      success: true,
      message: "تم جلب تفاصيل الطفل بنجاح",
      data: child
    });
  } catch (error) { next(error); }
};

// 4️⃣ تعديل بيانات الطفل
export const updateChild = async (req, res, next) => {
  try {
    const childId = req.params.id;

    // تحديث البيانات بالـ Body الجديد وإرجاع المستند بعد التعديل { new: true }
    const updatedChild = await Child.findByIdAndUpdate(childId, req.body, { new: true, runValidators: true });

    if (!updatedChild) {
      return res.status(404).json({ success: false, message: "الطفل غير موجود" });
    }

    res.status(200).json({
      success: true,
      message: "تم تعديل بيانات الطفل بنجاح",
      data: updatedChild
    });
  } catch (error) { next(error); }
};

// 5️⃣ حذف طفل نهائياً من قاعدة البيانات
export const deleteChild = async (req, res, next) => {
  try {
    const childId = req.params.id;

    const deletedChild = await Child.findByIdAndDelete(childId);

    if (!deletedChild) {
      return res.status(404).json({ success: false, message: "الطفل غير موجود" });
    }

    res.status(200).json({
      success: true,
      message: "تم حذف الطفل بنجاح",
      data: null
    });
  } catch (error) { next(error); }
};