import Child from "../models/Child.js";
import { sendError } from "../utils/apiResponse.js";

export const verifyChildOwnership = async (req, res, next) => {
  try {
    const childId = req.params.childId || req.body.childId || req.query.childId;

    if (!childId) {
      return sendError(res, 400, "childId is required");
    }

    const child = await Child.findById(childId);

    if (!child) {
      return sendError(res, 404, "Child not found");
    }

    if (child.parentId.toString() !== req.user._id.toString()) {
      return sendError(res, 403, "Not authorized to access this child");
    }

    req.child = child;
    next();
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
