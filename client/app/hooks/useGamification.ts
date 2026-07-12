"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

type RewardHistoryItem = {
  type: string;
  amount: number;
  badgeName: string;
  reason: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

type GamificationData = {
  childId: string;
  stars: number;
  level: number;
  badges: string[];
  rewardHistory: RewardHistoryItem[];
  totalRewards: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useGamification(childId: string) {
  const { accessToken, isLoading: authLoading } = useAuth();

  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGamification = useCallback(async () => {
    if (authLoading) return;

    if (!childId || !accessToken) {
      setLoading(false);
      setGamification(null);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/gamification/${childId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
console.log("Response:", data);
console.log("Status:", res.status);
console.log("Gamification Data:", data.data);
      if (res.ok && data?.success) {
        setGamification(data.data);
      } else {
        setGamification(null);
      }
    } catch (err) {
      console.error("Gamification fetch error:", err);
      setGamification(null);
    } finally {
      setLoading(false);
    }
  }, [childId, accessToken, authLoading]);
console.log("Fetching gamification for:", childId);
console.log("Access Token:", accessToken);
  useEffect(() => {
    fetchGamification();
  }, [fetchGamification]);

  return { gamification, loading, refetch: fetchGamification };
}