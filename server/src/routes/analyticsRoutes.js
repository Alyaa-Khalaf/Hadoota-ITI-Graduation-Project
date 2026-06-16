import express from "express";
import {
  trackStorySession,
  getStoriesAnalytics,
  getTopicsAnalytics,
  getTimeAnalyticsHandler,
  getQuizAnalyticsHandler,
  getProgressAnalyticsHandler,
  getDashboardAnalyticsHandler,
} from "../controllers/analyticsController.js";
import authMiddleware from '../middleware/auth.js';
import { verifyChildOwnership } from "../middleware/childOwnershipMiddleware.js";
import { verifyParentOwnership } from "../middleware/parentOwnershipMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/session", verifyChildOwnership, trackStorySession);

router.get(
  "/dashboard/:parentId",
  verifyParentOwnership,
  getDashboardAnalyticsHandler
);

router.get("/:childId/stories", verifyChildOwnership, getStoriesAnalytics);
router.get("/:childId/topics", verifyChildOwnership, getTopicsAnalytics);
router.get("/:childId/time", verifyChildOwnership, getTimeAnalyticsHandler);
router.get("/:childId/quiz", verifyChildOwnership, getQuizAnalyticsHandler);
router.get("/:childId/progress", verifyChildOwnership, getProgressAnalyticsHandler);

export default router;
