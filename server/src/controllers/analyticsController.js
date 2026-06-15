import StorySession from "../models/storySessionModel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { invalidateAnalyticsCache } from "../services/cacheService.js";
import { checkAndNotifyScreenTime } from "../services/notifications/notificationService.js";
import {
  getStoryAnalytics,
  getTopicAnalytics,
  getTimeAnalytics,
  getQuizAnalytics,
  getProgressAnalytics,
  getDashboardAnalytics,
} from "../services/analyticsService.js";

// POST /api/analytics/session — track story reading activity
export const trackStorySession = async (req, res) => {
  try {
    const { childId, storyId, title, topic, durationSeconds, completed } =
      req.body;

    if (!storyId || !storyId.trim()) {
      return sendError(res, 400, "storyId is required");
    }

    if (durationSeconds === undefined || durationSeconds < 0) {
      return sendError(res, 400, "durationSeconds must be a non-negative number");
    }

    const session = await StorySession.create({
      childId,
      storyId: storyId.trim(),
      title: title?.trim() || "",
      topic: topic?.trim() || "general",
      durationSeconds,
      completed: completed !== false,
      readAt: new Date(),
    });

    await invalidateAnalyticsCache(childId, req.user._id.toString());

    checkAndNotifyScreenTime(childId, req.user._id.toString()).catch((err) =>
      console.error("Screen time notification failed:", err.message)
    );

    return sendSuccess(res, 201, "Story session tracked successfully", session);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/analytics/:childId/stories
export const getStoriesAnalytics = async (req, res) => {
  try {
    const { period = "daily", days = 7 } = req.query;
    const data = await getStoryAnalytics(req.params.childId, {
      period,
      days: Number(days) || 7,
    });

    return sendSuccess(res, 200, "Stories analytics fetched successfully", data);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/analytics/:childId/topics
export const getTopicsAnalytics = async (req, res) => {
  try {
    const data = await getTopicAnalytics(req.params.childId);
    return sendSuccess(res, 200, "Topics analytics fetched successfully", data);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/analytics/:childId/time
export const getTimeAnalyticsHandler = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await getTimeAnalytics(req.params.childId, {
      days: Number(days) || 7,
    });

    return sendSuccess(res, 200, "Time analytics fetched successfully", data);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/analytics/:childId/quiz
export const getQuizAnalyticsHandler = async (req, res) => {
  try {
    const data = await getQuizAnalytics(req.params.childId);
    return sendSuccess(res, 200, "Quiz analytics fetched successfully", data);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/analytics/:childId/progress
export const getProgressAnalyticsHandler = async (req, res) => {
  try {
    const data = await getProgressAnalytics(req.params.childId);
    return sendSuccess(res, 200, "Progress analytics fetched successfully", data);
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// GET /api/analytics/dashboard/:parentId
export const getDashboardAnalyticsHandler = async (req, res) => {
  try {
    const data = await getDashboardAnalytics(req.params.parentId);
    return sendSuccess(
      res,
      200,
      "Dashboard analytics fetched successfully",
      data
    );
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
