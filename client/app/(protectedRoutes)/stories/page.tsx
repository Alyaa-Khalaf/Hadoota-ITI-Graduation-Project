"use client";

import { useState } from "react";
import { useStorySocket } from "@/hooks/useStorySocket";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import { useStoryInput } from "@/hooks/useStoryInput";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";

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
  <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-pink-100 flex items-center justify-center p-6">
    <div className="w-full max-w-xl rounded-[32px] bg-white shadow-2xl border-4 border-yellow-300 p-8 text-center">

      <div className="flex justify-end mb-6">
        <HomeButton href="/childAdventure" />
      </div>

      <div className="text-7xl mb-4">📖✨</div>

      <h1 className="text-4xl font-black text-primary">
        مستعد للمغامرة؟
      </h1>

      <p className="mt-3 text-lg text-ink-muted">
        اضغط على الزر وسيبدأ الراوي في حكاية جديدة مليئة بالمفاجآت.
      </p>

      {!canStart && (
        <div className="mt-6 rounded-2xl bg-red-50 border-2 border-red-200 p-4">
          <p className="font-bold text-red-600">
            ⚠️ اختَر الطفل والشخصية والموضوع أولاً.
          </p>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="
          mt-8
          px-10
          py-4
          rounded-full
          bg-gradient-to-r
          from-primary
          to-rose
          text-white
          text-2xl
          font-black
          shadow-xl
          transition-all
          hover:scale-105
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        🚀 ابدأ الحدوتة
      </button>

      {error && (
        <p className="mt-5 text-red-500 font-bold">
          {error}
        </p>
      )}
    </div>
  </div>
);
  }

  if (isGenerating || !scenes) {
   return (
  <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-pink-100 flex items-center justify-center p-6">
    <div className="rounded-[32px] bg-white border-4 border-yellow-300 shadow-2xl p-10 text-center w-full max-w-lg">

      <div className="flex justify-end mb-6">
        <HomeButton href="/childAdventure" />
      </div>

      <div className="text-7xl animate-bounce mb-6">
        📚
      </div>

      <h2 className="text-3xl font-black text-primary">
        جاري تجهيز الحدوتة...
      </h2>

      <p className="mt-3 text-lg text-ink-muted">
        انتظر قليلًا... الراوي يكتب مغامرة رائعة لك ✨
      </p>

      <div className="mt-8 w-full h-4 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-primary to-rose animate-pulse" />
      </div>

      <div className="mt-6 text-5xl">
        🦊 🐻 🐰
      </div>

      {error && (
        <p className="mt-5 text-red-500 font-bold">
          {error}
        </p>
      )}
    </div>
  </div>
);
  }

  return (
    <>
      <HomeButton href="/childAdventure" />
       <PreviousButton/>
      <StoryPlayer scenes={scenes} title={storyTitle} />
    </>
  );
}