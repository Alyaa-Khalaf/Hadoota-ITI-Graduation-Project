import apiClient from '@/utils/api'
import { User, ApiResponse } from '@/types'

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await apiClient.post('/auth/register', { name, email, password })
    return response.data
  },

  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
