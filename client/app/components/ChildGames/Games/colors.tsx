"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReward } from "@/hooks/useReward";

// 🎨 الألوان المتاحة في اللعبة — اسم عربي + قيمة hex فعلية
// (بنستخدم inline style مش كلاسات Tailwind، لأن الألوان بتتولّد
// عشوائيًا وقت التشغيل، وTailwind محتاج يعرف الكلاسات وقت الـ build)
const COLOR_POOL = [
  { name: "أحمر", hex: "#EF4444" },
  { name: "أزرق", hex: "#3B82F6" },
  { name: "أخضر", hex: "#22C55E" },
  { name: "أصفر", hex: "#FACC15" },
  { name: "برتقالي", hex: "#F97316" },
  { name: "بنفسجي", hex: "#A855F7" },
  { name: "وردي", hex: "#EC4899" },
  { name: "سماوي", hex: "#06B6D4" },
];

const GAME_DURATION = 30;
const OPTIONS_COUNT = 4;

// 🔊 نفس فكرة الأصوات المولّدة بالكود من غير ملفات خارجية
function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const playCorrect = () => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  };

  const playWrong = () => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  };

  return { playCorrect, playWrong };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateRound() {
  const options = shuffle(COLOR_POOL).slice(0, OPTIONS_COUNT);
  const target = options[Math.floor(Math.random() * options.length)];
  return { target, options: shuffle(options) };
}

export default function ColorMatchGame() {
  const { addReward } = useReward();
  const [round, setRound] = useState(generateRound);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [rewardSent, setRewardSent] = useState(false);
     const [resetKey, setResetKey] = useState(0);

  const isPlayingRef = useRef(true);
  const { playCorrect, playWrong } = useGameSounds();

  // Timer
  useEffect(() => {
    isPlayingRef.current = true;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          isPlayingRef.current = false;
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetKey]);

  // إرسال النجوم عند نهاية اللعبة
  useEffect(() => {
  if (time === 0 && !rewardSent) {
    addReward(score, "Color Match Game");
    setRewardSent(true);
  }
}, [time, rewardSent, score, addReward]);

  const handleChoice = (hex: string) => {
    if (!isPlayingRef.current) return;

    if (hex === round.target.hex) {
      playCorrect();
      setScore((s) => s + 10);
      setFeedback("correct");
    } else {
      playWrong();
      setScore((s) => Math.max(0, s - 5));
      setFeedback("wrong");
    }

    // نعرض الفيدباك لحظة صغيرة، وبعدين نروح لجولة جديدة
    setTimeout(() => {
      setFeedback(null);
      setRound(generateRound());
    }, 500);
  };


const handleRestart = () => {
  setScore(0);
  setTime(GAME_DURATION);
  setRound(generateRound());
  setFeedback(null);
  setRewardSent(false);
  setResetKey((k) => k + 1);
};

  return (
    <div
      dir="rtl"
      className="
      relative
      overflow-hidden
      w-full
      h-screen
      bg-gradient-to-b
      from-page-dreamy
      via-page-sky
      to-white
      flex
      flex-col
      items-center
      "
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 pt-5">
        <div className="bg-white rounded-2xl px-5 py-3 shadow-lg font-bold text-ink">
          ⭐ {score}
        </div>
        <div className="bg-white rounded-2xl px-5 py-3 shadow-lg font-bold text-ink">
          ⏳ {time}
        </div>
      </div>

      {time > 0 && (
        <>
          {/* السؤال */}
          <div className="mt-10 text-center px-6">
            <p className="text-lg font-bold text-ink-muted mb-2">
              دوس على اللون
            </p>
            <h2 className="text-4xl font-black text-primary">
              {round.target.name}
            </h2>
          </div>

          {/* خيارات الألوان */}
          <div className="grid grid-cols-2 gap-6 mt-12 px-8 w-full max-w-md">
            {round.options.map((option) => (
              <button
                key={option.hex}
                onClick={() => handleChoice(option.hex)}
                className="
                aspect-square
                rounded-full
                shadow-lg
                border-4
                border-white
                hover:scale-105
                active:scale-90
                transition
                "
                style={{ backgroundColor: option.hex }}
                aria-label={option.name}
              />
            ))}
          </div>

          {/* فيدباك بصري بسيط */}
          {feedback && (
            <div
              className={`
              mt-8 text-3xl font-black
              ${feedback === "correct" ? "text-meadow" : "text-rose"}
              `}
            >
              {feedback === "correct" ? "✅ برافو!" : "❌ حاول تاني"}
            </div>
          )}
        </>
      )}

      {/* End Game */}
      {time === 0 && (
        <div
          className="
          absolute
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
          "
        >
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="text-7xl mb-4">🏆</div>

            <h2 className="text-3xl font-black text-primary">
              انتهت اللعبة
            </h2>

            <p className="mt-5 text-xl">
              مجموع نقاطك
            </p>

            <p className="text-5xl font-black text-yellow-500 mt-3">
              {score}
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleRestart}
                className="
                px-8
                py-3
                rounded-2xl
                bg-primary
                text-white
                font-bold
                hover:scale-105
                transition
                "
              >
                إعادة اللعب
              </button>

              <Link
                href="/games/GamesHub"
                className="
                px-6
                py-3
                rounded-full
                bg-sky
                text-white
                font-black
                hover:brightness-110
                active:scale-95
                transition-all
                flex
                items-center
                "
              >
                العودة للألعاب 🎮
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}