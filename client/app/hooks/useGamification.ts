"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getGamification } from "@/lib/api/gamification";
import { useChild } from "./useChild";

export function useGamification() {
  const { accessToken, isLoading } = useAuth();
  const { child } = useChild();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading || !accessToken || !child?._id) return;

      try {
        setLoading(true);

        const res = await getGamification(child._id, accessToken);
        setData(res);
      } catch (err) {
        console.error("Gamification error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, isLoading, child?._id]);

  return { data, loading };
}