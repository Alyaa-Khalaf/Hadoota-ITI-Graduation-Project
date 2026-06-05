import Redis from "ioredis";

let redisClient = null;

export const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    redisClient.on("error", (error) => {
      console.warn("Redis connection error:", error.message);
    });
  }

  return redisClient;
};

export const isRedisEnabled = () => Boolean(process.env.REDIS_URL);
