import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  getSubscription,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/change-password", changePassword);
router.delete("/account", deleteAccount);
router.get("/subscription", getSubscription);

export default router;
