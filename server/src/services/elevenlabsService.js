const ELEVENLABS_API = 'https://api.elevenlabs.io/v1'

export const generateSpeech = async (text) => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  if (!apiKey || apiKey === 'your_elevenlabs_key') {
    throw new Error('ELEVENLABS_API_KEY is not configured')
  }
  if (!voiceId || voiceId === 'your_voice_id') {
    throw new Error('ELEVENLABS_VOICE_ID is not configured')
  }

  const response = await fetch(
    `${ELEVENLABS_API}/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`ElevenLabs error (${response.status}): ${errorBody}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
