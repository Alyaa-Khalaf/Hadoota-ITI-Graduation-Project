import Child from "../models/childModel.js";
import Gamification from "../models/gamificationModel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Helper: get parent id safely
 */
const getParentId = (req) => req.user?._id;

/**
 * POST /api/children
 * Create child + init gamification
 */
export const createChild = async (req, res) => {
  try {
    const parentId = getParentId(req);

    if (!parentId) {
      return sendError(res, 401, "Unauthorized user");
    }

    const { name, age, avatar, interests, learningLevel } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, "Child name is required");
    }

    const child = await Child.create({
      parentId,
      name: name.trim(),
      age,
      avatar: avatar || "default-child.png",
      interests: interests || [],
      learningLevel: learningLevel || "beginner",
      settings: {
        allowedTopics: [],
        screenTimeLimit: 30,
        difficultyLevel: "easy",
      },
    });

    await Gamification.create({ childId: child._id });

    return sendSuccess(res, 201, "Child created successfully", child);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

/**
 * GET /api/children
 * List all children for parent
 */
export const getChildren = async (req, res) => {
  try {
    const parentId = getParentId(req);

    const children = await Child.find({ parentId });

    return sendSuccess(res, 200, "Children fetched successfully", children);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

/**
 * GET /api/children/:id
 * Get single child (secured)
 */
export const getChild = async (req, res) => {
  try {
    const parentId = getParentId(req);
    const { id } = req.params;

    const child = await Child.findById(id);

    if (!child) {
      return sendError(res, 404, "Child not found");
    }

    if (child.parentId.toString() !== parentId.toString()) {
      return sendError(res, 403, "Not authorized to access this child");
    }

    return sendSuccess(res, 200, "Child fetched successfully", child);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

/**
 * PUT /api/children/:id
 * Update child (secured)
 */
export const updateChild = async (req, res) => {
  try {
    const parentId = getParentId(req);
    const { id } = req.params;

    const child = await Child.findById(id);

    if (!child) {
      return sendError(res, 404, "Child not found");
    }

    if (child.parentId.toString() !== parentId.toString()) {
      return sendError(res, 403, "Not authorized to update this child");
    }

    const updatedChild = await Child.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, 200, "Child updated successfully", updatedChild);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

/**
 * DELETE /api/children/:id
 * Delete child (secured)
 */
export const deleteChild = async (req, res) => {
  try {
    const parentId = getParentId(req);
    const { id } = req.params;

    const child = await Child.findById(id);

    if (!child) {
      return sendError(res, 404, "Child not found");
    }

    if (child.parentId.toString() !== parentId.toString()) {
      return sendError(res, 403, "Not authorized to delete this child");
    }

    await Child.findByIdAndDelete(id);

    return sendSuccess(res, 200, "Child deleted successfully", null);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};