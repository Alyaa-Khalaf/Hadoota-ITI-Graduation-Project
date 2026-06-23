"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useStory() {
  const { accessToken } = useAuth();

  const socketRef = useRef<Socket | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState("");

  // =========================
  // SOCKET SETUP
  // =========================
  useEffect(() => {
    if (!accessToken) return;

    const socket = io(API, {
      auth: { token: accessToken },
    });

    socketRef.current = socket;

    socket.on("story:generating", () => {
      setIsGenerating(true);
    });

    socket.on("story:completed", (data) => {
      setStory(data.story);
      setIsGenerating(false);
    });

    socket.on("story:error", (err) => {
      setError(err.message || "Error");
      setIsGenerating(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  // =========================
  // GENERATE STORY
  // =========================
  const generateStory = useCallback(
    async ({ childId, character, topic }: any) => {
      if (!accessToken || isGenerating) return;

      setError("");
      setIsGenerating(true);
      setStory(null);

      try {
        const res = await fetch(
          `${API}/api/stories/generate`,
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
          throw new Error(data.message || "Failed to generate story");
        }
      } catch (err: any) {
        setError(err.message);
        setIsGenerating(false);
      }
    },
    [accessToken, isGenerating]
  );

  return {
    generateStory,
    isGenerating,
    story,
    error,
  };
}