"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface StoryCardProps {
  id: number | string;
  title: string;
  emoji: string;
  date?: string;
  progress?: number;
  onClickType?: "open" | "continue";
}

export default function StoryCard({
  id,
  title,
  emoji,
  date,
  progress = 0,
  onClickType = "open",
}: StoryCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="hover:shadow-md transition-shadow border-2">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between gap-4" dir="rtl">
            {/* Story Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-3xl sm:text-4xl shrink-0">{emoji}</span>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                  {title}
                </h3>

                {date && (
                  <p className="text-xs text-muted-foreground mt-1">{date}</p>
                )}

                {/* Progress bar */}
                {progress > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        التقدم
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => router.push(`/stories/${id}`)}
              size="sm"
              className="shrink-0 rounded-lg"
            >
              {onClickType === "continue" ? "تكملة" : "فتح"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}