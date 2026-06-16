import { sendSuccess, sendError } from '../utils/apiResponse.js'
import {
  generateInteractiveStory,
  getStoryForParent,
} from '../services/storyGenerationService.js'
import { openDownloadStream, getFileMetadata } from '../services/gridfsService.js'

// POST /api/stories/generate
export const generateStory = async (req, res) => {
  try {
    const { topic, character, childAge, sceneCount } = req.body
    const childId = req.body.childId || req.query.childId

    if (!topic?.trim()) {
      return sendError(res, 400, 'topic is required')
    }
    if (!character?.trim()) {
      return sendError(res, 400, 'character is required')
    }
    if (!childId) {
      return sendError(res, 400, 'childId is required')
    }

    const story = await generateInteractiveStory({
      topic: topic.trim(),
      character: character.trim(),
      childId,
      parentId: req.user._id,
      childAge: childAge || req.child?.age || 6,
      sceneCount: sceneCount ? Number(sceneCount) : undefined,
    })

    return sendSuccess(res, 201, 'Story generated successfully', story)
  } catch (error) {
    console.error('Story generation failed:', error.message)
    return sendError(res, 500, 'Story generation failed', [error.message])
  }
}

// GET /api/stories/generated/:id
export const getGeneratedStory = async (req, res) => {
  try {
    const story = await getStoryForParent(req.params.id, req.user._id)

    if (!story) {
      return sendError(res, 404, 'Story not found')
    }

    return sendSuccess(res, 200, 'Story fetched successfully', story)
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}

// GET /api/media/:fileId
export const streamMedia = async (req, res) => {
  try {
    const file = await getFileMetadata(req.params.fileId)

    if (!file) {
      return sendError(res, 404, 'Media file not found')
    }

    if (file.metadata?.parentId !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized to access this media')
    }

    res.set('Content-Type', file.metadata?.contentType || 'application/octet-stream')
    res.set('Cache-Control', 'public, max-age=86400')

    const stream = openDownloadStream(req.params.fileId)
    stream.on('error', () => {
      if (!res.headersSent) {
        sendError(res, 500, 'Failed to stream media')
      }
    })
    stream.pipe(res)
  } catch (error) {
    return sendError(res, 500, 'Server error', [error.message])
  }
}
