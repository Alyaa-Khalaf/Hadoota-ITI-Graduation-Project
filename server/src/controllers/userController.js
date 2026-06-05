import User from "../models/User.js";

// POST /api/users/test-user
export const createTestUser = async (req, res) => {
  try {
    const user = await User.create({
      name: "Norhan",
      email: "norhan@test.com",
      password: "123456789",
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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errors: [],
      });
    }

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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errors: [],
      });
    }

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

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errors: [],
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
        data: null,
        errors: [],
      });
    }

    user.password = newPassword;
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
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errors: [],
      });
    }

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
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errors: [],
      });
    }

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
