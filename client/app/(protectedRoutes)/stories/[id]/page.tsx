"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/lib/apiConfig";
import { mapScenesWithAuthMedia, type MappedStoryScene } from "@/services/mediaService";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import HomeButton from "@/components/ui/HomeButton";
import PreviousButton from "@/components/ui/PreviousButton";

export default function StoryReaderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, isLoading } = useAuth();

  const [scenes, setScenes] = useState<MappedStoryScene[] | null>(null);
  const [title, setTitle] = useState<string>("");
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

  if (loading) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-6"
        dir="rtl"
      >
        <motion.div
          animate={{ rotateY: [0, 180, 360] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl"
        >
          📖
        </motion.div>

        <p className="text-lg font-bold text-ink">
          بنفتح صفحات الحدوتة...
        </p>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-primary"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !scenes) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center"
        dir="rtl"
      >
        <div
          className="
            flex flex-col items-center gap-3
            rounded-3xl p-8 max-w-sm
            bg-cat-adventure
            border-[3px] border-dashed border-primary/40
          "
        >
          <span className="text-5xl">📕</span>
          <h3 className="font-bold text-lg text-ink">
            الصفحة دي ضاعت منّا شوية
          </h3>
          <p className="text-sm text-ink-mute">
            {error || "تعذّر تحميل الحدوتة"}
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/childAdventure")}
            className="
              mt-2 px-6 py-2.5
              rounded-2xl
              bg-primary text-white font-bold
              border-2 border-white
              shadow-md
            "
          >
            الرجوع للمغامرة 🏡
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeButton href="/childAdventure" />
      <StoryPlayer scenes={scenes} title={title} />
      <PreviousButton/>
    </>
  );
}