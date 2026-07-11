"use client"
import { motion } from "framer-motion";
import { useSelectedChild } from "@/context/childContext";
import { useGamification } from "@/hooks/useGamification";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, Sparkles, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const games = [
  {
    id: "memory",
    title: "لعبة الذاكرة",
    emoji: "🧠",
    href: "/games/GameMemory",
    unlockStars: 0,
    color: "bg-game-memory",
    textColor: "text-game-memory-foreground",
  },
  {
    id: "quiz",
    title: "اختبر نفسك",
    emoji: "❓",
    href: "/games/ChildQuizGame",
    unlockStars: 0,
    color: "bg-game-quiz",
    textColor: "text-game-quiz-foreground",
  },
  {
    id: "balloons",
    title: "فرقعة البالونات",
    emoji: "🎈",
    href: "/games/BalloonGame",
    unlockStars: 500,
    color: "bg-game-balloons",
    textColor: "text-game-balloons-foreground",
  },
  {
    id: "coloring",
    title: "التلوين",
    emoji: "🎨",
    href: "/games/ColoringGame",
    unlockStars: 1000,
    color: "bg-game-coloring",
    textColor: "text-game-coloring-foreground",
  },
  {
    id: "maze",
    title: "المتاهة",
    emoji: "🧭",
    href: "/games/MazeGame",
    unlockStars: 1500,
    color: "bg-game-maze",
    textColor: "text-game-maze-foreground",
  },
  {
    id: "2048",
    title: "اختبار الرياضيات",
    emoji: "🍓",
    href: "/games/MathQuizGame",
    unlockStars: 2000,
    color: "bg-game-math",
    textColor: "text-game-math-foreground",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

interface GameCardProps {
  game: (typeof games)[number];
  unlocked: boolean;
  stars: number;
}

function GameCard({ game, unlocked, stars }: GameCardProps) {
  const remaining = Math.max(0, game.unlockStars - stars);

  return (
    <Card
      className={cn(
        "relative h-44 overflow-hidden border-none p-6 shadow-md transition-all duration-300",
        game.color,
        unlocked ? "opacity-100" : "opacity-60"
      )}
    >
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <span className="text-5xl drop-shadow-sm">{game.emoji}</span>
        <h3 className={cn("text-lg font-bold", game.textColor)}>{game.title}</h3>

        {/* Star badge */}
        <div
          className={cn(
            "absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm",
            unlocked
              ? "bg-primary text-foreground/80 backdrop-blur-[2px]"
              : "bg-background/70 text-foreground/90 backdrop-blur-[2px]"
          )}
        >
          <Star className={cn("h-3 w-3", unlocked ? "fill-chart-4 text-chart-4 " : "fill-muted-foreground text-muted-foreground")} />
          {unlocked ? "متاح" : game.unlockStars}
        </div>

        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/25 backdrop-blur-[2px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/70 shadow-sm">
              <Lock className="h-5 w-5 text-foreground/70" />
            </div>
            <span className="text-xl font-semibold ">
              يحتاج {remaining} ⭐ آخر
            </span>
          </div>
        )}

        {/* New badge for recently unlocked games */}
        {unlocked && stars > 0 && stars < game.unlockStars + 500 && (
          <Badge
            variant="outline"
            className="absolute left-3 top-3 border-foreground/10 bg-background/40 text-foreground/70 backdrop-blur-[2px]"
          >
            جديد
          </Badge>
        )}
      </div>
    </Card>
  );
}

function GamesHub() {
  const { selectedChild } = useSelectedChild();
  const { gamification } = useGamification(selectedChild?._id || "");

  const stars = gamification?.stars ?? 0;

  return (
    <div
      dir="rtl"
    
      className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-8 text-center"
        >
          <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-sm font-semibold">
            <Gamepad2 className="h-4 w-4" />
            ساحة الألعاب
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            🎮 اختر مغامرتك القادمة
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            اختر لعبة وابدأ المغامرة
          </p>
        </motion.div>

        {/* Stars Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نجومك الحالية</p>
                  <p className="text-2xl font-bold text-foreground">{stars} ⭐</p>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-primary/60" />
            </div>
          </Card>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {games.map((game) => {
            const unlocked = stars >= game.unlockStars;

            return (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={unlocked ? { y: -6, scale: 1.02 } : undefined}
                whileTap={unlocked ? { scale: 0.98 } : undefined}
                className={cn("transition-all duration-300", unlocked && "cursor-pointer")}
              >
                {unlocked ? (
                  <Link href={game.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
                    <GameCard game={game} unlocked={unlocked} stars={stars} />
                  </Link>
                ) : (
                  <GameCard game={game} unlocked={unlocked} stars={stars} />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default GamesHub;
