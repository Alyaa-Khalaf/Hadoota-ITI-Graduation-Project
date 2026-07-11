"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSelectedChild } from "@/context/childContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Card = {
  id: number;
  image: string;
};

const IMAGES = [
  "/GamesImages/lion.avif",
  "/GamesImages/Panda.jpg",
  "/GamesImages/rabit.jpg",
  "/GamesImages/rapunzel.jpg",
  "/GamesImages/turtle.webp",
  "/GamesImages/cat.avif",
];

export default function MemoryGame() {
  const { selectedChild } = useSelectedChild();
  const { accessToken } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [rewardSent, setRewardSent] = useState(false);

  const createGame = () => {
    const duplicated = [...IMAGES, ...IMAGES];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setRewardSent(false);
  };

  useEffect(() => { createGame(); }, []);

  const handleFlip = (index: number) => {
    if (disabled || flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setDisabled(true);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.image === secondCard.image) {
        setScore((prev) => prev + 10);
        setMatched((prev) => [...prev, ...newFlipped]);
        setTimeout(() => { setFlipped([]); setDisabled(false); }, 600);
      } else {
        setTimeout(() => { setFlipped([]); setDisabled(false); }, 1000);
      }
    }
  };

  const isWinner = cards.length > 0 && matched.length === cards.length;

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-primary mb-4">لعبة الذاكرة 🧠</h1>
        <div className="flex justify-center gap-8 font-bold text-lg">
          <span className="text-muted-foreground">عدد المحاولات: {moves}</span>
          <span className="text-primary">⭐ النقاط: {score}</span>
        </div>
      </div>

      {/* Grid - تم تكبير الفراغات وتعديل العرض ليكون أكثر تناسقاً */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(index)}
              className={`w-full h-[180px] rounded-[32px] shadow-xl flex items-center justify-center overflow-hidden transition-all border-4 ${
                isFlipped ? "bg-white border-white" : "bg-primary border-primary"
              }`}
            >
              {isFlipped ? (
                <img src={card.image} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-4xl font-black text-white/20">?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* رسالة الفوز */}
      <AnimatePresence>
        {isWinner && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center bg-card border border-border rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-4xl font-black text-primary mb-4">🎉 مبروك! أنهيت اللعبة</h2>
           <div className="flex justify-center gap-4 mt-6">
  {/* زر إعادة اللعب */}
  <Button
    onClick={createGame}
    className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform"
  >
    إعادة اللعب 🔄
  </Button>

  {/* زر العودة */}
  <Link href="/games/GamesHub">
    <Button
      variant="outline"
      className="px-8 py-4 rounded-2xl border-2 border-primary text-primary font-bold text-lg hover:bg-primary/5 hover:scale-105 transition-transform"
    >
      العودة للألعاب 🎮
    </Button>
  </Link>
</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}