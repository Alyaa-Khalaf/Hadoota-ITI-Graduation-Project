import { API_ORIGIN } from '@/lib/apiConfig'

export async function fetchAuthenticatedMediaUrl(
  mediaPath: string,
  accessToken: string,
  fallbackMime = 'application/octet-stream'
): Promise<string> {
  const url = mediaPath.startsWith('http') ? mediaPath : `${API_ORIGIN}${mediaPath}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Media fetch failed (${response.status})`)
  }

  const buffer = await response.arrayBuffer()
  const contentType =
    response.headers.get('content-type')?.split(';')[0].trim() || fallbackMime
  const blob = new Blob([buffer], { type: contentType })
  return URL.createObjectURL(blob)
}

export interface StoryChoice {
  text: string
  nextScene: number
}

export interface MappedStoryScene {
  id: number
  image: string
  audio: string | null
  text: string
  choices: StoryChoice[]
}

export async function mapScenesWithAuthMedia(
  scenes: Array<{
    sceneIndex?: number
    order?: number
    text: string
    imageUrl: string
    audioUrl?: string
    choices?: StoryChoice[]
  }>,
  accessToken: string
): Promise<MappedStoryScene[]> {
  return Promise.all(
    scenes.map(async (scene) => {
      const [image, audio] = await Promise.all([
        fetchAuthenticatedMediaUrl(scene.imageUrl, accessToken, 'image/png'),
        scene.audioUrl
          ? fetchAuthenticatedMediaUrl(scene.audioUrl, accessToken, 'audio/mpeg').catch(
              (err) => {
                console.warn('Audio fetch failed:', scene.audioUrl, err)
                return null
              }
            )
          : Promise.resolve(null),
      ])

      const choices = (scene.choices ?? []).filter(
        (choice) => choice.text && choice.nextScene != null
      )

      return {
        id: scene.sceneIndex ?? scene.order ?? 0,
        image,
        audio,
        text: scene.text,
        choices,
      }
    })
  )
}
