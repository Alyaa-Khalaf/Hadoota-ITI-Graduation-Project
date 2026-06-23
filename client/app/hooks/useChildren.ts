"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Child = {
  _id: string;
  name: string;
  age: number;
  gender: number;
  avatar: string;
};

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const { accessToken, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchChildren = async () => {
      // لو الأوث لسه بيحمل → استنى
      if (authLoading) return;

      // لو مفيش توكن → اقفل اللودينج
      if (!accessToken) {
        setLoading(false);
        setChildren([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/children`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await res.json();

        if (result?.success && Array.isArray(result.data)) {
          setChildren(result.data);
        } else {
          setChildren([]);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [accessToken, authLoading]);

  return {
    children,
    loading,
  };
}