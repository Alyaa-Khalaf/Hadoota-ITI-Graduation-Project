"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "@/hooks/useChild";

type Phase = "waiting" | "ready" | "clicked" | "result";

export default function SpeedReactionGame() {
  const { child } = useChild();
  const { accessToken } = useAuth();

  const [phase, setPhase] = useState<Phase>("waiting");
  const [message, setMessage] = useState("اضغط على ابدأ 🚀");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const [startTime, setStartTime] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);

  const TOTAL_ROUNDS = 5;

  const getPoints = (reactionTime: number) => {
    if (reactionTime < 300) return 20;
    if (reactionTime < 500) return 15;
    if (reactionTime < 800) return 10;
    return 5;
  };

  const startRound = () => {
    setPhase("waiting");
    setMessage("استعد... 👀");

    const delay = Math.random() * 2000 + 1000;

    timeoutRef.current = setTimeout(() => {
      setPhase("ready");
      setMessage("اضغط الآن ⚡");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMessage("استنى الإشارة الأول ❌");
      return;
    }

    if (phase === "ready" && startTime) {
      const reactionTime = Date.now() - startTime;
      const points = getPoints(reactionTime);

      const newScore = scoreRef.current + points;
      scoreRef.current = newScore;
      setScore(newScore);

      setPhase("clicked");
      setMessage(`🔥 ممتاز! ${reactionTime}ms (+${points})`);

      setTimeout(() => {
        if (round + 1 < TOTAL_ROUNDS) {
          setRound((prev) => prev + 1);
          startRound();
        } else {
          setPhase("result");
          setMessage("انتهت اللعبة 🎉");
          sendReward(scoreRef.current);
        }
      }, 1200);
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
    scoreRef.current = 0;
    setPhase("waiting");
    setMessage("اضغط على ابدأ 🚀");
    setStartTime(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl text-center">

        {/* Title */}
        <h1 className="text-5xl font-black text-primary mb-6 drop-shadow">
          ⚡ سرعة التفاعل
        </h1>

        {/* Round */}
        <p className="text-lg font-bold text-gray-700 mb-4">
          الجولة {round + 1} / {TOTAL_ROUNDS}
        </p>

        {/* Game Card */}
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
            select-none
            active:scale-95

            ${
              phase === "ready"
                ? "bg-green-400"
                : phase === "clicked"
                ? "bg-purple-500"
                : "bg-cat-family"
            }
          `}
        >
          {message}
        </div>

        {/* Score */}
        <p className="mt-6 text-2xl font-black text-primary">
          ⭐ النقاط: {score}
        </p>

        {/* Start Button */}
        {phase === "waiting" && round === 0 && (
          <button
            onClick={startRound}
            className="mt-6 px-10 py-4 bg-meadow text-ink font-black text-xl rounded-full shadow-lg active:scale-95 transition"
          >
            ابدأ اللعبة 🚀
          </button>
        )}

        {/* Result */}
        {phase === "result" && (
          <div className="mt-8 bg-white/60 backdrop-blur p-6 rounded-3xl shadow-xl">

            <h2 className="text-3xl font-black mb-3">
              🎉 ممتاز!
            </h2>

            <p className="text-2xl font-black text-purple-700 mb-5">
              ⭐ {score} نقطة
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={restart}
                className="px-6 py-3 bg-primary text-white font-black rounded-full"
              >
                إعادة اللعب
              </button>

              <Link
                href="/games/GamesHub"
                className="px-6 py-3 bg-sky text-white font-black rounded-full"
              >
                العودة 🎮
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}