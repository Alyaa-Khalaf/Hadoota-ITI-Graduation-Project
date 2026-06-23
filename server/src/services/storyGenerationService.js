import Story from '../models/Story.js'
import { generateStoryStructure, generateSceneImage, getProvider } from './storyAiService.js'
import { generateSpeech } from './elevenlabsService.js'
import { uploadBuffer } from './gridfsService.js'

const getApiBase = () =>
  process.env.API_BASE_URL ||
  `http://localhost:${process.env.PORT || 5000}`

const buildMediaMetadata = ({ parentId, childId, storyId, type, sceneIndex }) => ({
  parentId: parentId.toString(),
  childId: childId.toString(),
  storyId: storyId.toString(),
  type,
  sceneIndex,
  contentType: type === 'image' ? 'image/png' : 'audio/mpeg',
})

const toMediaUrl = (fileId) => `${getApiBase()}/api/media/${fileId}`

/**
 * Runs Nourhan's Gemini + ElevenLabs + GridFS pipeline on an existing Story doc
 * (devStage3 schema: order, imageUrl, audioUrl, status=completed)
 */
export const runNourhanStoryPipeline = async ({
  storyDoc,
  childId,
  parentId,
  character,
  topic,
  childAge = 6,
  sceneCount = 2,
}) => {
  const story = storyDoc

  console.log(`📖 Story generation using: ${getProvider()}`)

  const structure = await generateStoryStructure({
    topic,
    character,
    childAge,
    sceneCount,
  })

  story.title = structure.title

  const scenes = []

  for (const scene of structure.scenes) {
    const [imageBuffer, audioBuffer] = await Promise.all([
      generateSceneImage(scene.imagePrompt),
      generateSpeech(scene.text),
    ])

    const baseName = `story-${story._id}-scene-${scene.sceneIndex}`

    const [imageFileId, audioFileId] = await Promise.all([
      uploadBuffer(
        imageBuffer,
        `${baseName}.png`,
        buildMediaMetadata({
          parentId,
          childId,
          storyId: story._id,
          type: 'image',
          sceneIndex: scene.sceneIndex,
        })
      ),
      uploadBuffer(
        audioBuffer,
        `${baseName}.mp3`,
        buildMediaMetadata({
          parentId,
          childId,
          storyId: story._id,
          type: 'audio',
          sceneIndex: scene.sceneIndex,
        })
      ),
    ])

    scenes.push({
      order: scene.sceneIndex,
      sceneIndex: scene.sceneIndex,
      text: scene.text,
      imageUrl: toMediaUrl(imageFileId),
      audioUrl: toMediaUrl(audioFileId),
      choices: (scene.choices || []).map((choice) => ({
        text: choice.text,
        nextScene: choice.nextSceneIndex,
      })),
    })
  }

  story.scenes = scenes
  story.status = 'completed'
  story.completedAt = new Date()
  story.moralLesson = story.moralLesson || 'تعلمنا قيمة التعاون والشجاعة من هذه الحدوتة'
  story.safetyCheck = {
    safe: true,
    flagged: false,
    reason: '',
  }

  await story.save()
  return story
}
