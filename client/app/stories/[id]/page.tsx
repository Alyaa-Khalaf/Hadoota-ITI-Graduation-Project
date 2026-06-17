'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import { storyService } from '@/services/storyService'
import { GeneratedStory } from '@/types'
import { getApiErrorMessage } from '@/utils/api'
import StoryViewer from '@/components/StoryViewer'

export default function StoryDetailPage() {
  const params = useParams()
  const storyId = params.id as string
  const { user, isHydrated, isLoading: authLoading } = useAuth()
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !storyId) return

    const loadStory = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await storyService.getGenerated(storyId)
        if (response.success && response.data) {
          setStory(response.data)
        } else {
          setError(response.message || 'القصة غير موجودة')
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'تعذر تحميل القصة'))
      } finally {
        setLoading(false)
      }
    }

    loadStory()
  }, [user, storyId])

  if (!isHydrated || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h1>
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            اذهب إلى صفحة الدخول
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href={ROUTES.STORIES} className="text-primary hover:underline mb-6 inline-block">
        ← العودة للقصص
      </Link>

      {loading && <p className="text-gray-600">جاري تحميل القصة...</p>}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded max-w-3xl mx-auto">{error}</div>
      )}

      {story && story.status === 'ready' && <StoryViewer story={story} />}

      {story && story.status !== 'ready' && (
        <p className="text-gray-600">حالة القصة: {story.status}</p>
      )}
    </div>
  )
}
