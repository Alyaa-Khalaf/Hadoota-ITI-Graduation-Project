"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AchievementCardProps {
  title: string;
  icon: string;
  description: string;
  unlocked?: boolean;
  index?: number;
}

export default function AchievementCard({
  title,
  icon,
  description,
  unlocked = false,
  index = 0,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card
        className={`text-center transition-all ${
          unlocked
            ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-2 border-amber-300 dark:border-amber-700 shadow-md hover:shadow-lg"
            : "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-600 opacity-70"
        }`}
      >
        <CardContent className="pt-6 pb-6">
          <div className="text-5xl mb-4">{icon}</div>

          <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>

          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          <Badge
            variant={unlocked ? "default" : "secondary"}
            className="text-xs font-semibold"
          >
            {unlocked ? "✨ مفتوح" : "🔒 مغلق"}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}