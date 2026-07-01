import Plan from '../models/Plan.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

// @desc    قائمة الخطط المتاحة للمستخدمين (النشطة فقط)
// @route   GET /api/plans
// @access  Public
export const listPublicPlans = async (req, res) => {
  try {
    const { audience } = req.query

    const filter = { isActive: true }
    // لو اتطلب جمهور معيّن، نرجّع خطط الجمهور ده + الخطط العامة (all)
    if (audience) {
      filter.audience = { $in: [audience, 'all'] }
    }

    const plans = await Plan.find(filter).sort({ sortOrder: 1, price: 1 }).lean()

    return sendSuccess(res, 200, 'تم جلب الخطط', plans)
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الخطط', [error.message])
  }
}
