"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, AlertCircle, Home, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/lib/apiConfig";
import { mapScenesWithAuthMedia, type MappedStoryScene } from "@/services/mediaService";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";
import { Button } from "@/components/ui/Button";

// ديكور خفيف بس ثابت — نجوم وفقاقيع طايرة في الخلفية، بدون تأثير على أي لوجيك
const FLOATING_BITS = [
  { icon: "⭐", top: "8%", left: "6%", size: "text-3xl", delay: 0 },
  { icon: "✨", top: "18%", left: "88%", size: "text-2xl", delay: 0.4 },
  { icon: "🌟", top: "72%", left: "10%", size: "text-3xl", delay: 0.8 },
  { icon: "☁️", top: "60%", left: "90%", size: "text-4xl", delay: 0.2 },
  { icon: "🎈", top: "85%", left: "80%", size: "text-3xl", delay: 0.6 },
  { icon: "✨", top: "40%", left: "4%", size: "text-xl", delay: 1 },
];



export default function StoryReaderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, isLoading } = useAuth();

  const [scenes, setScenes] = useState<MappedStoryScene[] | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/stories/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const result = await res.json();

        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "تعذّر تحميل الحدوتة");
        }

        const story = result.data;
        const rawScenes = Array.isArray(story?.scenes) ? story.scenes : [];

        if (!rawScenes.length) {
          throw new Error("هذه الحدوتة لا تحتوي على مشاهد بعد");
        }

        const mapped = await mapScenesWithAuthMedia(rawScenes, accessToken);

        if (!cancelled) {
          setScenes(mapped);
          setTitle(story.title || "حدوتة");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, accessToken, isLoading]);

  // ---------- LOADING (بدون كارد) ----------
  if (loading) {
    return (
      <div
        dir="rtl"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
        </div>
        {/* <FloatingDecor /> */}

        <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 18 },
              rotate: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
            }}
            className="text-7xl"
          >
            📖
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              بنفتح صفحات الحدوتة...
            </h2>
            <p className="text-base text-muted-foreground">
              استنى ثانية، الحكاية جاية 💫
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ y: 0, opacity: 0.4 }}
                animate={{ y: [-6, 0, -6], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="h-3.5 w-3.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- ERROR (بدون كارد) ----------
  if (error || !scenes) {
    return (
      <div
        dir="rtl"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-destructive/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        </div>

        <AnimatePresence>
          <motion.div
            key="error-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full max-w-md flex flex-col items-center gap-5 text-center"
          >
            <div className="relative">
              <div className="grid h-28 w-28 place-items-center text-7xl">
                📕
              </div>
              <span className="absolute -bottom-1 -left-1 grid h-9 w-9 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-md">
                <AlertCircle className="h-5 w-5" />
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground">
                الصفحة دي ضاعت منّا شوية
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {error || "تعذّر تحميل الحدوتة"}
              </p>
            </div>

            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="rounded-2xl"
              >
                <ArrowRight className="ml-1 h-4 w-4" />
                رجوع
              </Button>
              <Button
                onClick={() => router.push("/childAdventure")}
                className="rounded-2xl font-bold shadow-md"
              >
                <Home className="ml-1 h-4 w-4" />
                الرجوع للمغامرة
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ---------- READY (بدون أي كارد حوالين StoryPlayer) ----------
  return (
    <div dir="rtl" className="relative min-h-screen bg-primary/10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      </div>


      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b-2 border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <PreviousButton />
            <HomeButton />
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h1 className="max-w-[60vw] truncate text-sm font-bold text-foreground sm:text-base">
              {title}
            </h1>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>

          <div className="w-[88px]" />
        </div>
      </header>

      {/* Player - بدون أي صندوق أو حدود حواليه */}
      <StoryPlayer scenes={scenes} title={title} />
    </div>
  );
}