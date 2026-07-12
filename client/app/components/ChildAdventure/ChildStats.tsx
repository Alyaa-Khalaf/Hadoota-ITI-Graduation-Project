"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Star, Trophy } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { useSelectedChild } from "@/context/childContext";
import AdventureHeader from "./AdventureHeader";

export default function ChildStats() {
  const { selectedChild } = useSelectedChild();
  const { gamification, loading } = useGamification(selectedChild?._id || "");

  if (loading) {
    return <div className="p-8 text-center animate-pulse">⏳ جاري تحميل الإنجازات...</div>;
  }

  if (!gamification) {
    return <div className="p-8 text-center">لا توجد بيانات حالياً</div>;
  }

  const { stars, level } = gamification;

  // منطق تحديد الشارة
  const isPro = stars >= 100;
  const badgeTitle = isPro ? "مستكشف محترف 🚀" : "مغامر صغير ✨";
  const badgeLevel = isPro ? "محترف" : "مبتدئ";

  const items = [
    { label: "النجوم المجمعة", value: stars, icon: Star, color: "text-primary" },
    { label: "المستوى الحالي", value: level, icon: Trophy, color: "text-amber-500" },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 container bg-pr"
      dir="rtl"
    >
      <AdventureHeader header="إنجازاتك" subHeader="شوف اللي حققته ⭐" />
      
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {items.map((item, index) => (
          <Card key={index} className="rounded-3xl border-border/60 bg-background/60 shadow-sm backdrop-blur-xl">
            <CardContent className="flex flex-col gap-2 p-6">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Banner */}
      <Card className="rounded-3xl border-border/60 bg-gradient-to-r from-primary/10 to-transparent shadow-sm">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-background shadow-inner text-3xl">
            {isPro ? "🚀" : "✨"}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl">{badgeTitle}</h3>
              <Badge variant="secondary" className="rounded-full">{badgeLevel}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPro ? "أنت بطل حقيقي في القراءة!" : "استمر في القراءة لجمع المزيد من النجوم!"}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}