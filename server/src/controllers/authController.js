import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Name, email, and password are required");
    }

    if (password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return sendError(res, 400, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, "User registered successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        subscription: user.subscription,
      },
      token,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, "Login successful", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        subscription: user.subscription,
      },
      token,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
