"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { API_ORIGIN } from "@/lib/apiConfig";
import { mapScenesWithAuthMedia, type MappedStoryScene } from "@/services/mediaService";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || API_ORIGIN;
const API_BASE_URL = API_ORIGIN;

export function useStorySocket() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<MappedStoryScene[] | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [error, setError] = useState("");

  const applyStoryPayload = useCallback(
    async (story: {
      title: string;
      scenes: Array<{
        sceneIndex?: number;
        order?: number;
        text: string;
        imageUrl: string;
        audioUrl?: string;
        choices?: Array<{ text: string; nextScene: number }>;
      }>;
    }) => {
      if (!accessToken) return;

      const sorted = [...story.scenes].sort(
        (a, b) => (a.sceneIndex ?? a.order ?? 0) - (b.sceneIndex ?? b.order ?? 0)
      );

      const mapped = await mapScenesWithAuthMedia(sorted, accessToken);
      setScenes(mapped);
      setStoryTitle(story.title);
      setIsGenerating(false);
    },
    [accessToken]
  );

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
    });

    socketRef.current = socket;

    socket.on("story:generating", () => {
      setIsGenerating(true);
    });

    socket.on("story:completed", async (payload: { story: Parameters<typeof applyStoryPayload>[0] }) => {
      try {
        await applyStoryPayload(payload.story);
      } catch (err) {
        setError(err instanceof Error ? err.message : "تعذر تحميل الوسائط");
        setIsGenerating(false);
      }
    });

    socket.on("story:error", (err: { message?: string }) => {
      setError(err.message || "Error");
      setIsGenerating(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, applyStoryPayload]);

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
        const res = await fetch(`${API_BASE_URL}/api/stories/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            childId,
            character,
            topic,
            sceneCount: 2,
            socketId: socketRef.current?.id,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "فشل في توليد الحدوتة");
        }

        // Cached stories return the full story immediately
        if (data.data?.scenes?.length && data.data.status === "completed") {
          await applyStoryPayload(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
        setIsGenerating(false);
      }
    },
    [accessToken, applyStoryPayload]
  );

  return {
    generateStory,
    isGenerating,
    scenes,
    storyTitle,
    error,
  };
}
