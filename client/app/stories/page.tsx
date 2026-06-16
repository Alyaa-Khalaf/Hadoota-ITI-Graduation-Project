"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStorySocket } from "@/hooks/useStorySocket";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import { useStoryInput } from "@/hooks/useStoryInput";

export default function StoriesPage() {
  const { accessToken } = useAuth();
  const { childId, childName, childAge, character, topic } = useStoryInput();

  const {
    generateStory,
    isGenerating,
    scenes,
    storyTitle,
    error,
  } = useStorySocket();

  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    setStarted(true);

    await generateStory(
      childId,
      character,
      topic
    );
  };

  if (!started) {
    return (
      <div className="text-center p-10">
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          ابدأ الحدوتة
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  if (isGenerating || !scenes) {
    return (
      <div className="text-center p-10">
        ✨ جاري توليد الحدوتة...
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <StoryPlayer scenes={scenes} title={storyTitle} />
  );
}