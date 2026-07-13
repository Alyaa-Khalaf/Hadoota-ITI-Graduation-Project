"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRecentStories } from "@/hooks/useRecentStories";
import AdventureHeader from "./AdventureHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronLeft, Sparkles, Star } from "lucide-react";

export default function RecentStories() {
  const router = useRouter();
  const { stories, loading } = useRecentStories();

  if (loading) {
    return (
      <section className="space-y-6 container">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-[var(--radius)] bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <section className="space-y-6 my-8 container" id="stories">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* خلفية كارت الترحيب معدلة لتناسب ألواننا */}
          <Card className="rounded-[var(--radius)] border-none bg-accent/30 shadow-none">
            <CardContent className="pt-14 pb-14 text-center relative">
              <span className="absolute top-4 left-6 text-2xl">✨</span>
              <span className="absolute top-8 right-8 text-xl">⭐</span>

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-primary/10">
                <BookOpen className="h-9 w-9 text-primary" />
              </div>

              <h3 className="font-bold text-2xl text-foreground mb-2">
                لسه معملتش أي حدوتة 🌟
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                ابدأ أول مغامرة وهنحطهالك هنا عشان ترجعلها في أي وقت
              </p>
              <Button
                onClick={() => router.push("/characters")}
                size="lg"
                className="gap-2 rounded-full px-8 h-12 text-base font-bold"
              >
                <Sparkles className="h-5 w-5" />
                ابدأ حدوتة جديدة
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="space-y-6 container my-8">
      <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />

      <motion.div className="space-y-4">
        {stories.map((story: any, index: number) => {
          const progress = story.progress ?? 0;
          const isCompleted = progress >= 100;

          return (
            <motion.div
              key={story._id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                onClick={() => router.push(`/stories/${story._id}`)}
                className="group rounded-[var(--radius)] border border-border/50 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4" dir="rtl">
                    {/* أيقونة القصة بتنسيق ألوان أهدأ */}
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/5">
                      <BookOpen className="h-7 w-7 text-primary" />
                      {isCompleted && (
                        <div className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-foreground truncate">{story.title}</h3>
                        {isCompleted && (
                          <Badge variant="secondary" className="rounded-full text-[10px] font-bold">🎉 خلصت!</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-3">{story.topic}</p>

                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-xs font-bold text-primary tabular-nums">{progress}%</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-muted-foreground group-hover:text-primary">
                      <ChevronLeft className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}