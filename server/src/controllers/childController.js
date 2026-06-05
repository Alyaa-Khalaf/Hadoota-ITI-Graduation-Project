import Child from "../models/childModel.js";
import Gamification from "../models/gamificationModel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// POST /api/children — helper for testing (parent creates a child profile)
export const createChild = async (req, res) => {
  try {
    const { name, age, avatar } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, "Child name is required");
    }

    const child = await Child.create({
      parentId: req.user._id,
      name: name.trim(),
      age,
      avatar: avatar || "",
    });

    await Gamification.create({ childId: child._id });

    return sendSuccess(res, 201, "Child created successfully", child);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/children — list parent's children
export const getChildren = async (req, res) => {
  try {
    const children = await Child.find({ parentId: req.user._id });

    return sendSuccess(res, 200, "Children fetched successfully", children);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
