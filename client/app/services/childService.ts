import apiClient from '@/utils/api'
import { ApiResponse, Child } from '@/types'
import { mapChild } from '@/utils/mappers'

export const childService = {
  getChildren: async (): Promise<ApiResponse<Child[]>> => {
    const response = await apiClient.get('/children')
    const body = response.data as ApiResponse<Array<Child & { _id?: string }>>
    if (body.success && body.data) {
      return { ...body, data: body.data.map(mapChild) }
    }
    return body as ApiResponse<Child[]>
  },

  createChild: async (payload: { name: string; age?: number }): Promise<ApiResponse<Child>> => {
    const response = await apiClient.post('/children', payload)
    const body = response.data as ApiResponse<Child & { _id?: string }>
    if (body.success && body.data) {
      return { ...body, data: mapChild(body.data) }
    }
    return body as ApiResponse<Child>
  },
}
