"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useStorySocket } from "@/hooks/useStorySocket"
import StoryPlayer from "@/components/story-player/StoryPlayer"

// ─── Loading Screen ───────────────────────────────────────────────────────────
function GeneratingScreen({ topic, character }: { topic: string; character: string }) {
  return (
    <div
      className="story-background min-h-screen flex flex-col items-center justify-center gap-8 p-6"
      style={{ "--bg-image": 'url("/assets/kidsStory.jpg")' } as React.CSSProperties}
    >
      {/* Floating emoji cluster */}
      <div className="flex gap-6 text-5xl">
        {["✨", "📖", "🌙", "⭐"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.h2
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-3xl font-bold text-primary-wash text-center"
      >
        بنكتب حدوتتك دلوقتي...
      </motion.h2>

      <p className="text-white text-lg text-center opacity-80">
        {character} هيروح في رحلة عن{" "}
        <span className="font-bold text-yellow-300">{topic}</span>
      </p>

      {/* Progress bar */}
      <div className="w-64 h-3 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <p className="text-white/60 text-sm">ممكن ياخد لحظة... الحدوتة بتتولد بالذكاء الاصطناعي 🤖</p>
    </div>
  )
}

// ─── Error Screen ─────────────────────────────────────────────────────────────
function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-amber-50 p-6">
      <div className="text-6xl">😕</div>
      <h2 className="text-2xl font-bold text-red-500 text-center">حصل مشكلة!</h2>
      <p className="text-ink-muted text-center max-w-sm">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow"
        >
          🔄 حاول تاني
        </button>
        <button
          onClick={() => router.push("/childTopics")}
          className="bg-white border border-primary text-primary px-6 py-3 rounded-2xl font-bold shadow"
        >
          ← اختار موضوع تاني
        </button>
      </div>
    </div>
  )
}

// ─── Main Page Content ────────────────────────────────────────────────────────
function StoriesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const childId = searchParams.get("childId") || ""
  const character = searchParams.get("character") || ""
  const topic = searchParams.get("topic") || ""

  const { generateStory, isGenerating, scenes, storyTitle, error } = useStorySocket()

  // Trigger generation once params are ready
  useEffect(() => {
    if (childId && character && topic) {
      generateStory(childId, character, topic)
    }
  }, [childId, character, topic]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestart = () => {
    router.push("/childCharacters")
  }

  // Missing params guard
  if (!childId || !character || !topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-amber-50">
        <div className="text-5xl">🤔</div>
        <p className="text-xl font-bold text-ink">بيانات ناقصة!</p>
        <button
          onClick={() => router.push("/childCharacters")}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold"
        >
          ابدأ من الأول
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorScreen
        message={error}
        onRetry={() => generateStory(childId, character, topic)}
      />
    )
  }

  if (isGenerating || !scenes) {
    return <GeneratingScreen topic={topic} character={character} />
  }

  return (
    <div
      className="story-background min-h-screen py-8"
      style={{ "--bg-image": 'url("/assets/kidsStory.jpg")' } as React.CSSProperties}
    >
      <StoryPlayer
        scenes={scenes}
        storyTitle={storyTitle}
        onRestart={handleRestart}
      />
    </div>
  )
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function StoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-amber-50">
          <div className="flex gap-4 text-5xl">
            <span className="animate-bounce">📚</span>
            <span className="animate-bounce [animation-delay:200ms]">✨</span>
            <span className="animate-bounce [animation-delay:400ms]">🌙</span>
          </div>
        </div>
      }
    >
      <StoriesContent />
    </Suspense>
  )
}