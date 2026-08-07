"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * يسجّل بداية ونهاية جلسة استخدام الشاشة تلقائيًا لأي صفحة بيدخلها الطفل
 * (المغامرة، قراءة قصة، لعب لعبة... إلخ)
 *
 * الاستخدام: استدعيه في أعلى أي كومبوننت/صفحة عايز تحسب وقتها:
 *   useScreenTimeSession(childId);
 *
 * ملحوظة: لو الطفل بينتقل من صفحة لصفحة (من المغامرة لقصة مثلاً)،
 * كل صفحة هتعمل end لنفسها وبعدين start جديدة للصفحة التانية —
 * الوقت الكلي بيتجمّع في screenTime.today برضه، فمفيش وقت بيضيع.
 */
export function useScreenTimeSession(childId?: string | null) {
  const { accessToken } = useAuth();
  const sessionStartedRef = useRef(false);

  // 🔍 مؤقت للتشخيص — امسحيه بعد ما تتأكدي إن القيم موجودة
  console.log("useScreenTimeSession -> childId:", childId, "| accessToken:", accessToken ? "موجود" : "مش موجود");

  // 📥 بداية الجلسة
  useEffect(() => {
    if (!childId || !accessToken || sessionStartedRef.current) return;

    const startSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/screentime/${childId}/start`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        sessionStartedRef.current = true;

        if (data?.data?.started === false) {
          console.warn("⏰ الطفل خلص وقت الشاشة المسموح، الجلسة مش هتتسجل");
        }
      } catch (err) {
        console.error("Failed to start screen time session:", err);
      }
    };

    startSession();
  }, [childId, accessToken]);

  // 📤 نهاية الجلسة
  useEffect(() => {
    if (!childId || !accessToken) return;

    const endSession = () => {
      if (!sessionStartedRef.current) return;

      fetch(`${API_BASE}/api/screentime/${childId}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        keepalive: true,
      }).catch(() => {});

      sessionStartedRef.current = false;
    };

    window.addEventListener("beforeunload", endSession);

    return () => {
      window.removeEventListener("beforeunload", endSession);
      endSession();
    };
  }, [childId, accessToken]);
}