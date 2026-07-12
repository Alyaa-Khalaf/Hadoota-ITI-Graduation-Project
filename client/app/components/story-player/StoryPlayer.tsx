"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { MappedStoryScene } from "@/services/mediaService";
import { useAuth } from "@/context/AuthContext";
import { endScreenTime } from "@/lib/api/screenTime";

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
  childId,
}: {
  scenes: MappedStoryScene[];
  title?: string;
  childId?: string;
}) {
  const { accessToken } = useAuth();
  const sessionEndedRef = useRef(false);

  const endSession = useCallback(() => {
    if (sessionEndedRef.current) return;
    if (!childId || !accessToken) return;

    sessionEndedRef.current = true;
    endScreenTime(childId, accessToken).catch((err) =>
      console.error("Failed to end screen time:", err)
    );
  }, [childId, accessToken]);

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

  // تسجيل نهاية جلسة الاستخدام لما الحدوتة تخلص طبيعي
  useEffect(() => {
    if (isFinished) {
      endSession();
    }
  }, [isFinished, endSession]);

  // تسجيل نهاية الجلسة لو الطفل قفل/غادر الصفحة قبل ما يخلص الحدوتة
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

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

  // -------------------- شاشة النهاية --------------------
  if (isFinished) {
    return (
      <>
        {audioElement}
        <div
          dir="rtl"
          className="min-h-[70vh] flex items-center justify-center p-6 bg-gradient-to-b from-page-dreamy via-page-sky to-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 16 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-story border-[3px] border-primary-light p-8 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-black text-primary mb-2">
              انتهت الحدوتة!
            </h2>
            {title && <p className="text-ink-muted mb-6">{title}</p>}
            <Link
              href="/childAdventure"
              className="inline-block bg-primary text-white font-bold px-8 py-3.5 rounded-2xl shadow-button hover:brightness-110 active:scale-95 transition"
            >
              ارجع للمغامرة 🏡
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  // -------------------- شاشة "اضغطي للبدء" --------------------
  if (needsTapToPlay) {
   return (
  <>
    {audioElement}
    {/* خلفية بتأثير Dreamy Gradient */}
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gradient-to-br from-[#E0F2FE] via-[#EDE9FE] to-[#FCE7F3]">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-10 text-center border border-white/50"
      >
        {/* أيقونة تفاعلية */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl mb-6"
        >
          🎧
        </motion.div>

        {title && (
          <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">
            {title}
          </h1>
        )}

        <p className="text-muted-foreground mb-8 leading-relaxed font-medium">
          {hasAudio
            ? "الحدوتة جاهزة! اضغطي لتسمعي القصة مع الصوت 🎙️"
            : "الحدوتة جاهزة! اضغطي للبدء (الصوت غير متاح — سيتم عرض النص فقط)"}
        </p>

        {/* زر عصري بـ Gradient */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleStartListening}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-black px-8 py-5 rounded-[2rem] shadow-xl shadow-primary/20 transition-all text-lg hover:shadow-2xl"
        >
          ▶️ استمعي للحدوتة
        </motion.button>

        {playbackError && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-destructive text-sm mt-6 font-bold bg-destructive/10 py-2 px-4 rounded-full"
          >
            {playbackError}
          </motion.p>
        )}
      </motion.div>
    </div>
  </>
);
  }

  const displayedText = words.slice(0, visibleWords).join(" ");
  const showChoices = awaitingChoice && activeChoices.length > 0;

  // -------------------- شاشة القراءة --------------------
  return (
    <>
      {audioElement}
      <div
        dir="rtl"
        className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-b from-page-dreamy via-page-sky to-white"
      >
        {title && (
          <h1 className="text-2xl sm:text-3xl font-black text-primary text-center mb-5">
            {title}
          </h1>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5" dir="ltr">
          {scenes.map((_, index) => (
            <span
              key={index}
              className={`
                h-2 rounded-full transition-all
                ${index === current ? "w-6 bg-primary" : "w-2 bg-primary-light"}
              `}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-story border border-border-warm overflow-hidden"
          >
            <div className="relative w-full h-[55vh] sm:h-[60vh] min-h-[320px] max-h-[560px]">
              <motion.img
                key={scene.image}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={scene.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* تدرّج غامق تحت النص عشان يبان واضح فوق أي خلفية */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-lg sm:text-xl leading-relaxed text-white text-right drop-shadow-md">
                  {showChoices ? scene.text : displayedText}
                  {!showChoices && visibleWords < words.length && (
                    <span className="inline-block w-0.5 h-5 bg-white mr-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {showChoices && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3"
          >
            <p className="text-center font-black text-primary text-lg mb-1">
              ماذا تختار؟ 🤔
            </p>
            {activeChoices.map((choice, index) => (
              <motion.button
                key={`${choice.nextScene}-${index}`}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleChoice(choice.nextScene)}
                className="w-full bg-primary text-white font-bold px-6 py-4 rounded-2xl shadow-button hover:brightness-110 transition text-right"
              >
                {choice.text}
              </motion.button>
            ))}
          </motion.div>
        )}

        {!showChoices && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={togglePause}
              className="bg-sunny text-ink font-bold px-6 py-3 rounded-2xl shadow-button border-2 border-white transition"
            >
              {isPaused ? "▶️ كمّل" : "⏸️ وقف"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={replayScene}
              className="bg-white text-primary font-bold px-6 py-3 rounded-2xl border-2 border-primary-light transition"
            >
              🔁 من الأول
            </motion.button>
          </div>
        )}

        {playbackError && (
          <p className="text-center text-rose text-sm mt-3 font-bold">
            {playbackError}
          </p>
        )}

        <p className="text-center text-sm text-ink-muted mt-4">
          المشهد {current + 1} من {scenes.length}
        </p>
      </div>
    </>
  );
}