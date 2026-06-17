"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useChild } from "@/hooks/useChild";
import { useAuth } from "@/context/AuthContext";

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
  const {child} = useChild();
    const { accessToken } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  // ⭐ SCORE جاهز للـ gamification
  const [score, setScore] = useState(0);
// منع إرسال المكافأة أكثر من مرة
const [rewardSent, setRewardSent] = useState(false);

  const createGame = () => {
  const duplicated = [...IMAGES, ...IMAGES];

  const shuffled = duplicated
    .sort(() => Math.random() - 0.5)
    .map((image, index) => ({
      id: index,
      image,
    }));

  setCards(shuffled);
  setFlipped([]);
  setMatched([]);
  setMoves(0);
  setScore(0);

  // reset reward flag
  setRewardSent(false);
};
  useEffect(() => {
    createGame();
  }, []);

  const handleFlip = (index: number) => {
    if (disabled) return;
    if (flipped.includes(index)) return;
    if (matched.includes(index)) return;
    if (flipped.length === 2) return;

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

        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isWinner = cards.length > 0 && matched.length === cards.length;

  // ⭐ إرسال المكافأة للـ backend
 const sendReward = async () => {
  try {
    const childId = child?._id;

    if (!childId) return;

    const res = await fetch(
      "http://localhost:5000/api/gamification/reward",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          childId,
          type: "star",
          amount: score,
          reason: "Memory Game",
        }),
      }
    );

    const data = await res.json();

    console.log("REWARD RESPONSE:", data);
  } catch (err) {
    console.log("Reward error:", err);
  }
};
  useEffect(() => {
  if (isWinner && !rewardSent) {
    sendReward();
    setRewardSent(true);
  }
}, [isWinner, rewardSent]);

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black text-magic mb-2">
          لعبة الذاكرة 🧠
        </h1>

        <p className="font-bold text-ink-muted">
          عدد المحاولات: {moves}
        </p>

        <p className="font-black text-ink text-xl mt-2">
          ⭐ النقاط: {score}
        </p>
      </div>

      {/* Grid 4 columns */}
      <div className="grid grid-cols-4 gap-5">
        {cards.map((card, index) => {
          const isFlipped =
            flipped.includes(index) || matched.includes(index);

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              className="
                w-full
                h-[140px]
                rounded-[28px]
                bg-cat-animals
                shadow-lg
                flex
                items-center
                justify-center
                overflow-hidden
                transition
                hover:scale-105
              "
            >
              {isFlipped ? (
                <img
                  src={card.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <span className="text-4xl">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Win screen */}
      {isWinner && (
        <div className="mt-8 text-center bg-sunny/20 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-2">
            🎉 مبروك!
          </h2>

          <p className="font-bold mb-2">
            أنهيت اللعبة بنجاح
          </p>

          <p className="font-black text-magic mb-4">
            ⭐ مجموع النقاط: {score}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={createGame}
              className="px-6 py-3 rounded-full bg-magic text-white font-black"
            >
              إعادة اللعب
            </button>

            <Link
              href="/games/GamesHub"
              className="px-6 py-3 rounded-full bg-sky text-white font-black"
            >
              العودة للألعاب 🎮
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}