"use client";

import { useAuth } from "@/context/AuthContext";
import { useSelectedChild } from "@/context/childContext";


export function useReward() {
  const { accessToken } = useAuth();
  const { selectedChild } = useSelectedChild();

  const addReward = async (amount: number, reason: string) => {
    if (!selectedChild?._id || !accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gamification/reward`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            childId: selectedChild._id,
            type: "star",
            amount,
            reason,
          }),
        }
      );

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  return { addReward };
}