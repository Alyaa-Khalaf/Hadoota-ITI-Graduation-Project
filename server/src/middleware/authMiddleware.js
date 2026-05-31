import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendError } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, 401, "Not authorized, no token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return sendError(res, 401, "Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, "Not authorized, invalid token", [
      error.message,
    ]);
  }
};
