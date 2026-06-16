"use client"

import { useEffect, useState } from "react"
import { useStorySocket } from "@/hooks/useStorySocket"

import StoryImage from "./StoryImage"
import StoryText from "./StoryText"
import StoryControls from "./StoryControls"
import StoryProgress from "./StoryProgress"

interface StoryPlayerProps {
  childId: string
  character: string // "أسد" | "أميرة" | "رحالة"
  topic: string
}

export default function StoryPlayer({ childId, character, topic }: StoryPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const { generateStory, isGenerating, scenes, storyTitle, error } = useStorySocket()

  // عند فتح الصفحة، نطلب توليد الحدوتة فعلياً من السيرفر
  useEffect(() => {
    if (childId && character && topic) {
      generateStory(childId, character, topic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId, character, topic])

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg font-bold text-orange-500 animate-pulse">
          جاري توليد الحدوتة... ✨
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    )
  }

  if (!scenes || scenes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-400 font-bold">لا توجد حدوتة لعرضها حالياً.</p>
      </div>
    )
  }

  const scene = scenes[currentScene]

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1)
    }
  }

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {storyTitle && (
        <h2 className="text-xl font-black text-center mb-4">{storyTitle}</h2>
      )}

      <StoryProgress current={currentScene + 1} total={scenes.length} />

      <StoryImage image={scene.image} />

      <StoryText text={scene.text} />

      <StoryControls next={nextScene} prev={prevScene} />
    </div>
  )
}