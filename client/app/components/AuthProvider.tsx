'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrateSession } = useAuth()

  useEffect(() => {
    hydrateSession()
  }, [hydrateSession])

  return <>{children}</>
}
