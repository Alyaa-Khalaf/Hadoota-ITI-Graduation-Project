import User from "../models/User.js";
import Child from "../models/childModel.js";
import QuizSubmission from "../models/quizSubmissionModel.js";
import Gamification from "../models/gamificationModel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    return sendSuccess(res, 200, "Profile fetched successfully", req.user);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, "Name is required");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), ...(avatar !== undefined && { avatar }) },
      { new: true, runValidators: true }
    ).select("-password");

    return sendSuccess(res, 200, "Profile updated successfully", user);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return sendError(res, 400, "Old password and new password are required");
    }

    if (newPassword.length < 8) {
      return sendError(res, 400, "New password must be at least 8 characters");
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return sendError(res, 400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, "Password changed successfully");
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// DELETE /api/users/account
export const deleteAccount = async (req, res) => {
  try {
    const children = await Child.find({ parentId: req.user._id }).select("_id");
    const childIds = children.map((child) => child._id);

    await Promise.all([
      QuizSubmission.deleteMany({ childId: { $in: childIds } }),
      Gamification.deleteMany({ childId: { $in: childIds } }),
      Child.deleteMany({ parentId: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ]);

    return sendSuccess(res, 200, "Account deleted successfully");
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/users/subscription
export const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("subscription");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "Subscription fetched successfully", user.subscription);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
