"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/lib/apiConfig";
import { mapScenesWithAuthMedia, type MappedStoryScene } from "@/services/mediaService";
import StoryPlayer from "@/components/story-player/StoryPlayer";
import HomeButton from "@/components/ui/HomeButton";

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
      <div className="text-center py-16 text-lg font-bold text-ink-muted" dir="rtl">
        ✨ جاري تحميل الحدوتة...
      </div>
    );
  }

  if (error || !scenes) {
    return (
      <div className="text-center py-16 space-y-4" dir="rtl">
        <p className="text-red-500 font-bold">{error || "تعذّر تحميل الحدوتة"}</p>
        <button
          onClick={() => router.push("/childAdventure")}
          className="px-6 py-2.5 rounded-2xl bg-primary text-white font-bold"
        >
          الرجوع للمغامرة
        </button>
      </div>
    );
  }

  return (
    <>
      <HomeButton href="/childAdventure" />
      <StoryPlayer scenes={scenes} title={title} />
    </>
  );
}
