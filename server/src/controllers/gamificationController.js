import { getOrCreateGamification } from "../utils/gamificationHelper.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /api/gamification/:childId
export const getGamification = async (req, res) => {
  try {
    const gamification = await getOrCreateGamification(req.params.childId);

    return sendSuccess(res, 200, "Gamification data fetched successfully", {
      childId: gamification.childId,
      stars: gamification.stars,
      badges: gamification.badges,
      totalRewards: gamification.rewardHistory.length,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// POST /api/gamification/reward
export const grantReward = async (req, res) => {
  try {
    const { childId, type, amount, badgeName, reason } = req.body;

    if (!type || !["star", "badge"].includes(type)) {
      return sendError(res, 400, "Reward type must be 'star' or 'badge'");
    }

    if (type === "star" && (!amount || amount < 1)) {
      return sendError(res, 400, "Star amount must be at least 1");
    }

    if (type === "badge" && !badgeName) {
      return sendError(res, 400, "badgeName is required for badge rewards");
    }

    const gamification = await getOrCreateGamification(childId);

    if (type === "star") {
      gamification.stars += amount;
      gamification.rewardHistory.push({
        type: "star",
        amount,
        reason: reason || "Manual star reward",
      });
    }

    if (type === "badge") {
      const alreadyHasBadge = gamification.badges.some(
        (badge) => badge.name === badgeName
      );

      if (alreadyHasBadge) {
        return sendError(res, 400, "Child already has this badge");
      }

      gamification.badges.push({ name: badgeName });
      gamification.rewardHistory.push({
        type: "badge",
        badgeName,
        reason: reason || "Manual badge reward",
      });
    }

    await gamification.save();

    return sendSuccess(res, 200, "Reward granted successfully", {
      childId: gamification.childId,
      stars: gamification.stars,
      badges: gamification.badges,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};
