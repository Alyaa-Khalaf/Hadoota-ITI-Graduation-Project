"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

interface BackendScene {
  sceneIndex: number;
  text: string;
  imageUrl: string;
  audioUrl?: string;
}

interface StoryScene {
  id: number;
  image: string;
  text: string;
}

function map(scene: BackendScene): StoryScene {
  return {
    id: scene.sceneIndex,
    image: scene.imageUrl,
    text: scene.text,
  };
}

export function useStorySocket() {
  const socketRef = useRef<Socket | null>(null);
   const { accessToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<StoryScene[] | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [error, setError] = useState("");

  // init socket
  useEffect(() => {
  if (!accessToken) return;

  const socket = io(API_BASE_URL, {
    auth: { token: accessToken },
  });

  socketRef.current = socket;

  socket.on("story:generating", () => {
    setIsGenerating(true);
  });

  socket.on("story:completed", (payload: any) => {
    const story = payload.story;

    const mapped = story.scenes
      .sort((a: any, b: any) => a.sceneIndex - b.sceneIndex)
      .map(map);

    setScenes(mapped);
    setStoryTitle(story.title);
    setIsGenerating(false);
  });

  socket.on("story:error", (err) => {
    setError(err.message || "Error");
    setIsGenerating(false);
  });

  return () => {
    socket.disconnect();
  };
}, [accessToken]); // 👈 مهم جدًا

  // generate story
  const generateStory = useCallback(
    async (childId: string, character: string, topic: string) => {
      setError("");
      setScenes(null);
      setIsGenerating(true);

      if (!accessToken) {
        setError("Authorization token not available.");
        setIsGenerating(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/stories/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              childId,
              character,
              topic,
              socketId: socketRef.current?.id,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "فشل في توليد الحدوتة");
        }

        // Response only confirms the generate request. Final story arrives via socket events.
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
        setIsGenerating(false);
      }
    },
    [accessToken]
  );

  return {
    generateStory,
    isGenerating,
    scenes,
    storyTitle,
    error,
  };
}