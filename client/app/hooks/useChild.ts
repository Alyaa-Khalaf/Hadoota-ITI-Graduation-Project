"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; 

type Child = {
  _id: string;
  name: string;
  age: number;
  avatar: string;
};

export function useChild() {
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. نسحب الـ isLoading بتاعة الأوث نفسه عشان نعرف هو لسه بيحمل ولا خلص
  const { accessToken, isLoading: authLoading } = useAuth(); 

  useEffect(() => {
    const fetchChild = async () => {
      // ⚠️ 2. الحماية الكبرى: لو الـ Context لسه بيقرا الكوكي وبيحمل التوكن، اخرج فوراً وسيب الـ loading بـ true
      if (authLoading) {
        return; 
      }

      // 3. لو الـ Context خلص تحميل تماماً ومالقاش توكن (يعني مش مسجل دخول)، هنا بس نقفل اللودنج ونخرج
      if (!accessToken) {
        setLoading(false);
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
        console.log("CHILD RESPONSE IN HOOK:", result);

        if (result?.data?.length > 0) {
          setChild(result.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch child:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChild(); 

    // ⚠️ 4. لازم نراقب الـ authLoading والـ accessToken سوا عشان لما الـ context يخلص، الـ hook يلقطه فوراً
  }, [accessToken, authLoading]); 

  return { child, loading };
}