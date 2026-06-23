"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "@/hooks/useChild";

type Piece = {
  id: number;
  correctIndex: number;
};

const IMAGES = [
  "/GamesImages/lion.avif",
  "/GamesImages/Panda.jpg",
  "/GamesImages/rabit.jpg",
  "/GamesImages/rapunzel.jpg",
  "/GamesImages/turtle.webp",
  "/GamesImages/cat.avif",
];

const GRID_SIZE = 3; // 3x3 = 9 قطعة
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PuzzleGame() {
  const { child } = useChild();
  const { accessToken } = useAuth();

  const [image, setImage] = useState(IMAGES[0]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  // board[slotIndex] = id القطعة الموضوعة في هذا المكان، أو null لو فاضي
  const [board, setBoard] = useState<(number | null)[]>(
    Array(TOTAL_PIECES).fill(null)
  );
  const [tray, setTray] = useState<Piece[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [rewardSent, setRewardSent] = useState(false);
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  const setupGame = (img: string) => {
    const newPieces: Piece[] = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
      id: i,
      correctIndex: i,
    }));

    setImage(img);
    setBoard(Array(TOTAL_PIECES).fill(null));
    setTray(shuffleArray(newPieces));
    setMoves(0);
    setScore(0);
    setRewardSent(false);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    setupGame(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
  }, []);

  const isWinner =
    board.length === TOTAL_PIECES &&
    board.every((pieceId, slotIndex) => pieceId === slotIndex);

  const piecesById = (id: number) =>
    [...tray, ...pieces].find((p) => p.id === id);

  const allPiecesMap = useRef<Map<number, Piece>>(new Map());
  useEffect(() => {
    const map = new Map<number, Piece>();
    Array.from({ length: TOTAL_PIECES }, (_, i) => i).forEach((id) =>
      map.set(id, { id, correctIndex: id })
    );
    allPiecesMap.current = map;
  }, [image]);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOverSlot = (slotIndex: number) => {
    setDragOverSlot(slotIndex);
  };

  const handleDropOnSlot = (slotIndex: number) => {
    if (draggedId === null) return;

    setMoves((prev) => prev + 1);

    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];

      // لو الخانة فيها قطعة قبل كده، رجّعها للترايّ
      const existingPieceId = newBoard[slotIndex];

      newBoard[slotIndex] = draggedId;

      setTray((prevTray) => {
        let nextTray = prevTray.filter((p) => p.id !== draggedId);
        if (existingPieceId !== null && existingPieceId !== undefined) {
          const existingPiece = allPiecesMap.current.get(existingPieceId);
          if (existingPiece) nextTray = [...nextTray, existingPiece];
        }
        return nextTray;
      });

      return newBoard;
    });

    if (draggedId !== slotIndex) {
      setShakeSlot(slotIndex);
      setTimeout(() => setShakeSlot(null), 400);
    } else {
      setScore((prev) => prev + 15);
    }

    setDraggedId(null);
    setDragOverSlot(null);
  };

  const handleReturnToTray = () => {
    if (draggedId === null) return;

    setBoard((prevBoard) => {
      const slotIndex = prevBoard.indexOf(draggedId);
      if (slotIndex === -1) return prevBoard;

      const newBoard = [...prevBoard];
      newBoard[slotIndex] = null;

      const piece = allPiecesMap.current.get(draggedId);
      if (piece) {
        setTray((prevTray) => [...prevTray, piece]);
      }

      return newBoard;
    });

    setDraggedId(null);
  };

  const sendReward = async () => {
    try {
      const childId = child?._id;
      if (!childId || !accessToken) return;

      const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
      const timeBonus = Math.max(60 - timeTaken, 0);
      const finalScore = score + timeBonus;

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
          reason: "Puzzle Game",
        }),
      });
    } catch (err) {
      console.error("Reward error:", err);
    }
  };

  useEffect(() => {
    if (isWinner && !rewardSent) {
      sendReward();
      setRewardSent(true);
    }
  }, [isWinner, rewardSent]);

  const restart = () => {
    setupGame(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
  };
const getPieceBgStyle = (id: number) => {
  const row = Math.floor(id / GRID_SIZE);
  const col = id % GRID_SIZE;

  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${GRID_SIZE * 100}%`,
    backgroundPosition: `${col * 50}% ${row * 50}%`,
    backgroundRepeat: "no-repeat",
  };
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-6">
<h1 className="text-4xl font-black text-primary mb-2">          🧩 تركيب الصورة
        </h1>
        <p className="font-bold text-gray-500">عدد الحركات: {moves}</p>
<p className="font-black text-sunny text-xl mt-1">
              ⭐ النقاط: {score}
        </p>
      </div>

      {/* لوحة التركيب */}
      <div
        className="grid mx-auto mb-8 bg-gray-100 rounded-3xl p-3 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: "6px",
          maxWidth: 360,
        }}
      >
        {board.map((pieceId, slotIndex) => (
          <div
            key={slotIndex}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOverSlot(slotIndex);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDropOnSlot(slotIndex);
            }}
            onDragLeave={() => setDragOverSlot(null)}
            className={`
              aspect-square
              rounded-xl
              border-2
              border-dashed
              flex
              items-center
              justify-center
              transition-all
              ${dragOverSlot === slotIndex ? "border-primary bg-primary-wash" : "border-gray-300"}
              ${shakeSlot === slotIndex ? "animate-bounce" : ""}
            `}
          >
            {pieceId !== null && (
              <div
                draggable
                onDragStart={() => handleDragStart(pieceId)}
                className="w-full h-full rounded-lg cursor-grab active:cursor-grabbing"
                style={getPieceBgStyle(pieceId)}
              />
            )}
          </div>
        ))}
      </div>

      {/* صينية القطع المبعثرة */}
      {tray.length > 0 && (
        <div className="text-center mb-2">
          <p className="font-bold text-gray-500 text-sm">اسحب القطع لمكانها الصحيح 👇</p>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleReturnToTray();
        }}
        className="grid grid-cols-4 gap-3 bg-white rounded-3xl p-4 shadow-md min-h-[100px]"
      >
        {tray.map((piece) => (
          <div
            key={piece.id}
            draggable
            onDragStart={() => handleDragStart(piece.id)}
            className="aspect-square rounded-lg cursor-grab active:cursor-grabbing shadow hover:scale-105 transition"
            style={getPieceBgStyle(piece.id)}
          />
        ))}
      </div>

      {isWinner && (
        <div className="mt-8 text-center bg-amber-50 border border-amber-200 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-2">🎉 مبروك!</h2>
          <p className="font-bold mb-2">ركّبت الصورة بنجاح</p>
          <p className="font-black text-purple-600 mb-4">⭐ مجموع النقاط: {score}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={restart}
              className="px-6 py-3 rounded-full bg-purple-500 text-white font-black active:scale-95 transition-transform"
            >
              إعادة اللعب
            </button>

            <Link
              href="/games/GamesHub"
              className="px-6 py-3 rounded-full bg-sky-400 text-white font-black active:scale-95 transition-transform"
            >
              العودة للألعاب 🎮
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}