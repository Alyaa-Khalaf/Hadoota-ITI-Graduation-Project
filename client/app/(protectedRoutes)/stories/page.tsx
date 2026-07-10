"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import { useStorySocket } from "@/hooks/useStorySocket";
import { useStoryInput } from "@/hooks/useStoryInput";
import { useAuth } from "@/context/AuthContext";
import { startScreenTime } from "@/lib/api/screenTime";
import { Button } from "@/components/ui/button";

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

  // واجهة البداية - Modern Glassmorphism
  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-3xl bg-card/50 backdrop-blur-2xl border border-border p-8 text-center shadow-2xl relative z-10"
        >
          <div className="flex justify-end mb-4">
          </div>

          <div className="text-7xl mb-6">📖✨</div>
          <h1 className="text-4xl font-extrabold text-foreground">مستعد للمغامرة؟</h1>
          <p className="mt-4 text-muted-foreground text-lg">اضغط للبدء وسيبدأ الراوي في حكاية جديدة مليئة بالمفاجآت.</p>

          {!canStart && (
            <div className="mt-6 p-4 rounded-2xl bg-destructive/10 text-destructive font-bold text-sm">
              ⚠️ يرجى التأكد من اختيار الطفل والشخصية والموضوع أولاً.
            </div>
          )}

          <Button
            onClick={handleStart}
            disabled={!canStart}
            size="lg"
            className="mt-8 w-full p-5 rounded-2xl text-lg font-bold shadow-lg hover:scale-105 transition-transform"
          >
            🚀 ابدأ الحدوتة
          </Button>
          {error && <p className="mt-4 text-destructive font-bold">{error}</p>}
        </motion.div>
      </div>
    );
  }

  // واجهة التحميل
  if (isGenerating || !scenes) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="rounded-3xl bg-card border border-border shadow-2xl p-10 text-center w-full max-w-lg">
          <div className="text-7xl animate-bounce mb-6">📚</div>
          <h2 className="text-3xl font-extrabold text-foreground">جاري تجهيز الحدوتة...</h2>
          <div className="mt-8 w-full h-3 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 flex gap-2">
      </div>
      <StoryPlayer scenes={scenes} title={storyTitle} childId={childId} />
    </div>
  );
}