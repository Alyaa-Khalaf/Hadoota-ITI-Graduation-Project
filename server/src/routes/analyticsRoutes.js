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
import { checkPlanLimit } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/session", verifyChildOwnership, trackStorySession);

// Dashboard — متاح للكل (نظرة عامة بسيطة)
router.get(
  "/dashboard/:parentId",
  verifyParentOwnership,
  getDashboardAnalyticsHandler
);

// التقارير التفصيلية — محمية بـ hasDetailedReports
router.get("/:childId/stories",  verifyChildOwnership, checkPlanLimit("hasDetailedReports"), getStoriesAnalytics);
router.get("/:childId/topics",   verifyChildOwnership, checkPlanLimit("hasDetailedReports"), getTopicsAnalytics);
router.get("/:childId/time",     verifyChildOwnership, checkPlanLimit("hasDetailedReports"), getTimeAnalyticsHandler);
router.get("/:childId/quiz",     verifyChildOwnership, checkPlanLimit("hasDetailedReports"), getQuizAnalyticsHandler);
router.get("/:childId/progress", verifyChildOwnership, checkPlanLimit("hasDetailedReports"), getProgressAnalyticsHandler);

export default router;