"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRecentStories } from "@/hooks/useRecentStories";
import AdventureHeader from "./AdventureHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function RecentStories() {
  const router = useRouter();
  
  const { stories, loading } = useRecentStories();

  if (loading) {
    return (
      <section className="space-y-6  container">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <section className="space-y-6 my-8 container " id="stories">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl border border-dashed bg-primary border-border">
            <CardContent className="pt-14 pb-14 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                لسه معملتش أي حدوتة
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                ابدأ أول مغامرة وهنحطهالك هنا عشان ترجعلها في أي وقت
              </p>
              <Button
                onClick={() => router.push("/characters")}
                size="lg"
                className="gap-2 rounded-full px-6"
                variant="ghost"
              >
                <Sparkles className="h-4 w-4" />
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.08 }}
        className="space-y-3"
      >
        {stories.map((story: any, index: number) => {
          const progress = story.progress ?? 0;
          const isCompleted = progress >= 100;

          return (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Card
                onClick={() => router.push(`/stories/${story._id}`)}
                className="group rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-4" dir="rtl">
                    {/* أيقونة القصة */}
                    <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      {isCompleted && (
                        <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>

                    {/* معلومات القصة */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-foreground truncate">
                          {story.title}
                        </h3>
                        {isCompleted && (
                          <Badge
                            variant="secondary"
                            className="rounded-full text-[10px] font-medium shrink-0 hidden sm:inline-flex"
                          >
                            مكتمل
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2.5">
                        {story.topic}
                      </p>

                      {/* شريط التقدم */}
                      <div className="flex items-center gap-2.5">
                        <Progress value={progress} className="h-1.5 flex-1 rounded-full" />
                        <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
                          {progress}%
                        </span>
                      </div>
                    </div>

                    {/* زر الإجراء */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/stories/${story._id}`);
                      }}
                      size="icon"
                      variant="ghost"
                      className="shrink-0 rounded-full h-9 w-9 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                      aria-label="قراءة"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
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