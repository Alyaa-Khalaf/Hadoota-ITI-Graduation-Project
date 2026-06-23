import { sendError } from '../utils/apiResponse.js'
import { openDownloadStream, getFileMetadata } from '../services/gridfsService.js'

// GET /api/media/:fileId
export const streamMedia = async (req, res) => {
  try {
    const file = await getFileMetadata(req.params.fileId)

    if (!file) {
      return sendError(res, 404, 'Media file not found')
    }

    const userId = req.user?.id || req.user?._id
    if (file.metadata?.parentId !== userId?.toString()) {
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
