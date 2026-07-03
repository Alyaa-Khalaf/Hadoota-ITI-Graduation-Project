"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Balloon = {
  id: number;
  x: number;
  y: number;
  icon: string;
};

const icons = ["⭐", "⭐", "⭐", "💣", "❤️"];
const GAME_DURATION = 30;

export default function BalloonGame() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_DURATION);

  // 🔑 كل مرة نعمل ريستارت، نزوّد الرقم ده، عشان الـ effects تتبني من
  // جديد مرة واحدة بس (مش كل ثانية)
  const [resetKey, setResetKey] = useState(0);

  // 🛡️ نتابع بيها هل اللعبة لسه شغالة ولا لأ من غير ما نحط "time"
  // في dependency arrays بتاعة الـ intervals، عشان منعملش recreate
  // للـ interval كل ثانية
  const isPlayingRef = useRef(true);

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

  // Spawn balloons — بيتبني مرة واحدة بس لكل لعبة، وبيوقف نفسه
  // بمجرد ما isPlayingRef تبقى false بدل ما يتقفل ويتفتح كل ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return;

      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * (window.innerWidth - 80),
          y: window.innerHeight,
          icon: icons[Math.floor(Math.random() * icons.length)],
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [resetKey]);

  // Move balloons — نفس الفكرة، بيتبني مرة واحدة بس
  useEffect(() => {
    const move = setInterval(() => {
      if (!isPlayingRef.current) return;

      setBalloons((prev) =>
        prev
          .map((balloon) => ({
            ...balloon,
            y: balloon.y - 5,
          }))
          .filter((balloon) => balloon.y > -100)
      );
    }, 30);

    return () => clearInterval(move);
  }, [resetKey]);

  const popBalloon = (balloon: Balloon) => {
    if (!isPlayingRef.current) return;

    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

    switch (balloon.icon) {
      case "⭐":
        setScore((s) => s + 10);
        break;

      case "❤️":
        setScore((s) => s + 5);
        break;

      case "💣":
        setScore((s) => Math.max(0, s - 10));
        break;
    }
  };

  // 🔄 ريستارت محلي بدل ما نعمل reload لكل الصفحة
  const handleRestart = () => {
    setBalloons([]);
    setScore(0);
    setTime(GAME_DURATION);
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
      from-sky-200
      via-sky-100
      to-white
      "
    >
      {/* Clouds */}
      <div className="absolute top-8 left-8 text-6xl opacity-70">
        ☁️
      </div>

      <div className="absolute top-20 right-10 text-7xl opacity-60">
        ☁️
      </div>

      {/* Header */}
      <div className="absolute top-5 left-5 bg-white rounded-2xl px-5 py-3 shadow-lg font-bold">
        ⭐ {score}
      </div>

      <div className="absolute top-5 right-5 bg-white rounded-2xl px-5 py-3 shadow-lg font-bold">
        ⏳ {time}
      </div>

      {/* Balloons */}
      {balloons.map((balloon) => (
        <button
          key={balloon.id}
          onClick={() => popBalloon(balloon)}
          className="
          absolute
          text-7xl
          hover:scale-110
          active:scale-75
          transition
          select-none
          "
          style={{
            left: balloon.x,
            top: balloon.y,
          }}
        >
          🎈

          <span
            className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-3xl
            pt-1
            "
          >
            {balloon.icon}
          </span>
        </button>
      ))}

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
          <div className="flex justify-center gap-4">
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
              className="px-6 py-3 rounded-full bg-sky text-white font-black hover:brightness-110 active:scale-95 transition-all"
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