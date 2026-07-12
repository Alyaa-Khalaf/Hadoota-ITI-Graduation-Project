"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Rocket, Star } from "lucide-react";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import { useStorySocket } from "@/hooks/useStorySocket";
import { useStoryInput } from "@/hooks/useStoryInput";
import { useAuth } from "@/context/AuthContext";
import { startScreenTime } from "@/lib/api/screenTime";
import { Button } from "@/components/ui/Button";


export default function StoriesPage() {
  const { childId, character, topic } = useStoryInput();
  const { accessToken } = useAuth();
  const { generateStory, isGenerating, scenes, storyTitle, error } = useStorySocket();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    if (!childId || !character || !topic) return;
    setStarted(true);
    if (accessToken) {
      startScreenTime(childId, accessToken).catch((err) => console.error(err));
    }
    await generateStory(childId, character, topic);
  };

  const canStart = Boolean(childId && character && topic);

  // واجهة البداية - بدون أي كارد، المحتوى على الخلفية مباشرة
  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl -z-10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl -z-10" />
        {/* <FloatingDecor /> */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-full max-w-lg relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl sm:text-8xl mb-6"
          >
            📖✨
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            مستعد للمغامرة؟
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            اضغط للبدء وسيبدأ الراوي في حكاية جديدة مليئة بالمفاجآت.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-accent">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>

          {!canStart && (
            <div className="mt-6 p-4 rounded-2xl bg-destructive/10 text-destructive font-bold text-sm">
              ⚠️ يرجى التأكد من اختيار الطفل والشخصية والموضوع أولاً.
            </div>
          )}

          <Button
            onClick={handleStart}
            disabled={!canStart}
            size="lg"
            className="mt-8 w-full py-6 rounded-2xl text-lg font-black shadow-lg hover:scale-[1.03] active:scale-95 transition-transform"
          >
            <Rocket className="ml-2 h-5 w-5" />
            ابدأ الحدوتة
          </Button>

          {error && (
            <p className="mt-4 text-destructive font-bold text-sm">{error}</p>
          )}
        </motion.div>
      </div>
    );
  }

  // واجهة التحميل - بدون أي كارد
  if (isGenerating || !scenes) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        </div>
        {/* <FloatingDecor /> */}

        <div className="w-full max-w-lg text-center">
          <div className="relative h-24 mb-6 flex items-center justify-center">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              📚
            </motion.div>
            <motion.span
              className="absolute -top-2 right-1/2 translate-x-8 text-2xl"
              animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Wand2 className="h-6 w-6 text-accent" />
            </motion.span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center justify-center gap-2">
            جاري تجهيز الحدوتة
            <Sparkles className="h-6 w-6 text-accent" />
          </h2>
          <p className="mt-2 text-muted-foreground">
            الراوي بيكتب المغامرة كلمة بكلمة...
          </p>

          <div className="mt-8 w-full h-3.5 rounded-full bg-muted overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5 }}
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [-4, 0, -4], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="h-2.5 w-2.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <StoryPlayer scenes={scenes} title={storyTitle} childId={childId} />;
}