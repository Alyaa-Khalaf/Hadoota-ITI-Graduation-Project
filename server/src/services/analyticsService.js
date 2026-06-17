import mongoose from "mongoose";
import Child from "../models/Child.js";
import StorySession from "../models/storySessionModel.js";
import QuizSubmission from "../models/quizSubmissionModel.js";
import Gamification from "../models/gamificationModel.js";
import {
  buildAnalyticsCacheKey,
  getCachedJson,
  setCachedJson,
} from "./cacheService.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const roundPercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

const getDateRange = (days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return { start, end };
};

export const getStoryAnalytics = async (childId, { period = "daily", days = 7 } = {}) => {
  const cacheKey = buildAnalyticsCacheKey(
    "stories",
    childId,
    period === "weekly" ? "weekly" : `daily:${days}`
  );
  const cached = await getCachedJson(cacheKey);
  if (cached) return cached;

  const matchStage = {
    childId: toObjectId(childId),
    completed: true,
  };

  let chart = [];
  let totalStories = 0;

  if (period === "weekly") {
    const weeklyData = await StorySession.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$readAt" },
            week: { $isoWeek: "$readAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      { $limit: 12 },
    ]);

    chart = weeklyData.map((item) => ({
      week: `${item._id.year}-W${String(item._id.week).padStart(2, "0")}`,
      count: item.count,
    }));
    totalStories = chart.reduce((sum, item) => sum + item.count, 0);
  } else {
    const { start } = getDateRange(Number(days) || 7);

    const dailyData = await StorySession.aggregate([
      {
        $match: {
          ...matchStage,
          readAt: { $gte: start },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$readAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    chart = dailyData.map((item) => ({
      date: item._id,
      count: item.count,
    }));
    totalStories = chart.reduce((sum, item) => sum + item.count, 0);
  }

  const result = {
    period,
    totalStories,
    chart,
  };

  await setCachedJson(cacheKey, result);
  return result;
};

export const getTopicAnalytics = async (childId) => {
  const cacheKey = buildAnalyticsCacheKey("topics", childId);
  const cached = await getCachedJson(cacheKey);
  if (cached) return cached;

  const topicData = await StorySession.aggregate([
    { $match: { childId: toObjectId(childId) } },
    {
      $group: {
        _id: "$topic",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const totalSessions = topicData.reduce((sum, item) => sum + item.count, 0);
  const topics = topicData.map((item) => ({
    topic: item._id || "general",
    count: item.count,
    percentage: roundPercentage(item.count, totalSessions),
  }));

  const result = { topics, totalSessions };
  await setCachedJson(cacheKey, result);
  return result;
};

export const getTimeAnalytics = async (childId, { days = 7 } = {}) => {
  const cacheKey = buildAnalyticsCacheKey("time", childId);
  const cached = await getCachedJson(cacheKey);
  if (cached) return cached;

  const { start } = getDateRange(Number(days) || 7);

  const dailyData = await StorySession.aggregate([
    {
      $match: {
        childId: toObjectId(childId),
        readAt: { $gte: start },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$readAt" },
        },
        totalSeconds: { $sum: "$durationSeconds" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const daily = dailyData.map((item) => ({
    date: item._id,
    minutes: Math.round(item.totalSeconds / 60),
  }));

  const totalMinutes = daily.reduce((sum, item) => sum + item.minutes, 0);
  const result = { totalMinutes, daily };

  await setCachedJson(cacheKey, result);
  return result;
};

export const getQuizAnalytics = async (childId) => {
  const cacheKey = buildAnalyticsCacheKey("quiz", childId);
  const cached = await getCachedJson(cacheKey);
  if (cached) return cached;

  const [summary] = await QuizSubmission.aggregate([
    { $match: { childId: toObjectId(childId) } },
    {
      $group: {
        _id: null,
        averageScore: { $avg: "$score" },
        totalQuizzes: { $sum: 1 },
        passedCount: {
          $sum: { $cond: ["$passed", 1, 0] },
        },
      },
    },
  ]);

  const recentSubmissions = await QuizSubmission.find({ childId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("storyId score passed totalQuestions correctCount createdAt");

  const totalQuizzes = summary?.totalQuizzes || 0;
  const passedCount = summary?.passedCount || 0;

  const result = {
    averageScore: totalQuizzes ? Math.round(summary.averageScore) : 0,
    totalQuizzes,
    passedCount,
    passRate: roundPercentage(passedCount, totalQuizzes),
    recentSubmissions,
  };

  await setCachedJson(cacheKey, result);
  return result;
};

export const getProgressAnalytics = async (childId) => {
  const cacheKey = buildAnalyticsCacheKey("progress", childId);
  const cached = await getCachedJson(cacheKey);
  if (cached) return cached;

  const [storyStats] = await StorySession.aggregate([
    { $match: { childId: toObjectId(childId) } },
    {
      $group: {
        _id: null,
        storiesRead: {
          $sum: { $cond: ["$completed", 1, 0] },
        },
        totalSeconds: { $sum: "$durationSeconds" },
        lastActivityAt: { $max: "$readAt" },
      },
    },
  ]);

  const quizStats = await getQuizAnalytics(childId);
  const gamification = await Gamification.findOne({ childId }).select(
    "stars badges"
  );

  const result = {
    childId,
    storiesRead: storyStats?.storiesRead || 0,
    totalMinutes: storyStats ? Math.round(storyStats.totalSeconds / 60) : 0,
    averageQuizScore: quizStats.averageScore,
    totalQuizzes: quizStats.totalQuizzes,
    stars: gamification?.stars || 0,
    badgesCount: gamification?.badges?.length || 0,
    lastActivityAt: storyStats?.lastActivityAt || null,
  };

  await setCachedJson(cacheKey, result);
  return result;
};

export const getDashboardAnalytics = async (parentId) => {
  const cacheKey = buildAnalyticsCacheKey("dashboard", parentId);
  const cached = await getCachedJson(cacheKey);
  if (cached) return cached;

  const children = await Child.find({ parentId }).select("name age avatar");

  const childrenSummaries = await Promise.all(
    children.map(async (child) => {
      const progress = await getProgressAnalytics(child._id.toString());
      return {
        childId: child._id,
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        storiesRead: progress.storiesRead,
        totalMinutes: progress.totalMinutes,
        averageQuizScore: progress.averageQuizScore,
        stars: progress.stars,
        badgesCount: progress.badgesCount,
      };
    })
  );

  const totals = childrenSummaries.reduce(
    (acc, child) => {
      acc.storiesRead += child.storiesRead;
      acc.totalMinutes += child.totalMinutes;
      return acc;
    },
    { storiesRead: 0, totalMinutes: 0 }
  );

  const result = {
    parentId,
    childrenCount: childrenSummaries.length,
    children: childrenSummaries,
    totals,
  };

  await setCachedJson(cacheKey, result);
  return result;
};
