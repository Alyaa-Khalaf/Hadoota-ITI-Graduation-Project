"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { MappedStoryScene } from "@/services/mediaService";

const splitWords = (text: string) => text.trim().split(/\s+/).filter(Boolean);

const FALLBACK_MS_PER_WORD = 400;

const playAudioElement = (audio: HTMLAudioElement): Promise<void> => {
  audio.currentTime = 0;

  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return audio.play();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", onError);
    };

    const onReady = () => {
      cleanup();
      audio.play().then(resolve).catch(reject);
    };

    const onError = () => {
      cleanup();
      reject(new Error("Audio failed to load"));
    };

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("error", onError);
    audio.load();
  });
};

export default function StoryPlayer({
  scenes,
  title,
}: {
  scenes: MappedStoryScene[];
  title?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(true);
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  const [playbackError, setPlaybackError] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const hasUserStartedRef = useRef(false);
  const skipNextAutoPlayRef = useRef(false);
  const completeSceneRef = useRef<() => void>(() => {});

  const scene = scenes[current];
  const words = useMemo(() => splitWords(scene?.text ?? ""), [scene?.text]);
  const hasAudio = Boolean(scene?.audio);
  const activeChoices = scene?.choices ?? [];

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const completeScene = useCallback(() => {
    if (isPausedRef.current) return;

    const choices = scenes[current]?.choices ?? [];
    if (choices.length > 0) {
      setAwaitingChoice(true);
      return;
    }

    setIsFinished(true);
  }, [current, scenes]);

  completeSceneRef.current = completeScene;

  const handleChoice = useCallback(
    (nextScene: number) => {
      const nextIndex = scenes.findIndex((s) => s.id === nextScene);
      if (nextIndex < 0) return;

      setAwaitingChoice(false);
      setCurrent(nextIndex);
    },
    [scenes]
  );

  const syncWordsFromAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || Number.isNaN(audio.duration)) return;

    const progress = Math.min(1, audio.currentTime / audio.duration);
    const count = Math.max(1, Math.ceil(progress * words.length));
    setVisibleWords(Math.min(count, words.length));
  }, [words.length]);

  const startFallbackTypewriter = useCallback(
    (fromWord = 0) => {
      clearFallbackTimer();
      setVisibleWords(fromWord);

      fallbackTimerRef.current = setInterval(() => {
        setVisibleWords((prev) => {
          if (prev >= words.length) {
            clearFallbackTimer();
            return prev;
          }

          const next = prev + 1;
          if (next >= words.length) {
            clearFallbackTimer();
            setTimeout(() => {
              if (isPausedRef.current) return;
              completeSceneRef.current();
            }, 300);
          }
          return next;
        });
      }, FALLBACK_MS_PER_WORD);
    },
    [clearFallbackTimer, words.length]
  );

  const playScene = useCallback(async () => {
    setAwaitingChoice(false);
    setPlaybackError("");
    setVisibleWords(0);
    clearFallbackTimer();

    const audio = audioRef.current;

    if (audio && scene?.audio) {
      try {
        await playAudioElement(audio);
        return;
      } catch (err) {
        const message = err instanceof Error ? err.message : "تعذر تشغيل الصوت";
        const blocked =
          err instanceof DOMException &&
          (err.name === "NotAllowedError" || err.name === "AbortError");

        if (blocked) {
          setNeedsTapToPlay(true);
          setPlaybackError("اضغطي على الزر لتشغيل الصوت");
          return;
        }

        console.warn("Audio playback failed:", err);
        setPlaybackError(message);
        startFallbackTypewriter();
      }
    } else {
      startFallbackTypewriter();
    }
  }, [clearFallbackTimer, scene?.audio, startFallbackTypewriter]);

  const handleStartListening = useCallback(() => {
    hasUserStartedRef.current = true;
    skipNextAutoPlayRef.current = true;
    setNeedsTapToPlay(false);
    setIsPaused(false);
    void playScene();
  }, [playScene]);

  const replayScene = useCallback(() => {
    setIsPaused(false);
    setAwaitingChoice(false);
    setNeedsTapToPlay(false);
    hasUserStartedRef.current = true;
    void playScene();
  }, [playScene]);

  const togglePause = useCallback(() => {
    const audio = audioRef.current;

    if (isPaused) {
      setIsPaused(false);
      if (audio && scene?.audio) {
        void audio.play();
      } else if (visibleWords < words.length) {
        startFallbackTypewriter(visibleWords);
      }
    } else {
      setIsPaused(true);
      audio?.pause();
      clearFallbackTimer();
    }
  }, [
    clearFallbackTimer,
    isPaused,
    scene?.audio,
    startFallbackTypewriter,
    visibleWords,
    words.length,
  ]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (isFinished || needsTapToPlay) return;

    if (skipNextAutoPlayRef.current) {
      skipNextAutoPlayRef.current = false;
      return;
    }

    setIsPaused(false);
    void playScene();

    return () => {
      clearFallbackTimer();
      audioRef.current?.pause();
    };
  }, [current, isFinished, needsTapToPlay, playScene, clearFallbackTimer]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !scene?.audio) return;

    const handleTimeUpdate = () => syncWordsFromAudio();

    const handleEnded = () => {
      setVisibleWords(words.length);
      completeSceneRef.current();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [scene?.audio, syncWordsFromAudio, words.length, current]);

  const audioElement = scene?.audio ? (
    <audio
      key={`${current}-${scene.audio}`}
      ref={audioRef}
      src={scene.audio}
      preload="auto"
      playsInline
      className="hidden"
    />
  ) : null;

  if (isFinished) {
    return (
      <>
        {audioElement}
        <div dir="rtl" className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-purple-100 p-8 text-center"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-purple-700 mb-2">انتهت الحدوتة!</h2>
          {title && <p className="text-gray-600 mb-6">{title}</p>}
          <Link
            href="/childAdventure"
            className="inline-block bg-purple-600 text-white font-bold px-8 py-3 rounded-2xl shadow-[0_4px_0_#5b21b6] hover:brightness-110 transition"
          >
            ارجع للمغامرة
          </Link>
        </motion.div>
        </div>
      </>
    );
  }

  if (needsTapToPlay) {
    return (
      <>
        {audioElement}
        <div dir="rtl" className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-purple-100 p-8 text-center"
        >
          <div className="text-5xl mb-4">🎧</div>
          {title && (
            <h1 className="text-xl font-black text-purple-700 mb-2">{title}</h1>
          )}
          <p className="text-gray-600 mb-6">
            {hasAudio
              ? "الحدوتة جاهزة! اضغطي لتسمعي القصة مع الصوت"
              : "الحدوتة جاهزة! اضغطي للبدء (الصوت غير متاح — سيتم عرض النص فقط)"}
          </p>
          <button
            type="button"
            onClick={handleStartListening}
            className="bg-yellow-300 text-purple-900 font-bold px-8 py-4 rounded-2xl shadow-[0_4px_0_#ca8a04] hover:brightness-105 active:translate-y-0.5 transition text-lg"
          >
            ▶️ استمعي للحدوتة
          </button>
          {playbackError && (
            <p className="text-red-500 text-sm mt-4">{playbackError}</p>
          )}
        </motion.div>
        </div>
      </>
    );
  }

  const displayedText = words.slice(0, visibleWords).join(" ");
  const showChoices = awaitingChoice && activeChoices.length > 0;

  return (
    <>
      {audioElement}
      <div dir="rtl" className="max-w-3xl mx-auto p-4 sm:p-6">
      {title && (
        <h1 className="text-2xl sm:text-3xl font-black text-purple-700 text-center mb-6">
          {title}
        </h1>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="w-full bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
            <motion.img
              key={scene.image}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={scene.image}
              alt=""
              className="w-full max-h-[min(70vh,32rem)] object-contain"
            />
          </div>

          <div className="p-5 sm:p-6 min-h-[120px]">
            <p className="text-lg sm:text-xl leading-relaxed text-gray-800 text-right">
              {showChoices ? scene.text : displayedText}
              {!showChoices && visibleWords < words.length && (
                <span className="inline-block w-0.5 h-5 bg-purple-500 mr-1 animate-pulse align-middle" />
              )}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {showChoices && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          <p className="text-center font-black text-purple-700 text-lg">
            ماذا تختار؟ 🤔
          </p>
          {activeChoices.map((choice, index) => (
            <button
              key={`${choice.nextScene}-${index}`}
              type="button"
              onClick={() => handleChoice(choice.nextScene)}
              className="w-full bg-gradient-to-l from-purple-500 to-purple-600 text-white font-bold px-6 py-4 rounded-2xl shadow-[0_4px_0_#5b21b6] hover:brightness-110 active:translate-y-0.5 transition text-right"
            >
              {choice.text}
            </button>
          ))}
        </motion.div>
      )}

      {!showChoices && (
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={togglePause}
          className="bg-yellow-300 text-purple-900 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_#ca8a04] active:translate-y-0.5 transition"
        >
          {isPaused ? "▶️ كمّل" : "⏸️ وقف"}
        </button>

        <button
          type="button"
          onClick={replayScene}
          className="bg-purple-100 text-purple-800 font-bold px-6 py-3 rounded-2xl border border-purple-200 active:scale-95 transition"
        >
          🔁 من الأول
        </button>
      </div>
      )}

      {playbackError && (
        <p className="text-center text-red-500 text-sm mt-3">{playbackError}</p>
      )}

      <p className="text-center text-sm text-gray-400 mt-4">
        المشهد {current + 1} من {scenes.length}
      </p>
      </div>
    </>
  );
}
