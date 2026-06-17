"use client";
import Achievements from '@/components/ChildAdventure/Achievements';
import ChildNavbar from '@/components/ChildAdventure/ChildNavbar';
import ChildStats from '@/components/ChildAdventure/ChildStats';
// import FloatingDecorations from '@/components/ChildAdventure/FloatingDecorations';
import QuickActions from '@/components/ChildAdventure/QuickActions';
import RecentStories from '@/components/ChildAdventure/RecentStories';
import WelcomeHero from '@/components/ChildAdventure/WelcomeHero'
import { useChild } from '@/hooks/useChild';
// 1. استيراد useAuth
import { useAuth } from '@/context/AuthContext'; 
import React from 'react'

function ChildAdventure() {
  const { child, loading: childLoading } = useChild();
  // 2. سحب حالة تحميل التوكن الأساسية
  const { isLoading: authLoading } = useAuth(); 

  // 3. التعديل السحري: لو الـ Context لسه بيجيب التوكن، أو الـ Hook لسه بيجيب داتا الطفل ⬅️ استنى ومتعرضش الصفحة لسه
  if (authLoading || childLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <div className="text-2xl font-black text-purple-600 animate-pulse">
          جاري تجهيز عالم البطل... 🚀
        </div>
      </div>
    );
  }

  console.log("CHILD DATA IN PAGE:", child);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ChildNavbar />
      {/* <FloatingDecorations /> */}
   
      <div className="relative z-10 p-6">
        {/* دلوقتي الـ child.name مستحيل يضيع لو الطفل مسجل فعلاً */}
        <WelcomeHero name={child?.name || "بطل"} />
        <ChildStats stars={25} stories={8} badge="مستكشف محترف" />
        <QuickActions />
        <RecentStories />
        <Achievements />
      </div>
    </div>
  );
}

export default ChildAdventure;