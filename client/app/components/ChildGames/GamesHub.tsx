"use client";

import { useSelectedChild } from "@/context/childContext";
import { useGamification } from "@/hooks/useGamification";
import Link from "next/link";

const games = [
  {
    id: "memory",
    title: "لعبة الذاكرة",
    emoji: "🧠",
    href: "/games/GameMemory",
    unlockStars: 0,
    color: "bg-[#FAC775]",
  },
  {
    id: "quiz",
    title: "اختبر نفسك",
    emoji: "❓",
    href: "/games/ChildQuizGame",
    unlockStars: 0,
    color: "bg-[#85B7EB]",
  },
  {
    id: "balloons",
    title: "فرقعة البالونات",
    emoji: "🎈",
    href: "/games/BalloonGame",
    unlockStars: 500,
    color: "bg-pink-300",
  },
  {
    id: "coloring",
    title: "التلوين",
    emoji: "🎨",
    href: "/games/ColoringGame",
    unlockStars: 1000,
    color: "bg-yellow-300",
  },
  {
    id: "maze",
    title: "المتاهة",
    emoji: "🧭",
    href: "/games/MazeGame",
    unlockStars: 1500,
    color: "bg-green-300",
  },
  {
    id: "2048",
    title: "اختبار الرياضيات",
    emoji: "🍓",
    href: "/games/MathQuizGame",
    unlockStars: 2000,
    color: "bg-purple-300",
  },
];

function GamesHub() {
  const { selectedChild } = useSelectedChild();
  const { gamification } = useGamification(selectedChild?._id || "");

  const stars = gamification?.stars ?? 0;

  return (
    <div className="min-h-screen px-5 py-8 bg-white" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#D85A30] mb-2">
          🎮 ساحة الألعاب
        </h1>
        <p className="text-base font-bold text-gray-500">
          اختر لعبة وابدأ المغامرة
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-5">
          {games.map((game) => {
            const unlocked = stars >= game.unlockStars;

            const cardContent = (
              <>
                <span className="text-5xl">{game.emoji}</span>

                <h3 className="font-black mt-2">{game.title}</h3>

                {!unlocked && (
                  <p className="text-[11px] font-bold text-ink/60 mt-1">
                    يحتاج {game.unlockStars} ⭐
                  </p>
                )}

                {!unlocked && (
                  <div
                    className="
                    absolute
                    top-2
                    left-2
                    w-8 h-8
                    rounded-full
                    bg-white/90
                    shadow-md
                    flex
                    items-center
                    justify-center
                    text-base
                    "
                  >
                    🔒
                  </div>
                )}
              </>
            );

            const cardClassName = `
              relative
              ${game.color}
              h-36
              rounded-[28px]
              shadow-lg
              flex flex-col
              items-center
              justify-center
              transition
              ${unlocked ? "hover:scale-105" : "active:scale-95"}
            `;

            return unlocked ? (
              <Link key={game.id} href={game.href} className={cardClassName}>
                {cardContent}
              </Link>
            ) : (
              <div key={game.id} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stars */}
      <p className="text-center text-2xl mt-8 tracking-widest opacity-40">
        ⭐ ⭐ ⭐ ⭐ ⭐
      </p>
      <p className="text-center text-xl font-bold">
        {stars} ⭐
      </p>
    </div>
  );
}

export default GamesHub;