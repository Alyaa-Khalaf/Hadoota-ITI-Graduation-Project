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
    title: "2048 للأطفال",
    emoji: "🍓",
    href: "/games/Kids2048",
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

  return unlocked ? (
    <Link
      key={game.id}
      href={game.href}
      className={`
        ${game.color}
        h-36
        rounded-[28px]
        shadow-lg
        flex flex-col
        items-center
        justify-center
        hover:scale-105
        transition
      `}
    >
      <span className="text-5xl">{game.emoji}</span>

      <h3 className="font-black mt-2">
        {game.title}
      </h3>
    </Link>
  ) : (
    <div
      key={game.id}
      className="
        relative
        h-36
        rounded-[28px]
        bg-gray-200
        flex
        flex-col
        items-center
        justify-center
        opacity-80
      "
    >
      <span className="text-5xl grayscale">
        {game.emoji}
      </span>

      <h3 className="font-black mt-2">
        {game.title}
      </h3>

      <div
        className="
          absolute inset-0
          bg-black/35
          rounded-[28px]
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <div className="text-5xl">
          🔒
        </div>

        <p className="text-white font-bold mt-2">
          تحتاج {game.unlockStars} ⭐
        </p>
      </div>
    </div>
  );
})}
  </div>
</div>

      {/* Stars */}
      <p className="text-center text-2xl mt-8 tracking-widest opacity-40">
        ⭐ ⭐ ⭐ ⭐ ⭐
      </p>
    </div>
  );
}

export default GamesHub;