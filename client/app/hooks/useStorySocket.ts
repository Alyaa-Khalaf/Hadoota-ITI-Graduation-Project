"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { StoryScene } from "@/types/childStory";

const API_BASE_URL = "http://localhost:5000";

interface BackendChoice {
  text: string;
  nextScene: number;
}

interface BackendScene {
  order: number;
  text: string;
  imageUrl: string;
  audioUrl?: string;
  choices?: BackendChoice[];
}

interface BackendStory {
  _id: string;
  title: string;
  scenes: BackendScene[];
  moralLesson?: string;
  status: "generating" | "completed" | "failed";
}

/* تحويل شكل scene القادم من الباك إند لشكل StoryScene المستخدم في الفرونت */
function mapBackendSceneToStoryScene(scene: BackendScene): StoryScene {
  const hasChoices = Array.isArray(scene.choices) && scene.choices.length > 0;

  return {
    id: scene.order,
    image: scene.imageUrl,
    text: scene.text,
    question: hasChoices
      ? {
          title: "ماذا تريد أن تفعل؟",
          options: scene.choices!.map((c) => c.text),
          correct: 0, // الباك إند الحالي ما بيرجع إجابة صحيحة محددة لكل اختيار
        }
      : null,
  };
}

export function useStorySocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<StoryScene[] | null>(null);
  const [storyTitle, setStoryTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    const socket = io(API_BASE_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("story:completed", (payload: { storyId: string; story: BackendStory }) => {
      const mapped = payload.story.scenes
        .sort((a, b) => a.order - b.order)
        .map(mapBackendSceneToStoryScene);

      setScenes(mapped);
      setStoryTitle(payload.story.title);
      setIsGenerating(false);
    });

    socket.on("story:error", (payload: { message: string }) => {
      setError(payload.message || "حدث خطأ أثناء توليد الحدوتة");
      setIsGenerating(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const generateStory = useCallback(
    async (childId: string, character: string, topic: string) => {
      setError("");
      setScenes(null);
      setIsGenerating(true);

      try {
        const token =
          localStorage.getItem("accessToken") || localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/stories/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            childId,
            character,
            topic,
            socketId: socketRef.current?.id,
          }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "فشل في بدء توليد الحدوتة");
        }
        // النتيجة الكاملة (scenes) هتوصل لاحقاً عبر socket event "story:completed"
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setIsGenerating(false);
      }
    },
    []
  );

  return { generateStory, isGenerating, scenes, storyTitle, error };
}