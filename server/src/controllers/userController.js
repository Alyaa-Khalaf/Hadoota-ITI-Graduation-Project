import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
// POST /api/users/test-user
export const createTestUser = async (req, res) => {
  try {
    const user = await User.create({
      name: "Norhan",
      email: "norhan@test.com",
      password: "123456",
    });

    res.status(201).json({
      success: true,
      message: "Test user created",
      data: user,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      errors: [error.message],
    });
  }
};

// GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: "norhan@test.com" }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      errors: [error.message],
    });
  }
};

// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findOneAndUpdate(
      { email: "norhan@test.com" },
      { name, avatar },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      errors: [error.message],
    });
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ email: "norhan@test.com" });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errors: [],
      });
    }

    // temporary compare لأن test user اتخزن plain text
    if (user.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
        data: null,
        errors: [],
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: null,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      errors: [error.message],
    });
  }
};

// DELETE /api/users/account
export const deleteAccount = async (req, res) => {
  try {
    await User.findOneAndDelete({ email: "norhan@test.com" });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: null,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      errors: [error.message],
    });
  }
};

// GET /api/users/subscription
export const getSubscription = async (req, res) => {
  try {
    const user = await User.findOne({ email: "norhan@test.com" });

    res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data: user.subscription,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      errors: [error.message],
    });
  }
};