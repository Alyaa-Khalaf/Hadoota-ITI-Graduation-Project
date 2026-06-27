"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const games = [
  {
    id: "memory",
    title: "لعبة الذاكرة",
    emoji: "🧠",
    description: "طابق الصور واجمع النجوم",
    color: "bg-[#FAC775]",
    textColor: "text-[#633806]",
    subColor: "text-[#854F0B]",
    href: "/games/GameMemory",
  },
  {
    id: "quiz",
    title: "اختبر نفسك",
    emoji: "❓",
    description: "أسئلة ممتعة للأطفال",
    color: "bg-[#85B7EB]",
    textColor: "text-[#0C447C]",
    subColor: "text-[#185FA5]",
    href: "/games/ChildQuizGame",
  },
  {
    id: "puzzle",
    title: "تركيب الصور",
    emoji: "🧩",
    description: "كوّن الصورة الصحيحة",
    color: "bg-[#97C459]",
    textColor: "text-[#27500A]",
    subColor: "text-[#3B6D11]",
    href: "/games/CollectedImages",
  },
  {
    id: "speed",
    title: "الالوان",
    emoji: "⚡",
    description: "اختار بسرعة واربح نقاط",
    color: "bg-[#AFA9EC]",
    textColor: "text-[#3C3489]",
    subColor: "text-[#534AB7]",
    href: "/games/ColorsGame",
  },
];

function GamesHub() {
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
    {games.map((game) => (
      <Link
        key={game.id}
        href={game.href}
        className={`
          ${game.color}
          h-36
          rounded-[28px]
          shadow-lg
          flex
          flex-col
          items-center
          justify-center
          transition-transform
          hover:scale-105
        `}
      >
        <span className="text-5xl mb-2">
          {game.emoji}
        </span>

        <h3 className="font-black text-lg">
          {game.title}
        </h3>
      </Link>
    ))}
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