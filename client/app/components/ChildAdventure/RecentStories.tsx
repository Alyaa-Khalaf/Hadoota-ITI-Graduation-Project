"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdventureHeader from "./AdventureHeader";
import { useRecentStories } from "@/hooks/useRecentStories";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";

export default function RecentStories() {
  const router = useRouter();
  const { stories, loading } = useRecentStories();

  if (loading) {
    return (
      <section className="space-y-6">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!stories.length) {
    return (
      <section className="space-y-6" id="stories">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-dashed border-blue-300 dark:border-blue-700 text-center">
            <CardContent className="pt-12 pb-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="font-bold text-xl text-foreground mb-2">
                لسه معملتش أي حدوتة
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                ابدأ أول مغامرة وهنحطهالك هنا عشان ترجعلها في أي وقت
              </p>

              <Button
                onClick={() => router.push("/characters")}
                size="lg"
                className="gap-2 rounded-full"
              >
                <span>✨</span>
                ابدأ حدوتة جديدة
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-4"
      >
        {stories.map((story: any, index: number) => {
          const progress = story.progress ?? 100;
          const isCompleted = progress >= 100;

          return (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="hover:shadow-md transition-shadow border-2">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-4" dir="rtl">
                    {/* Story Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl shrink-0">📖</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                            {story.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {story.topic}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 mt-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs text-muted-foreground">
                            التقدم
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button and Badge */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <Button
                        onClick={() => router.push(`/stories/${story._id}`)}
                        size="sm"
                        className="rounded-lg"
                      >
                        قراءة
                      </Button>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          مكتمل ✓
                        </Badge>
                      )}
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