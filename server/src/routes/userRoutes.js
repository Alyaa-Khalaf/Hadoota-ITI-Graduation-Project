import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  getSubscription,
} from "../controllers/userController.js";
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/change-password", changePassword);
router.delete("/account", deleteAccount);
router.get("/subscription", getSubscription);

export default router;
