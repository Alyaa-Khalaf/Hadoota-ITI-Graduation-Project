"use client";

import { useGamification } from "@/hooks/useGamification";
import AchievementCard from "./AchievementCard";
import { useSelectedChild } from "@/context/childContext";
import AdventureHeader from "./AdventureHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";

type Badge = {
  name: string;
};

export default function Achievements() {
  const { selectedChild } = useSelectedChild();
  const childId = selectedChild?._id || "demo-child";
  const { gamification, loading } = useGamification(childId);

  if (loading) {
    return (
      <section className="space-y-6">
        <AdventureHeader
          header="الإنجازات"
          subHeader="كل خطوة بتقربك من البطولة 🏆"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!gamification) {
    return (
      <section className="space-y-6">
        <AdventureHeader
          header="الإنجازات"
          subHeader="كل خطوة بتقربك من البطولة 🏆"
        />
        <Card className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </CardContent>
        </Card>
      </section>
    );
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
    <section className="space-y-6">
      <AdventureHeader
        header="الإنجازات"
        subHeader="كل خطوة بتقربك من البطولة 🏆"
      />

      {achievements.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              {...achievement}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <p className="text-lg font-semibold text-foreground mb-2">
                مفيش إنجازات لسه...
              </p>
              <p className="text-muted-foreground">
                كمل حواديتك وهتفتح إنجازات جديدة ✨
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
}