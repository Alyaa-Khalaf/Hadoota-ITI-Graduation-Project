import { getRedisClient } from "../config/redis.js";

const DEFAULT_TTL_SECONDS = 3600;

export const buildAnalyticsCacheKey = (scope, id, suffix = "") => {
  const normalizedSuffix = suffix ? `:${suffix}` : "";
  return `analytics:${scope}:${id}${normalizedSuffix}`;
};

export const getCachedJson = async (key) => {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export const setCachedJson = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Cache failures should not break API responses.
  }
};

export const invalidateAnalyticsCache = async (childId, parentId = null) => {
  const redis = getRedisClient();
  if (!redis) return;

  const keys = [
    buildAnalyticsCacheKey("stories", childId, "daily"),
    buildAnalyticsCacheKey("stories", childId, "weekly"),
    buildAnalyticsCacheKey("topics", childId),
    buildAnalyticsCacheKey("time", childId),
    buildAnalyticsCacheKey("quiz", childId),
    buildAnalyticsCacheKey("progress", childId),
  ];

  if (parentId) {
    keys.push(buildAnalyticsCacheKey("dashboard", parentId));
  }

  try {
    await redis.del(...keys);
  } catch {
    // Ignore cache invalidation errors.
  }
};
