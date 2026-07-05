import { GoogleGenerativeAI } from '@google/generative-ai'
import { recordTokenUsage } from './tokenUsageService.js'

const DEFAULT_SCENE_COUNT = 3

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY
  if (!key || key === 'your_gemini_key') {
    throw new Error('GEMINI_API_KEY is not configured')
  }
  return key
}

const getClient = () => new GoogleGenerativeAI(getApiKey())

const buildStoryPrompt = ({ topic, character, childAge, sceneCount }) => {
  const count = Math.min(Math.max(sceneCount, 2), 5)

  return `You write interactive Arabic children's stories for the app "Hadoota".
Return valid JSON only with this shape:
{
  "title": "string in Arabic",
  "scenes": [
    {
      "sceneIndex": 0,
      "text": "2-4 sentences in Modern Standard Arabic suitable for children",
      "imagePrompt": "English prompt for illustration: colorful children's book illustration, no text, safe for kids",
      "choices": [
        { "text": "Arabic choice label", "nextSceneIndex": 1 }
      ]
    }
  ]
}
Rules:
- Exactly ${count} scenes with sceneIndex 0..${count - 1}
- Each scene (except the last) has exactly 2 choices pointing to valid nextSceneIndex
- Last scene has empty choices array
- Educational, positive, age-appropriate for ${childAge} years
- Topic: ${topic}, main character: ${character}

Write an interactive story about "${topic}" with hero "${character}" for a ${childAge}-year-old child.`
}

// بيستخرج بيانات استهلاك التوكنز من رد Gemini (لو موجودة) ويسجّلها
const trackGeminiUsage = async ({ response, userId, childId, storyId, operation }) => {
  const usage = response.usageMetadata
  if (!usage) return

  await recordTokenUsage({
    userId,
    childId,
    storyId,
    provider: 'gemini',
    operation,
    promptTokens: usage.promptTokenCount || 0,
    completionTokens: usage.candidatesTokenCount || 0,
    totalTokens: usage.totalTokenCount || 0,
  })
}

export const generateStoryStructure = async ({
  topic,
  character,
  childAge = 6,
  sceneCount = DEFAULT_SCENE_COUNT,
  userId,
  childId,
  storyId,
}) => {
  const genAI = getClient()
  const modelName = process.env.GEMINI_STORY_MODEL || 'gemini-2.0-flash'

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8,
    },
  })

  const result = await model.generateContent(
    buildStoryPrompt({ topic, character, childAge, sceneCount })
  )

  await trackGeminiUsage({
    response: result.response,
    userId,
    childId,
    storyId,
    operation: 'story_structure',
  })

  const content = result.response.text()
  if (!content) {
    throw new Error('Gemini returned empty story content')
  }

  const parsed = JSON.parse(content)
  if (!parsed.title || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error('Invalid story structure from Gemini')
  }

  return parsed
}

const extractImageBufferFromGeminiResponse = (response) => {
  const parts = response.candidates?.[0]?.content?.parts || []

  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64')
    }
  }

  return null
}

const generateSceneImageWithGemini = async (imagePrompt, { userId, childId, storyId } = {}) => {
  const genAI = getClient()
  const modelName =
    process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-preview-image-generation'

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  })

  const prompt = `${imagePrompt}. Style: warm children's book illustration, soft colors, no text or letters in image.`

  const result = await model.generateContent(prompt)

  await trackGeminiUsage({
    response: result.response,
    userId,
    childId,
    storyId,
    operation: 'scene_image',
  })

  const buffer = extractImageBufferFromGeminiResponse(result.response)

  if (!buffer) {
    throw new Error('Gemini did not return image data')
  }

  return buffer
}

const generateSceneImageWithPollinations = async (
  imagePrompt,
  { userId, childId, storyId, retries = 2 } = {}
) => {
  const prompt = encodeURIComponent(
    `${imagePrompt}. warm children's book illustration, soft colors, no text, safe for kids`
  )
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&nologo=true`

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`Pollinations image fetch failed (${response.status})`)
      }

      const arrayBuffer = await response.arrayBuffer()

      // Pollinations مجانية ومفيهاش توكنز، بس بنسجّل عدد الصور المستهلكة للتتبع
      await recordTokenUsage({
        userId,
        childId,
        storyId,
        provider: 'pollinations',
        operation: 'scene_image',
        imageCount: 1,
      })

      return Buffer.from(arrayBuffer)
    } catch (err) {
      const isLastAttempt = attempt === retries
      if (isLastAttempt) {
        throw err
      }
      console.warn(
        `Pollinations attempt ${attempt + 1} failed (${err.message}), retrying...`
      )
      // انتظار بسيط قبل إعادة المحاولة (backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
}

export const generateSceneImage = async (imagePrompt, context = {}) => {
  try {
    return await generateSceneImageWithGemini(imagePrompt, context)
  } catch (geminiError) {
    console.warn('Gemini image failed, using Pollinations fallback:', geminiError.message)
    return generateSceneImageWithPollinations(imagePrompt, context)
  }
}