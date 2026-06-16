import Redis from 'ioredis'

let redis = null

const getRedis = () => {
  if (!process.env.REDIS_URL || process.env.REDIS_URL === 'your_upstash_redis_url') {
    return null
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      connectTimeout: 5000
    })

    redis.on('connect', () => console.log('✅ Redis connected'))
    redis.on('error', (err) => console.warn('⚠️  Redis error (cache disabled):', err.message))
  }

  return redis
}

const STORY_TTL = 60 * 60 * 24 // 24 hours

// Cache key helpers
const storyKey = (childId, character, topic) =>
  `story:${childId}:${character}:${topic.toLowerCase().trim()}`

const sessionKey = (childId) => `session:${childId}`

// Get cached story — returns null if not cached or Redis unavailable
export const getCachedStory = async (childId, character, topic) => {
  const client = getRedis()
  if (!client) return null

  try {
    const cached = await client.get(storyKey(childId, character, topic))
    if (!cached) return null
    console.log(`⚡ Cache hit: story for ${childId} — ${topic}`)
    return JSON.parse(cached)
  } catch {
    return null
  }
}

// Cache a completed story for 24 hours
export const cacheStory = async (childId, character, topic, storyData) => {
  const client = getRedis()
  if (!client) return

  try {
    await client.setex(
      storyKey(childId, character, topic),
      STORY_TTL,
      JSON.stringify(storyData)
    )
    console.log(`💾 Cached story: ${topic} for ${childId} (TTL: 24h)`)
  } catch (err) {
    console.warn('Cache write failed:', err.message)
  }
}

// Invalidate a specific story from cache
export const invalidateStoryCache = async (childId, character, topic) => {
  const client = getRedis()
  if (!client) return

  try {
    await client.del(storyKey(childId, character, topic))
    console.log(`🗑️  Cache invalidated: ${topic} for ${childId}`)
  } catch (err) {
    console.warn('Cache invalidation failed:', err.message)
  }
}

// Invalidate all cached stories for a child (e.g. when child settings change)
export const invalidateChildCache = async (childId) => {
  const client = getRedis()
  if (!client) return

  try {
    const keys = await client.keys(`story:${childId}:*`)
    if (keys.length > 0) {
      await client.del(...keys)
      console.log(`🗑️  Invalidated ${keys.length} cached stories for child ${childId}`)
    }
  } catch (err) {
    console.warn('Child cache invalidation failed:', err.message)
  }
}

// Session: store active socket session for a child
export const setChildSession = async (childId, socketId) => {
  const client = getRedis()
  if (!client) return

  try {
    await client.setex(sessionKey(childId), 3600, socketId) // 1 hour TTL
  } catch (err) {
    console.warn('Session set failed:', err.message)
  }
}

// Session: get active socket session for a child
export const getChildSession = async (childId) => {
  const client = getRedis()
  if (!client) return null

  try {
    return await client.get(sessionKey(childId))
  } catch {
    return null
  }
}

// Session: remove child session on disconnect
export const removeChildSession = async (childId) => {
  const client = getRedis()
  if (!client) return

  try {
    await client.del(sessionKey(childId))
  } catch (err) {
    console.warn('Session remove failed:', err.message)
  }
}

export const getRedisClient = getRedis
export default getRedis
