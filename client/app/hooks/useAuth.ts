import { useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { authService } from '@/services/authService'
import { getApiErrorMessage } from '@/utils/api'
import { User } from '@/types'

const persistToken = (token: string | null) => {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isHydrated,
    error,
    setUser,
    setToken,
    setLoading,
    setHydrated,
    setError,
    logout,
  } = useAuthStore()

  const applySession = useCallback(
    (nextUser: User, accessToken: string) => {
      setUser(nextUser)
      setToken(accessToken)
      persistToken(accessToken)
    },
    [setUser, setToken]
  )

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.login(email, password)
        if (response.success && response.data) {
          applySession(response.data.user, response.data.accessToken)
          return true
        }
        setError(response.message || 'فشل تسجيل الدخول')
        return false
      } catch (err) {
        setError(getApiErrorMessage(err, 'فشل تسجيل الدخول'))
        return false
      } finally {
        setLoading(false)
      }
    },
    [applySession, setLoading, setError]
  )

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.register(name, email, password)
        if (response.success && response.data) {
          applySession(response.data.user, response.data.accessToken)
          return true
        }
        setError(response.message || 'فشل إنشاء الحساب')
        return false
      } catch (err) {
        setError(getApiErrorMessage(err, 'فشل إنشاء الحساب'))
        return false
      } finally {
        setLoading(false)
      }
    },
    [applySession, setLoading, setError]
  )

  const hydrateSession = useCallback(async () => {
    if (typeof window === 'undefined') return

    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      setHydrated(true)
      return
    }

    setToken(storedToken)
    setLoading(true)
    try {
      const response = await authService.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        persistToken(null)
        setToken(null)
        setUser(null)
      }
    } catch {
      persistToken(null)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
      setHydrated(true)
    }
  }, [setToken, setUser, setLoading, setHydrated])

  const handleLogout = useCallback(async () => {
    await authService.logout()
    logout()
  }, [logout])

  return {
    user,
    token,
    isLoading,
    isHydrated,
    error,
    login,
    register,
    hydrateSession,
    logout: handleLogout,
  }
}
