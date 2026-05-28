import express from "express";
import {
  createTestUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  getSubscription,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/test-user", createTestUser);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

router.put("/change-password", changePassword);

router.delete("/account", deleteAccount);

router.get("/subscription", getSubscription);

export default router;