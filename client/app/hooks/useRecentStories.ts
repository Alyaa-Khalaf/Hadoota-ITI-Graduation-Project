"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSelectedChild } from "@/context/childContext";

export type Story = {
  _id: string;
  title: string;
  character: string;
  topic: string;
  moralLesson?: string;
  status: "generating" | "completed" | "failed";
  isFavorite?: boolean;
  createdAt: string;
  completedAt?: string;
  educationalValue?: string;
  safetyCheck?: {
    safe: boolean;
    flagged: boolean;
    reason?: string;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useStoryHistory() {
  const { accessToken, isLoading: authLoading } = useAuth();
  const { selectedChild, loadingSelectedChild } = useSelectedChild();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    if (authLoading || loadingSelectedChild) return;

    if (!accessToken || !selectedChild?._id) {
      setLoading(false);
      setStories([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/stories/history/${selectedChild._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data?.success) {
        setStories(data?.data?.stories || []);
      } else {
        setStories([]);
      }
    } catch (err) {
      console.error("Failed to fetch stories:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, authLoading, selectedChild?._id, loadingSelectedChild]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return { stories, loading, refetch: fetchStories };
}