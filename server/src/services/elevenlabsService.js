const ELEVENLABS_API = "https://api.elevenlabs.io/v1";

export const generateSpeech = async (text) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const model = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";

  console.log("========== ElevenLabs Debug ==========");
  console.log(
    "API Key:",
    apiKey ? apiKey.substring(0, 12) + "..." : "NOT FOUND"
  );
  console.log("Voice ID:", voiceId);
  console.log("Model:", model);
  console.log("======================================");

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is missing");
  }

  if (!voiceId) {
    throw new Error("ELEVENLABS_VOICE_ID is missing");
  }

  try {
    const response = await fetch(
      `${ELEVENLABS_API}/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();

      console.log("========== ElevenLabs Error ==========");
      console.log("Status:", response.status);
      console.log(errorBody);
      console.log("======================================");

      throw new Error(
        `ElevenLabs error (${response.status}): ${errorBody}`
      );
    }

    console.log("✅ ElevenLabs Success");

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("❌ ElevenLabs Exception:");
    console.error(error);

    throw error;
  }
};