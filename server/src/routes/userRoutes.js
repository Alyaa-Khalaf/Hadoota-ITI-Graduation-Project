import express from "express";
import {
  createTestUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  getSubscription,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/test-user", createTestUser);

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/change-password", authMiddleware, changePassword);
router.delete("/account", authMiddleware, deleteAccount);
router.get("/subscription", authMiddleware, getSubscription);

export default router;
