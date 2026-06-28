"use client";

import { useGamification } from "@/hooks/useGamification";
import AchievementCard from "./AchievementCard";
import AdventureHeader from "./AdventureHeader";

type Badge = {
  name: string;
};

export default function Achievements() {
  const childId = "demo-child";
  const { gamification, loading } = useGamification(childId);

  if (loading) {
    return <div className="text-center py-6">⏳ Loading achievements...</div>;
  }

  if (!gamification) {
    return <div className="text-center py-6">لا توجد بيانات</div>;
  }

  const badges: Badge[] = gamification.badges?.map((name) => ({ name })) || [];

  const achievements = badges.map((achievement, index) => ({
    id: index + 1,
    title: achievement.name,
    icon: "🏆",
    description: "تم فتح هذا الإنجاز",
    unlocked: true,
  }));

  return (
    <section className="mt-8">
      <AdventureHeader
        header="الإنجازات"
        subHeader="كل خطوة بتقربك من البطولة 🏆"
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              {...achievement}
              index={index}
            />
          ))
        ) : (
          <div className="col-span-2 text-center text-ink-mute">
            مفيش إنجازات لسه... كمل حواديتك ✨
          </div>
        )}
      </div>
    </section>
  );
}