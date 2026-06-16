import Story from '../models/storyModel.js'
import { generateStoryStructure, generateSceneImage, getProvider } from './storyAiService.js'
import { generateSpeech } from './elevenlabsService.js'
import { uploadBuffer } from './gridfsService.js'

const buildMediaMetadata = ({ parentId, childId, storyId, type, sceneIndex }) => ({
  parentId: parentId.toString(),
  childId: childId.toString(),
  storyId: storyId.toString(),
  type,
  sceneIndex,
  contentType: type === 'image' ? 'image/png' : 'audio/mpeg',
})

export const generateInteractiveStory = async ({
  topic,
  character,
  childId,
  parentId,
  childAge,
  sceneCount,
}) => {
  const story = await Story.create({
    title: 'جاري التحضير...',
    topic,
    character,
    childId,
    parentId,
    status: 'generating',
    scenes: [],
    content: '',
  })

  try {
    console.log(`📖 Story generation using: ${getProvider()}`)

    const structure = await generateStoryStructure({
      topic,
      character,
      childAge,
      sceneCount,
    })

    story.title = structure.title
    story.content = structure.scenes.map((s) => s.text).join('\n\n')

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
        sceneIndex: scene.sceneIndex,
        text: scene.text,
        imageFileId,
        audioFileId,
        choices: (scene.choices || []).map((choice) => ({
          text: choice.text,
          nextSceneIndex: choice.nextSceneIndex,
        })),
      })
    }

    story.scenes = scenes
    story.status = 'ready'
    await story.save()

    return formatStoryResponse(story)
  } catch (error) {
    story.status = 'failed'
    await story.save()
    throw error
  }
}

export const getStoryForParent = async (storyId, parentId) => {
  const story = await Story.findOne({ _id: storyId, parentId })
  if (!story) return null
  return formatStoryResponse(story)
}

export const formatStoryResponse = (story) => {
  const doc = story.toObject ? story.toObject() : story

  return {
    id: doc._id,
    title: doc.title,
    topic: doc.topic,
    character: doc.character,
    childId: doc.childId,
    parentId: doc.parentId,
    status: doc.status,
    content: doc.content,
    views: doc.views,
    scenes: (doc.scenes || []).map((scene) => ({
      sceneIndex: scene.sceneIndex,
      text: scene.text,
      imageUrl: `/api/media/${scene.imageFileId}`,
      audioUrl: `/api/media/${scene.audioFileId}`,
      choices: scene.choices,
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}
