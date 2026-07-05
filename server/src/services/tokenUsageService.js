import TokenUsage from '../models/TokenUsage.js';

/**
 * بيسجّل استهلاك توكنز/صور لعملية AI واحدة.
 * بيتصمم عشان يكون "safe" — لو فشل التسجيل، مبيوقفش توليد القصة نفسها.
 */
export const recordTokenUsage = async ({
  userId,
  childId,
  storyId,
  provider,
  operation,
  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,
  imageCount = 0,
}) => {
  if (!userId) {
    console.warn('recordTokenUsage called without userId — skipping');
    return null;
  }

  try {
    return await TokenUsage.create({
      userId,
      childId,
      storyId,
      provider,
      operation,
      promptTokens,
      completionTokens,
      totalTokens: totalTokens || promptTokens + completionTokens,
      imageCount,
    });
  } catch (error) {
    // فشل التسجيل مايوقفش توليد القصة — بس نطبع تحذير
    console.warn('Failed to record token usage:', error.message);
    return null;
  }
};

/**
 * إجمالي الاستهلاك لكل مستخدم — لعرضه في لوحة الأدمن
 */
export const getUsageSummaryByUser = async ({ from, to } = {}) => {
  const match = {};
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  return TokenUsage.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$userId',
        totalTokens: { $sum: '$totalTokens' },
        promptTokens: { $sum: '$promptTokens' },
        completionTokens: { $sum: '$completionTokens' },
        imageCount: { $sum: '$imageCount' },
        callsCount: { $sum: 1 },
        lastUsedAt: { $max: '$createdAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        userId: '$_id',
        _id: 0,
        userName: '$user.name',
        userEmail: '$user.email',
        totalTokens: 1,
        promptTokens: 1,
        completionTokens: 1,
        imageCount: 1,
        callsCount: 1,
        lastUsedAt: 1,
      },
    },
    { $sort: { totalTokens: -1 } },
  ]);
};

/**
 * تفاصيل استهلاك مستخدم واحد (كل الاستدعاءات)
 */
export const getUsageByUserId = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    TokenUsage.find({ userId })
      .populate('storyId', 'title')
      .populate('childId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TokenUsage.countDocuments({ userId }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
};