"use client";

import { useState } from "react";
import { useStorySocket } from "@/hooks/useStorySocket";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import { useStoryInput } from "@/hooks/useStoryInput";

export default function StoriesPage() {
  const { childId, character, topic } = useStoryInput();

  const {
    generateStory,
    isGenerating,
    scenes,
    storyTitle,
    error,
  } = useStorySocket();

  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    if (!childId || !character || !topic) {
      return;
    }

    setStarted(true);
    await generateStory(childId, character, topic);
  };

  const canStart = Boolean(childId && character && topic);

  if (!started) {
    return (
      <div className="text-center p-10">
        {!canStart && (
          <p className="text-red-500 mb-4">
            تأكدي من اختيار الطفل والشخصية والموضوع قبل البدء
          </p>
        )}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
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