const API_ORIGIN =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

export async function fetchAuthenticatedMediaUrl(
  mediaPath: string,
  accessToken: string
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

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function mapScenesWithAuthMedia(
  scenes: Array<{ sceneIndex?: number; order?: number; text: string; imageUrl: string; audioUrl?: string }>,
  accessToken: string
) {
  return Promise.all(
    scenes.map(async (scene) => {
      const image = await fetchAuthenticatedMediaUrl(scene.imageUrl, accessToken)
      return {
        id: scene.sceneIndex ?? scene.order ?? 0,
        image,
        text: scene.text,
      }
    })
  )
}
