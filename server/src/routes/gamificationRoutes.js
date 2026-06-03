import express from "express";
import {
  getGamification,
  grantReward,
} from "../controllers/gamificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { verifyChildOwnership } from "../middleware/childOwnershipMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/:childId", verifyChildOwnership, getGamification);
router.post("/reward", verifyChildOwnership, grantReward);

export default router;
