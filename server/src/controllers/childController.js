import Child from '../models/Child.js'

export const createChild = async (req, res, next) => {
  try {
    const { name, age, interests, learningLevel } = req.body
    const parentId = req.user?.id || req.user?._id

    if (!parentId) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - لم يتم العثور على معرف المستخدم',
        data: null,
        errors: []
      })
    }

    const child = await Child.create({
      parentId,
      name,
      age,
      interests: interests || [],
      learningLevel: learningLevel || 'beginner',
      settings: {
        allowedTopics: [],
        screenTimeLimit: 30,
        difficultyLevel: 'easy'
      }
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء ملف الطفل بنجاح',
      data: child,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

export const getChild = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || req.user?._id

    const child = await Child.findById(id)
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'الطفل غير موجود',
        data: null,
        errors: []
      })
    }

    if (child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح للوصول لبيانات هذا الطفل',
        data: null,
        errors: []
      })
    }

    res.status(200).json({
      success: true,
      message: 'تم الحصول على بيانات الطفل',
      data: child,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

export const getChildren = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id

    const children = await Child.find({ parentId: userId })

    res.status(200).json({
      success: true,
      message: 'تم الحصول على أطفال المستخدم',
      data: children,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}
