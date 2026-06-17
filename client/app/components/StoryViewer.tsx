'use client'

import { useEffect, useState } from 'react'
import { GeneratedStory, StoryScene } from '@/types'
import { storyService } from '@/services/storyService'
import { getApiErrorMessage } from '@/utils/api'

interface SceneMedia {
  imageUrl: string
  audioUrl: string
}

interface StoryViewerProps {
  story: GeneratedStory
}

export default function StoryViewer({ story }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mediaByScene, setMediaByScene] = useState<Record<number, SceneMedia>>({})
  const [loadingMedia, setLoadingMedia] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const scenes = story.scenes || []
  const currentScene: StoryScene | undefined = scenes.find((s) => s.sceneIndex === currentIndex)

  useEffect(() => {
    let cancelled = false

    const loadMedia = async () => {
      setLoadingMedia(true)
      setError(null)
      try {
        const entries = await Promise.all(
          scenes.map(async (scene) => {
            const [imageUrl, audioUrl] = await Promise.all([
              storyService.getMediaBlobUrl(scene.imageUrl),
              storyService.getMediaBlobUrl(scene.audioUrl),
            ])
            return [scene.sceneIndex, { imageUrl, audioUrl }] as const
          })
        )

        if (!cancelled) {
          setMediaByScene(Object.fromEntries(entries))
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'تعذر تحميل الصور أو الصوت'))
        }
      } finally {
        if (!cancelled) {
          setLoadingMedia(false)
        }
      }
    }

    if (scenes.length > 0) {
      loadMedia()
    } else {
      setLoadingMedia(false)
    }

    return () => {
      cancelled = true
      Object.values(mediaByScene).forEach((media) => {
        URL.revokeObjectURL(media.imageUrl)
        URL.revokeObjectURL(media.audioUrl)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id])

  if (!currentScene) {
    return <p className="text-gray-600">لا توجد مشاهد في هذه القصة.</p>
  }

  const sceneMedia = mediaByScene[currentIndex]

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <p className="text-sm text-gray-500">
          {story.topic} — {story.character}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loadingMedia ? (
        <p className="text-gray-600">جاري تحميل الصور والصوت...</p>
      ) : (
        <>
          {sceneMedia?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sceneMedia.imageUrl}
              alt={`مشهد ${currentIndex + 1}`}
              className="w-full rounded-lg object-cover max-h-96"
            />
          )}

          {sceneMedia?.audioUrl && (
            <audio key={currentIndex} src={sceneMedia.audioUrl} controls autoPlay className="w-full" />
          )}
        </>
      )}

      <p className="text-lg leading-relaxed">{currentScene.text}</p>

      {currentScene.choices.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">ماذا تختار؟</p>
          {currentScene.choices.map((choice) => (
            <button
              key={`${currentIndex}-${choice.nextSceneIndex}-${choice.text}`}
              type="button"
              onClick={() => setCurrentIndex(choice.nextSceneIndex)}
              className="px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition text-right"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 text-center">
        مشهد {currentIndex + 1} من {scenes.length}
      </p>
    </div>
  )
}
