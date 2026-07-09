"use client";
import { useEffect, useRef } from "react";
import Achievements from '@/components/ChildAdventure/Achievements';
import ChildNavbar from '@/components/ChildAdventure/ChildNavbar';
import ChildStats from '@/components/ChildAdventure/ChildStats';
// import FloatingDecorations from '@/components/ChildAdventure/FloatingDecorations';
import QuickActions from '@/components/ChildAdventure/QuickActions';
import RecentStories from '@/components/ChildAdventure/RecentStories';
import WelcomeHero from '@/components/ChildAdventure/WelcomeHero'
import { useSelectedChild } from "@/context/childContext";
// 1. استيراد useAuth
import { useAuth } from '@/context/AuthContext';
import React from 'react'
import PreviousButton from '@/components/ui/PreviousButton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ChildAdventure() {
  const { isLoading: authLoading, accessToken } = useAuth();
  const { user } = useAuth()
  const { selectedChild,loadingSelectedChild } = useSelectedChild();
  console.log(`The parent is ${user?.email}`)

  // بنفضّل child._id (من useChild) وإلا selectedChild._id احتياطًا
  const childId =  selectedChild?._id;

  // عشان نمنع إن الـ start يتنادى أكتر من مرة لنفس الصفحة (مثلاً لو الكومبوننت اتعمله re-render)
  const sessionStartedRef = useRef(false);

  // 📥 بداية جلسة استخدام الشاشة — لما الطفل يفتح الصفحة دي
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

        // لو خلص وقته أصلاً من الأساس، ممكن هنا تحويله لصفحة "خلص وقتك" بدل ما يفضل في الصفحة
        if (data?.data?.started === false) {
          console.warn("⏰ الطفل خلص وقت الشاشة المسموح، الجلسة مش هتتسجل");
          // مثال: router.push('/child/time-up')
        }
      } catch (err) {
        console.error("Failed to start screen time session:", err);
      }
    };

    startSession();
  }, [childId, accessToken]);

  // 📤 نهاية جلسة استخدام الشاشة — لما الطفل يقفل الصفحة أو يخرج منها
  useEffect(() => {
    if (!childId || !accessToken) return;

    const endSession = () => {
      if (!sessionStartedRef.current) return;

      // keepalive: true بيضمن إن الطلب يكمل حتى لو الصفحة قفلت أو المستخدم غيّر الصفحة
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

    // لما الطفل يقفل التاب أو يعمل refresh
    window.addEventListener("beforeunload", endSession);

    // لما الكومبوننت يتشال (الطفل ينتقل لصفحة تانية جوه نفس التطبيق)
    return () => {
      window.removeEventListener("beforeunload", endSession);
      endSession();
    };
  }, [childId, accessToken]);

  if (authLoading || loadingSelectedChild) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <div className="text-2xl font-black text-purple-600 animate-pulse">
          جاري تجهيز عالم البطل... 🚀
        </div>
      </div>
    );
  }

  console.log("CHILD DATA IN PAGE:", selectedChild);

  return (

    <div className="relative min-h-screen overflow-hidden">
       {/* <PreviousButton/> */}
      <ChildNavbar />
      {/* <FloatingDecorations /> */}

      <div className="relative z-10 ">
        {/* دلوقتي الـ child.name مستحيل يضيع لو الطفل مسجل فعلاً */}
        <WelcomeHero name={selectedChild?.name || "بطل"} />

 <ChildStats />

        <QuickActions />
        <RecentStories />
        <Achievements />
      </div>
    </div>
  );
}

export default ChildAdventure;