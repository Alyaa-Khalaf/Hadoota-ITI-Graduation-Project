import OpenAI from 'openai'
import { recordTokenUsage } from './tokenUsageService.js'

let client = null

const getClient = () => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_key') {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

const DEFAULT_SCENE_COUNT = 3

export const generateStoryStructure = async ({
  topic,
  character,
  childAge = 6,
  sceneCount = DEFAULT_SCENE_COUNT,
  userId,
  childId,
  storyId,
}) => {
  const openai = getClient()
  const count = Math.min(Math.max(sceneCount, 2), 5)

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_STORY_MODEL || 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You write interactive Arabic children's stories for the app "Hadoota".
Return valid JSON only with this shape:
{
  "title": "string in Arabic",
  "scenes": [
    {
      "sceneIndex": 0,
      "text": "2-4 sentences in Modern Standard Arabic suitable for children",
      "imagePrompt": "English prompt for DALL-E: colorful children's book illustration, no text, safe for kids",
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
- Topic: ${topic}, main character: ${character}`,
      },
      {
        role: 'user',
        content: `اكتبي حدوتة تفاعلية عن "${topic}" والبطل "${character}" لطفل عمره ${childAge} سنين.`,
      },
    ],
    temperature: 0.8,
  })

  // تسجيل استهلاك التوكنز من الـ response.usage اللي بترجعها OpenAI
  if (response.usage) {
    await recordTokenUsage({
      userId,
      childId,
      storyId,
      provider: 'openai',
      operation: 'story_structure',
      promptTokens: response.usage.prompt_tokens || 0,
      completionTokens: response.usage.completion_tokens || 0,
      totalTokens: response.usage.total_tokens || 0,
    })
  }

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI returned empty story content')
  }

  const parsed = JSON.parse(content)
  if (!parsed.title || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error('Invalid story structure from OpenAI')
  }

  return parsed
}

export const generateSceneImage = async (imagePrompt, { userId, childId, storyId } = {}) => {
  const openai = getClient()

  const result = await openai.images.generate({
    model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
    prompt: `${imagePrompt}. Style: warm children's book illustration, soft colors, no text or letters in image.`,
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  })

  // DALL-E متتسعّرش بالتوكن، فبنسجّل عدد الصور بدلاً من ذلك
  await recordTokenUsage({
    userId,
    childId,
    storyId,
    provider: 'openai',
    operation: 'scene_image',
    imageCount: 1,
  })

  const imageUrl = result.data[0]?.url
  if (!imageUrl) {
    throw new Error('OpenAI did not return an image URL')
  }

  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error('Failed to download generated image')
  }

  const arrayBuffer = await imageResponse.arrayBuffer()
  return Buffer.from(arrayBuffer)
}