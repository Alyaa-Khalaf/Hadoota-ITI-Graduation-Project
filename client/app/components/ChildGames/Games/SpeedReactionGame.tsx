"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "@/hooks/useChild";

type Phase = "waiting" | "ready" | "clicked" | "tooSoon" | "result";

type Particle = { id: number; x: number; y: number; color: string };

export default function SpeedReactionGame() {
  const { child } = useChild();
  const { accessToken } = useAuth();

  const [phase, setPhase] = useState<Phase>("waiting");
  const [message, setMessage] = useState("اضغط على ابدأ 🚀");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const TOTAL_ROUNDS = 8;

  // كل ما الستريك يزيد، وقت الانتظار قبل الإشارة يقصر = أصعب
  const getDelayRange = (currentStreak: number) => {
    if (currentStreak >= 6) return { min: 400, max: 1000 };
    if (currentStreak >= 3) return { min: 600, max: 1400 };
    return { min: 1000, max: 2200 };
  };

  const getLevelLabel = (currentStreak: number) => {
    if (currentStreak >= 6)
      return { label: "بطل ⚡", color: "text-rose" };

    if (currentStreak >= 3)
      return { label: "محترف 🔥", color: "text-sunny" };

    return { label: "مبتدئ 🌱", color: "text-meadow" };
  };

  const getPoints = (reactionTime: number, currentStreak: number) => {
    let base = 5;
    if (reactionTime < 300) base = 20;
    else if (reactionTime < 500) base = 15;
    else if (reactionTime < 800) base = 10;

    // bonus كل ما الستريك يطول
    const bonus = Math.min(currentStreak * 2, 20);
    return base + bonus;
  };

  // صوت بسيط بدون أصول خارجية، باستخدام Web Audio API
  const playTone = (freq: number, duration: number, type: OscillatorType = "sine") => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // متصفح مش بيدعم الصوت، نتجاهل بهدوء
    }
  };

  const spawnParticles = () => {
    const colors = [
      "#FF7043",
      "#6BCB77",
      "#FFD93D",
      "#C77DFF",
    ];

    const newParticles: Particle[] = Array.from(
      { length: 14 },
      (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 40,
        color: colors[i % colors.length],
      })
    );

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 900);
  };

  const startRound = () => {
    setPhase("waiting");
    setMessage("استعد... 👀");

    const { min, max } = getDelayRange(streakRef.current);
    const delay = Math.random() * (max - min) + min;

    timeoutRef.current = setTimeout(() => {
      setPhase("ready");
      setMessage("اضغط الآن ⚡");
      setStartTime(Date.now());
      playTone(880, 0.1, "square");
    }, delay);
  };

  const handleClick = () => {
    if (phase === "waiting" && round === 0 && score === 0 && streakRef.current === 0) {
      // أول كبسة هي زرار البدء نفسه لو حابب تستخدم الكارت كزرار، اختياري
      return;
    }

    if (phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      streakRef.current = 0;
      setStreak(0);
      setPhase("tooSoon");
      setMessage("بدري! استنى الإشارة ❌");
      setShake(true);
      playTone(180, 0.25, "sawtooth");

      setTimeout(() => {
        setShake(false);
        startRound();
      }, 1000);
      return;
    }

    if (phase === "ready" && startTime) {
      const reactionTime = Date.now() - startTime;
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      const points = getPoints(reactionTime, newStreak - 1);
      const newScore = scoreRef.current + points;
      scoreRef.current = newScore;
      setScore(newScore);

      setPhase("clicked");
      setMessage(`🔥 ممتاز! ${reactionTime}ms (+${points})`);
      setPulse(true);
      playTone(660, 0.12, "sine");

      if (newStreak % 3 === 0) {
        spawnParticles();
        playTone(990, 0.15, "triangle");
      }

      setTimeout(() => {
        setPulse(false);
        if (round + 1 < TOTAL_ROUNDS) {
          setRound((prev) => prev + 1);
          startRound();
        } else {
          setPhase("result");
          setMessage("انتهت اللعبة 🎉");
          spawnParticles();
          sendReward(scoreRef.current);
        }
      }, 1100);
    }
  };

  const sendReward = async (finalScore: number) => {
    try {
      const childId = child?._id;
      if (!childId || !accessToken) return;

      await fetch("http://localhost:5000/api/gamification/reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          childId,
          type: "star",
          amount: finalScore,
          reason: "Speed Reaction Game",
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const restart = () => {
    setRound(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    scoreRef.current = 0;
    streakRef.current = 0;
    setPhase("waiting");
    setMessage("اضغط على ابدأ 🚀");
    setStartTime(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const level = getLevelLabel(streak);

  const getBgColor = () => {
    if (phase === "ready") return "bg-green-400";
    if (phase === "clicked") return "bg-purple-500";
    if (phase === "tooSoon") return "bg-red-400";
    return "bg-sky-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-wash via-white to-primary-wash flex items-center justify-center p-6">      <div className="w-full max-w-3xl text-center">
      <h1 className="text-5xl font-black text-primary mb-6 drop-shadow">
        ⚡ سرعة التفاعل
      </h1>

      <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
        <p className="text-lg font-bold text-gray-700">
          الجولة {round + 1} / {TOTAL_ROUNDS}
        </p>

        <span className="px-3 py-1 rounded-full bg-sunny/20 text-sunny font-black text-sm">
          {level.label}
        </span>

        {streak >= 2 && (
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-black text-sm">
            🔥 ستريك {streak}
          </span>
        )}
      </div>

      <div className="relative">
        <div
          onClick={handleClick}
          className={`
              h-72
              rounded-[40px]
              flex
              items-center
              justify-center
              text-3xl
              font-black
              text-white
              shadow-2xl
              cursor-pointer
              transition-all
              duration-150
              select-none
              bg-cat-magic
              relative
              overflow-hidden
              ${pulse ? "scale-105" : "scale-100"}
              ${shake ? "animate-bounce" : ""}
              ${getBgColor()}
            `}
        >
          {message}

          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full w-2.5 h-2.5 animate-[fadeUpOut_0.9s_ease-out_forwards]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
        <p className="text-2xl font-black text-primary">
          ⭐ النقاط: {score}
        </p>
        {bestStreak > 0 && (
          <p className="text-lg font-bold text-gray-600">
            🏅 أفضل ستريك: {bestStreak}
          </p>
        )}
      </div>

      {phase === "waiting" && round === 0 && score === 0 && streak === 0 && (
        <button
          onClick={startRound}
          className="mt-6 px-10 py-4 bg-meadow text-white font-black text-xl rounded-full shadow-lg hover:brightness-110 active:scale-95 transition"
        >
          ابدأ اللعبة 🚀
        </button>
      )}

      {phase === "result" && (
        <div className="mt-8 bg-primary-wash border border-primary-light p-6 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-black mb-3">🎉 ممتاز!</h2>

          <p className="text-2xl font-black text-primary mb-2">
            ⭐ {score} نقطة
          </p>
          <p className="text-lg font-bold text-gray-600 mb-5">
            🏅 أفضل ستريك: {bestStreak}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={restart}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-black rounded-full active:scale-95 transition-all"
            >
              إعادة اللعب
            </button>

            <Link
              href="/games/GamesHub"
              className="px-6 py-3 bg-sky hover:brightness-110 text-white font-black rounded-full active:scale-95 transition-all"
            >
              العودة 🎮
            </Link>
          </div>
        </div>
      )}
    </div>

      <style jsx>{`
        @keyframes fadeUpOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}