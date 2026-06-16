"use client"

import { useState } from "react"

import { mockScenes } from "@/types/storyScenes"

import StoryImage from "./StoryImage"
import StoryText from "./StoryText"
import StoryControls from "./StoryControls"
import StoryProgress from "./StoryProgress"

export default function StoryPlayer() {

  const [currentScene, setCurrentScene] = useState(0)

  const scene = mockScenes[currentScene]

  const nextScene = () => {

    if (currentScene < mockScenes.length - 1) {
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

      <StoryProgress
        current={currentScene + 1}
        total={mockScenes.length}
      />

      <StoryImage image={scene.image} />

      <StoryText text={scene.text} />

      <StoryControls
        next={nextScene}
        prev={prevScene}
      />

    </div>

  )
}