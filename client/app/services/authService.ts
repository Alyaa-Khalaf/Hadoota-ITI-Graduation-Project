import apiClient from '@/utils/api'
import { User, AuthPayload, ApiResponse } from '@/types'
import { mapUser } from '@/utils/mappers'

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthPayload>> => {
    const response = await apiClient.post('/auth/login', { email, password })
    const body = response.data as ApiResponse<AuthPayload & { user: User & { _id?: string } }>
    if (body.success && body.data) {
      return {
        ...body,
        data: {
          accessToken: body.data.accessToken,
          refreshToken: body.data.refreshToken,
          user: mapUser(body.data.user),
        },
      }
    }
    return body
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<AuthPayload>> => {
    const response = await apiClient.post('/auth/register', { name, email, password })
    const body = response.data as ApiResponse<AuthPayload & { user: User & { _id?: string } }>
    if (body.success && body.data) {
      return {
        ...body,
        data: {
          accessToken: body.data.accessToken,
          refreshToken: body.data.refreshToken,
          user: mapUser(body.data.user),
        },
      }
    }
    return body
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Clear local session even if server logout fails
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/users/profile')
    const body = response.data as ApiResponse<User & { _id?: string }>
    if (body.success && body.data) {
      return { ...body, data: mapUser(body.data) }
    }
    return body as ApiResponse<User>
  },
}
