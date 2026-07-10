"use client";

import { useGamification } from "@/hooks/useGamification";
import AchievementCard from "./AchievementCard";
import { useSelectedChild } from "@/context/childContext";
import AdventureHeader from "./AdventureHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";

export default function Achievements() {
  const { selectedChild } = useSelectedChild();
  const childId = selectedChild?._id || "demo-child";
  const { gamification, loading } = useGamification(childId);

  if (loading) {
    return (
      <section className="space-y-12 bg-primary/10">
        <AdventureHeader header="الإنجازات" subHeader="كل خطوة بتقربك من البطولة 🏆" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const achievements = gamification?.badges?.map((name: string, index: number) => ({
    id: index + 1,
    title: name,
    icon: "🏆",
    description: "إنجاز رائع ومميز!",
    unlocked: true,
  })) || [];

  return (
    <section className="space-y-12 my-18 container mx-auto">
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
            <AchievementCard key={achievement.id} {...achievement} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-3xl border-dashed border-border/60 bg-background/50 backdrop-blur-md">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">مفيش إنجازات لسه...</h3>
              <p className="text-muted-foreground">
                كمل حواديتك وهتفتح إنجازات جديدة تظهر هنا
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
}