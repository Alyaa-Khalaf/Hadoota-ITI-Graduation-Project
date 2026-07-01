import axios, { AxiosInstance, AxiosError } from 'axios'

import { API_BASE } from '@/lib/apiConfig'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken') || localStorage.getItem('token')
        : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // 401 = الجلسة غير صالحة (توكن مفقود/منتهي). نمسحها ونرجّع لتسجيل الدخول.
      // ملاحظة: صلاحيات غير كافية بتيجي 403 (مش 401) فمش بنعملها logout هنا.
      const hadToken =
        Boolean(localStorage.getItem('accessToken') || localStorage.getItem('token'))

      localStorage.removeItem('accessToken')
      localStorage.removeItem('token')

      const onAuthPage = window.location.pathname.includes('/auth/')
      // نعيد التوجيه فقط لو فعلاً كان فيه توكن (يعني الجلسة انتهت)،
      // ومش على صفحة auth أصلاً — عشان ميحصلش redirect loop.
      if (hadToken && !onAuthPage) {
        window.location.href = '/auth/login?error=SessionExpired'
      }
    }
    return Promise.reject(error)
  }
)

export const getApiErrorMessage = (error: unknown, fallback = 'حدث خطأ'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.message) return data.message
    if (data?.errors?.length) return data.errors[0]
  }
  if (error instanceof Error) return error.message
  return fallback
}

export default apiClient
