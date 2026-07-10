"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={cn(
          "rounded-3xl border  border-border/50 bg-background/50 backdrop-blur-xl shadow-sm transition-all overflow-hidden",
          unlocked 
            ? "border-primary/20 shadow-primary/5" 
            : "grayscale opacity-80"
        )}
      >
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-4 flex justify-center items-center h-16 w-16 mx-auto rounded-2xl bg-muted/50">
            {icon}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          <Badge
            variant={unlocked ? "default" : "secondary"}
            size="md"
            className="rounded-full shadow-none"
          >
            {unlocked ? "✨ مفتوح" : "🔒 مغلق"}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}