"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"

interface StoryScene {
  id: number
  image: string
  text: string
}

interface StoryPlayerProps {
  scenes: StoryScene[]
  storyTitle: string
  onRestart?: () => void
}

export default function StoryPlayer({ scenes, storyTitle, onRestart }: StoryPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const currentScene = scenes[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === scenes.length - 1

  const goNext = () => {
    if (isLast) return
    setDirection(1)
    setCurrentIndex((i) => i + 1)
  }

  const goPrev = () => {
    if (isFirst) return
    setDirection(-1)
    setCurrentIndex((i) => i - 1)
  }

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((i) => {
          if (i >= scenes.length - 1) {
            setAutoPlay(false)
            return i
          }
          setDirection(1)
          return i + 1
        })
      }, 5000)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [autoPlay, scenes.length])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 py-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-primary"
      >
        {storyTitle}
      </motion.h1>

      {/* Scene counter */}
      <div className="flex gap-2 items-center">
        {scenes.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1)
              setCurrentIndex(i)
            }}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 h-3 bg-primary"
                : "w-3 h-3 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Scene card */}
      <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-white min-h-[520px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full"
          >
            {/* Image */}
            <div className="relative w-full aspect-video bg-amber-50 overflow-hidden rounded-t-3xl">
              {currentScene.image ? (
                <img
                  src={currentScene.image}
                  alt={`scene-${currentScene.id}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  📖
                </div>
              )}

              {/* Scene number badge */}
              <div className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                {currentIndex + 1} / {scenes.length}
              </div>
            </div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <p
                className="text-xl font-semibold text-center text-ink leading-relaxed"
                style={{ direction: "rtl" }}
              >
                {currentScene.text}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-2">
        {/* Prev */}
        <motion.button
          onClick={goPrev}
          disabled={isFirst}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-2xl disabled:opacity-30 border border-border-warm"
        >
          ▶
        </motion.button>

        {/* AutoPlay */}
        <motion.button
          onClick={() => setAutoPlay((p) => !p)}
          whileTap={{ scale: 0.9 }}
          className={`px-6 py-3 rounded-full font-bold text-white shadow-md transition-colors ${
            autoPlay ? "bg-rose-400" : "bg-primary"
          }`}
        >
          {autoPlay ? "⏸ إيقاف" : "▶ تشغيل تلقائي"}
        </motion.button>

        {/* Next */}
        <motion.button
          onClick={goNext}
          disabled={isLast}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-2xl disabled:opacity-30 border border-border-warm"
        >
          ◀
        </motion.button>
      </div>

      {/* End of story */}
      {isLast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center w-full"
        >
          <div className="text-5xl mb-3">🌟</div>
          <h2 className="text-2xl font-bold text-primary mb-2">انتهت الحدوتة!</h2>
          <p className="text-ink-muted mb-4">عجبتك الحدوتة؟</p>
          <div className="flex gap-3 justify-center">
            {onRestart && (
              <button
                onClick={onRestart}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow"
              >
                🔄 حدوتة جديدة
              </button>
            )}
            <button
              onClick={() => setCurrentIndex(0)}
              className="bg-white border border-primary text-primary px-6 py-3 rounded-2xl font-bold shadow"
            >
              ↩ من الأول
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}