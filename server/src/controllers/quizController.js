import QuizSubmission from "../models/quizSubmissionModel.js";
import Child from "../models/childModel.js";
import { getOrCreateGamification } from "../utils/gamificationHelper.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { invalidateAnalyticsCache } from "../services/cacheService.js";
import { notifyBadgeEarned } from "../services/notifications/notificationService.js";

const PASS_THRESHOLD = 60;

const calculateScore = (answers) => {
  const correctCount = answers.filter(
    (item) => item.answer === item.correctAnswer
  ).length;
  const totalQuestions = answers.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return { correctCount, totalQuestions, score };
};

const awardQuizStars = async (childId, score) => {
  const starsEarned = Math.max(1, Math.floor(score / 20));
  const gamification = await getOrCreateGamification(childId);
  let newBadge = null;

  gamification.stars += starsEarned;
  gamification.rewardHistory.push({
    type: "star",
    amount: starsEarned,
    reason: `Quiz completed with score ${score}%`,
  });

  if (score >= PASS_THRESHOLD && !gamification.badges.some((b) => b.name === "quiz_passed")) {
    gamification.badges.push({ name: "quiz_passed" });
    gamification.rewardHistory.push({
      type: "badge",
      badgeName: "quiz_passed",
      reason: "Passed a quiz",
    });
    newBadge = "quiz_passed";
  }

  await gamification.save();

  if (newBadge) {
    notifyBadgeEarned(childId, newBadge).catch((err) =>
      console.error("Badge notification failed:", err.message)
    );
  }

  return { starsEarned, gamification };
};

// POST /api/quiz/submit
export const submitQuiz = async (req, res) => {
  try {
    const { childId, storyId, answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return sendError(res, 400, "At least one answer is required");
    }

    for (const item of answers) {
      if (!item.questionId || !item.answer || !item.correctAnswer) {
        return sendError(
          res,
          400,
          "Each answer must include questionId, answer, and correctAnswer"
        );
      }
    }

    const { correctCount, totalQuestions, score } = calculateScore(answers);
    const passed = score >= PASS_THRESHOLD;

    const submission = await QuizSubmission.create({
      childId,
      storyId: storyId || "",
      answers,
      score,
      totalQuestions,
      correctCount,
      passed,
    });

    const { starsEarned } = await awardQuizStars(childId, score);

    const child = await Child.findById(childId).select("parentId");
    if (child) {
      await invalidateAnalyticsCache(childId, child.parentId.toString());
    }

    return sendSuccess(res, 201, "Quiz submitted successfully", {
      submissionId: submission._id,
      score,
      totalQuestions,
      correctCount,
      passed,
      starsEarned,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
