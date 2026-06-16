import { sendError } from "../utils/apiResponse.js";

export const verifyParentOwnership = async (req, res, next) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return sendError(res, 400, "parentId is required");
    }

    if (parentId !== req.user._id.toString()) {
      return sendError(res, 403, "Not authorized to access this dashboard");
    }

    next();
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
