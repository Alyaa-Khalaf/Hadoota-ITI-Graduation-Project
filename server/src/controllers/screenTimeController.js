import Child from '../models/Child.js'
import User from '../models/User.js'
import { startSession, endSession, getTodayStatus, getWeeklyStatus } from '../services/screenTimeService.js'

const verifyParentOwnsChild = async (childId, userId) => {
  const child = await Child.findById(childId)
  if (!child) return { error: 'الطفل غير موجود', status: 404 }
  if (child.parentId.toString() !== userId.toString()) return { error: 'غير مصرح للوصول لبيانات هذا الطفل', status: 401 }
  return { child }
}

// POST /api/screentime/:childId/start
export const startScreenTime = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    const result = await startSession(childId)

    res.status(200).json({
      success: true,
      message: result.started ? 'تم بدء الجلسة' : 'خلص وقت الشاشة النهارده — مش مسموح بجلسة جديدة',
      data: result,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/screentime/:childId/end
export const endScreenTime = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { child, error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    // Fetch parent to pass to notification logic
    const parent = await User.findById(child.parentId).select('name email')

    const result = await endSession(childId, parent)

    res.status(200).json({
      success: true,
      message: 'تم إنهاء الجلسة',
      data: result,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/screentime/:childId/today
export const getTodayScreenTime = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    const result = await getTodayStatus(childId)

    res.status(200).json({
      success: true,
      message: 'تم جلب بيانات وقت الشاشة',
      data: result,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/screentime/:childId/week
export const getWeekScreenTime = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    const result = await getWeeklyStatus(childId)

    res.status(200).json({
      success: true,
      message: 'تم جلب تقرير الأسبوع',
      data: result,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}