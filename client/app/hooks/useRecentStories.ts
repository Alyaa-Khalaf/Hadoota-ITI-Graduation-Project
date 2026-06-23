"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "./useChild";

export function useRecentStories() {
  const { accessToken, isLoading } = useAuth();
  const { child } = useChild();

  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (isLoading || !accessToken || !child?._id) return;

      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stories/history/${child._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setStories(data.data.stories || []);
        }
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [accessToken, isLoading, child?._id]);

  return { stories, loading };
}