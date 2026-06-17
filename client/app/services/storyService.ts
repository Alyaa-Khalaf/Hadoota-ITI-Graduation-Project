import apiClient from '@/utils/api'
import { ApiResponse, GeneratedStory } from '@/types'
import { extractMediaFileId } from '@/utils/mappers'

export interface GenerateStoryPayload {
  childId: string
  topic: string
  character: string
  sceneCount?: number
  childAge?: number
}

export const storyService = {
  generate: async (payload: GenerateStoryPayload): Promise<ApiResponse<GeneratedStory>> => {
    const response = await apiClient.post('/stories/generate', payload, {
      timeout: 180000,
    })
    return response.data
  },

  getGenerated: async (id: string): Promise<ApiResponse<GeneratedStory>> => {
    const response = await apiClient.get(`/stories/generated/${id}`)
    return response.data
  },

  getMediaBlobUrl: async (mediaUrl: string): Promise<string> => {
    const fileId = extractMediaFileId(mediaUrl)
    const response = await apiClient.get(`/media/${fileId}`, {
      responseType: 'blob',
      timeout: 60000,
    })
    return URL.createObjectURL(response.data)
  },
}
