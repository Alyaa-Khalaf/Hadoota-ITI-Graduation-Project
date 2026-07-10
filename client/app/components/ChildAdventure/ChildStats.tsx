"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Rocket } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { useSelectedChild } from "@/context/childContext";
import AdventureHeader from "./AdventureHeader";

export default function ChildStats() {
  const { selectedChild } = useSelectedChild();
  const { gamification, loading } = useGamification(selectedChild?._id || "");

  if (loading) return <div className="p-8 text-center animate-pulse">جاري التحميل...</div>;
  if (!gamification) return null;

  const { stars, level } = gamification;
  const isPro = stars >= 100;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 container"
    >
      <AdventureHeader header="مغامرتك" subHeader="شوف تقدمك ونجومك ✨" />
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {/* Card 1: Stars */}
        <Card className="rounded-3xl border-border/60 bg-background/60 shadow-sm backdrop-blur-xl">
          <CardContent className="flex flex-col gap-2 p-6">
            <Star className="h-5 w-5 text-primary" />
            <p className="text-3xl font-bold">{stars}</p>
            <p className="text-sm text-muted-foreground">النجوم المجمعة</p>
          </CardContent>
        </Card>

        {/* Card 2: Level */}
        <Card className="rounded-3xl border-border/60 bg-background/60 shadow-sm backdrop-blur-xl">
          <CardContent className="flex flex-col gap-2 p-6">
            <Trophy className="h-5 w-5 text-amber-500" />
            <p className="text-3xl font-bold">{level}</p>
            <p className="text-sm text-muted-foreground">المستوى الحالي</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner */}
      <Card className="rounded-3xl border-border/60 bg-gradient-to-r from-primary/10 to-transparent shadow-sm">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-background shadow-inner text-3xl">
            🚀
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl">{isPro ? "مستكشف محترف" : "مغامر صغير"}</h3>
              <Badge variant="secondary" className="rounded-full">{isPro ? "محترف" : "مبتدئ"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">استمر في القراءة لجمع المزيد من النجوم! ✨</p>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}