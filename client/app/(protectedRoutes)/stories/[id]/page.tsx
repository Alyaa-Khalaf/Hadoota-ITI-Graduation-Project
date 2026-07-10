"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, AlertCircle, Home, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/lib/apiConfig";
import { mapScenesWithAuthMedia, type MappedStoryScene } from "@/services/mediaService";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div
        dir="rtl"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <Card className="w-full max-w-md border-border/60 bg-card/70 shadow-xl backdrop-blur-xl">
          <CardContent className="flex flex-col items-center gap-6 py-12">
            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
              transition={{
                scale: { type: "spring", stiffness: 260, damping: 18 },
                rotate: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
              }}
              className="grid h-24 w-24 place-items-center rounded-3xl bg-primary/10 text-6xl shadow-inner"
            >
              📖
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground">
                بنفتح صفحات الحدوتة...
              </h2>
              <p className="text-sm text-muted-foreground">
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
                  className="h-3 w-3 rounded-full bg-primary"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- ERROR ----------
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
            key="error-card"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full max-w-md"
          >
            <Card className="border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
              <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
                <div className="relative">
                  <div className="grid h-24 w-24 place-items-center rounded-3xl bg-destructive/10 text-6xl">
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
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ---------- READY ----------
  return (
    <div dir="rtl" className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <PreviousButton />
            <HomeButton />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 shadow-sm backdrop-blur"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            <h1 className="max-w-[60vw] truncate text-sm font-bold text-foreground sm:text-base">
              {title}
            </h1>
          </motion.div>

          <div className="w-[88px]" />
        </div>
      </header>

      {/* Player */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl backdrop-blur-xl"
        >
          <StoryPlayer scenes={scenes} title={title} />
        </motion.div>
      </main>
    </div>
  );
}
