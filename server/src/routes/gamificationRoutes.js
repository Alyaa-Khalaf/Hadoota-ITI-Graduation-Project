import express from "express";
import {
  getGamification,
  grantReward,
} from "../controllers/gamificationController.js";
import authMiddleware from '../middleware/auth.js';
import { verifyChildOwnership } from "../middleware/childOwnershipMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:childId", verifyChildOwnership, getGamification);
router.post("/reward", verifyChildOwnership, grantReward);

export default router;
