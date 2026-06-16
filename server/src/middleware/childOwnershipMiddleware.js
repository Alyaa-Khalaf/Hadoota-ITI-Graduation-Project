import Child from "../models/Child.js"; // 🌟 تم التعديل ليقرأ من الملف الموجود عندكِ حالياً
import { sendError } from "../utils/apiResponse.js";

export const verifyChildOwnership = async (req, res, next) => {
  try {
    const childId = req.params.childId || req.body.childId;

    if (!childId) {
      return sendError(res, 400, "childId is required");
    }

    // جلب الطفل من الموديل الصحيح المتاح
    const child = await Child.findById(childId);

    if (!child) {
      return sendError(res, 404, "Child not found in database. Please create a child first.");
    }

    const parentId = req.user?._id || req.user?.id;
    if (!parentId) {
      return sendError(res, 401, "Parent authentication missing.");
    }

    // 🌟 حماية مطلقة: تحويل آمن جداً لمنع كراش الـ toString() نهائياً
    const childParentStr = child.parentId ? String(child.parentId) : null;
    const currentParentStr = String(parentId);

    if (!childParentStr || childParentStr !== currentParentStr) {
      return sendError(res, 403, "Not authorized to access this child");
    }

    req.child = child;
    next();
  } catch (error) {
    return sendError(res, 500, "Error in ownership verification", [error.message]);
  }
};