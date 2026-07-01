import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
import { resetPasswordTemplate } from "../services/notifications/templates/resetPassword.js";
import { welcomeTemplate } from "../services/notifications/templates/welcome.js";

// Generate Access Token (15 Minutes)
// Accepts either a user object or a user id string.
const generateAccessToken = (userOrId) => {
  const id = typeof userOrId === 'string' || typeof userOrId === 'number'
    ? userOrId
    : userOrId && userOrId._id ? userOrId._id : undefined;
  const role = userOrId && typeof userOrId === 'object' ? userOrId.role : undefined;
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Generate Refresh Token (30 Days)
// Accepts either a user object or a user id string.
const generateRefreshToken = (userOrId) => {
  const id = typeof userOrId === 'string' || typeof userOrId === 'number'
    ? userOrId
    : userOrId && userOrId._id ? userOrId._id : undefined;
  const role = userOrId && typeof userOrId === 'object' ? userOrId.role : undefined;
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "الإيميل ده موجود بالفعل",
        data: null,
        errors: [],
      });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Send welcome email
    await sendEmail(user.email, welcomeTemplate(user.name));

    res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscription: user.subscription,
        },
        accessToken,
        refreshToken,
      },
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists + get password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "الإيميل أو الباسورد غلط",
        data: null,
        errors: [],
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "الإيميل أو الباسورد غلط",
        data: null,
        errors: [],
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscription: user.subscription,
        },
        accessToken,
        refreshToken,
      },
      errors: [],
    });
  } catch (error) {
    // next(error)
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // Clear refresh token
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
      data: null,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken && req.cookies) {
      refreshToken = req.cookies.refreshToken;
    }

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "الـ Refresh Token مطلوب",
        data: null,
        errors: [],
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if user exists + token matches
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "الـ Refresh Token غير صالح",
        data: null,
        errors: [],
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: "تم تجديد الـ Token بنجاح",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "مفيش حساب بالإيميل ده",
        data: null,
        errors: [],
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // TODO: Send email with reset token (SendGrid)
    await sendEmail(user.email, resetPasswordTemplate(resetToken));

    res.status(200).json({
      success: true,
      message: "تم إرسال رابط إعادة تعيين الباسورد على إيميلك",
      data: null,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'البيانات غير مكتملة',
        data: null,
        errors: [],
      });
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (!user || user.resetPasswordToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: 'الـ Token غير صالح',
        data: null,
        errors: [],
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'الـ Token منتهي الصلاحية — اطلب رابط جديد',
        data: null,
        errors: [],
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تغيير الباسورد بنجاح',
      data: null,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, image, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "بيانات جوجل ناقصة",
        data: null,
        errors: [],
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // مستخدم جديد - اعمله حساب
      user = await User.create({
        name,
        email,
        avatar: image,
        googleId,
        password: null,
        role: "parent",
      });
      await sendEmail(user.email, welcomeTemplate(user.name));
    } else if (!user.googleId) {
      // مستخدم موجود بـ email عادي - اربط حسابه بجوجل
      user.googleId = googleId;
      if (!user.avatar || user.avatar === "default-avatar.png") {
        user.avatar = image;
      }
      await user.save({ validateBeforeSave: false });
    }
    // لو googleId موجود بالفعل - يدخل عادي

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بجوجل بنجاح',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscription: user.subscription,
        },
        accessToken,
        refreshToken,
      },
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};
