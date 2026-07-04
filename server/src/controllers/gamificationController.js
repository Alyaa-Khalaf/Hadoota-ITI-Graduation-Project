import { getOrCreateGamification } from "../utils/gamificationHelper.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { notifyBadgeEarned } from "../services/notifications/notificationService.js";

// معامل حساب المستوى (كل 100 نجمة تعطي ليفل جديد)
const STARS_PER_LEVEL = 100;

// ==========================================
// 1️⃣ GET /api/gamification/:childId
// ==========================================
export const getGamification = async (req, res) => {
  try {
    const gamification = await getOrCreateGamification(req.params.childId);

    // حساب المستوى الحالي تلقائياً بناءً على النجوم المتراكمة
    const currentLevel = Math.floor(gamification.stars / STARS_PER_LEVEL) + 1;

    return sendSuccess(res, 200, "Gamification data fetched successfully", {
      childId: gamification.childId,
      stars: gamification.stars,
      level: currentLevel, // مضافة ومحسوبة ديناميكياً للـ UI
      badges: gamification.badges,
      rewardHistory: gamification.rewardHistory, // إرجاع المصفوفة كاملة لشيماء لتعرض الـ Logs
      totalRewards: gamification.rewardHistory.length,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};

// ==========================================
// 2️⃣ POST /api/gamification/reward
// ==========================================
export const grantReward = async (req, res) => {
  try {
       console.log("Reward Request:", req.body);
    const { childId, type, amount, badgeName, reason } = req.body;

    // التحقق الصارم المتوافق مع الـ Enum الخاص بكِ ["star", "badge"]
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

    // حساب المستوى الحالي قبل إضافة النجوم الجديدة لمعرفة هل حدث Level Up أم لا
    const previousLevel = Math.floor(gamification.stars / STARS_PER_LEVEL) + 1;
    let leveledUp = false;

    if (type === "star") {
      gamification.stars += Number(amount);
      gamification.rewardHistory.push({
        type: "star",
        amount: Number(amount),
        badgeName: "",
        reason: reason || "Manual star reward",
      });
    }

    if (type === "badge") {
      // التحقق بناءً على حقل name تماشياً مع الـ Schema المعتمدة عندكِ
      const alreadyHasBadge = gamification.badges.some(
        (badge) => badge.name === badgeName
      );

      if (alreadyHasBadge) {
        return sendError(res, 400, "Child already has this badge");
      }

      gamification.badges.push({ name: badgeName, earnedAt: new Date() });
      gamification.rewardHistory.push({
        type: "badge",
        amount: 1,
        badgeName: badgeName,
        reason: reason || "Manual badge reward",
      });
    }

    // حساب المستوى الجديد بعد التعديل لمعرفة الـ Level Up
    const currentLevel = Math.floor(gamification.stars / STARS_PER_LEVEL) + 1;
    if (currentLevel > previousLevel) {
      leveledUp = true;
      // 🌟 ملحوظة: لم نعد نعمل push لـ "level_up" منعاً لـ ValidationError بالـ Schema
      // وسيتم إرسال العلم لشيماء في الـ Response مباشرة لإطلاق الـ Confetti
    }

    await gamification.save();

    if (type === "badge") {
      notifyBadgeEarned(childId, badgeName).catch((err) =>
        console.error("Badge notification failed:", err.message)
      );
    }

    return sendSuccess(res, 200, "Reward granted successfully", {
      childId: gamification.childId,
      stars: gamification.stars,
      level: currentLevel, 
      leveledUp,          // مضافة ومحسوبة فوريًا للـ UI لتشغيل الـ الاحتفالات
      badges: gamification.badges,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", [error.message]);
  }
};