"use client";

import AchievementCard from "./AchievementCard";
import AdventureHeader from "./AdventureHeader";

interface Achievement {
  id: number;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export default function Achievements() {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "مستكشف محترف",
      icon: "🏆",
      description: "أنهيت 5 حواديت كاملة",
      unlocked: true,
    },
    {
      id: 2,
      title: "محب النجوم",
      icon: "⭐",
      description: "جمعت 20 نجمة",
      unlocked: true,
    },
    {
      id: 3,
      title: "كاتب صغير",
      icon: "✍️",
      description: "أنشأت أول قصة بنفسك",
      unlocked: false,
    },
    {
      id: 4,
      title: "بطل الفضول",
      icon: "🧠",
      description: "أجبت على 10 أسئلة",
      unlocked: false,
    },
  ];

  return (
    <section className="mt-8">
      <AdventureHeader
        header="الإنجازات"
        subHeader="كل خطوة بتقربك من البطولة 🏆"
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            {...achievement}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}