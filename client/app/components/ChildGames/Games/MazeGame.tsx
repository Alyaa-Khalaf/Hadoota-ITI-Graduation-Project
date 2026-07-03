"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// ============================================================
// Types
// ============================================================

type Cell = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
};

type Position = { row: number; col: number };
type Direction = "up" | "down" | "left" | "right";

// ============================================================
// Constants
// ============================================================

const GRID_SIZE = 9; // عدد الخلايا في كل ضلع (فردي بيدي شكل متاهة أوضح)
const CELL_PX = 36; // حجم كل خلية بالبكسل

const DIRECTION_DELTA: Record<Direction, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

// الحائط اللي بيتفتح في الخلية الحالية، والحائط المقابل ليه في الخلية الجديدة
const OPPOSITE_WALL: Record<Direction, keyof Omit<Cell, "visited">> = {
  up: "bottom",
  down: "top",
  left: "right",
  right: "left",
};

const CURRENT_WALL: Record<Direction, keyof Omit<Cell, "visited">> = {
  up: "top",
  down: "bottom",
  left: "left",
  right: "right",
};

const ARROW_KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

// ============================================================
// Pure helpers (برّه الكومبوننت — متتعملش recreate كل render)
// ============================================================

function createEmptyGrid(size: number): Cell[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  );
}

function inBounds(row: number, col: number, size: number) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function getUnvisitedNeighbors(
  grid: Cell[][],
  pos: Position,
  size: number
): { pos: Position; direction: Direction }[] {
  const results: { pos: Position; direction: Direction }[] = [];

  (Object.keys(DIRECTION_DELTA) as Direction[]).forEach((direction) => {
    const delta = DIRECTION_DELTA[direction];
    const nextRow = pos.row + delta.row;
    const nextCol = pos.col + delta.col;

    if (inBounds(nextRow, nextCol, size) && !grid[nextRow][nextCol].visited) {
      results.push({ pos: { row: nextRow, col: nextCol }, direction });
    }
  });

  return results;
}

/**
 * توليد متاهة بخوارزمية Recursive Backtracking (DFS عشوائي).
 * بترجع grid فيه كل خلية عارفة عندها حوائط فين (top/right/bottom/left).
 */
function generateMaze(size: number): Cell[][] {
  const grid = createEmptyGrid(size);
  const stack: Position[] = [{ row: 0, col: 0 }];
  grid[0][0].visited = true;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(grid, current, size);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const { pos: next, direction } =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    // بنكسر الحائط بين الخلية الحالية والجارة عشان يبقى فيه ممر
    grid[current.row][current.col][CURRENT_WALL[direction]] = false;
    grid[next.row][next.col][OPPOSITE_WALL[direction]] = false;

    grid[next.row][next.col].visited = true;
    stack.push(next);
  }

  return grid;
}

function canMove(grid: Cell[][], pos: Position, direction: Direction): boolean {
  const wallKey = CURRENT_WALL[direction];
  return !grid[pos.row][pos.col][wallKey];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ============================================================
// Sound effects (Web Audio API — من غير ملفات خارجية)
// ============================================================

function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const playStep = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }, []);

  const playWin = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [660, 880, 1100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.1;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  }, []);

  return { playStep, playWin };
}

// ============================================================
// Small presentational subcomponents
// ============================================================

function DirectionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <button
      onClick={onPress}
      className="
      w-12 h-12
      rounded-2xl
      bg-white
      shadow-md
      text-2xl
      flex items-center justify-center
      active:scale-90
      transition
      "
    >
      {label}
    </button>
  );
}

// ============================================================
// Main component
// ============================================================

export default function MazeGame() {
  const [resetKey, setResetKey] = useState(0);
  const [player, setPlayer] = useState<Position>({ row: 0, col: 0 });
  const [steps, setSteps] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const { playStep, playWin } = useGameSounds();

  // المتاهة بتتولّد مرة واحدة بس لكل لعبة (وقت الـ resetKey يتغيّر)
  const maze = useMemo(() => generateMaze(GRID_SIZE), [resetKey]);
  const goal: Position = useMemo(
    () => ({ row: GRID_SIZE - 1, col: GRID_SIZE - 1 }),
    []
  );

  // عداد الوقت — بيوقف تلقائي لما اللعبة تخلص
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setElapsed((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [finished, resetKey]);

  const movePlayer = useCallback(
    (direction: Direction) => {
      if (finished) return;

      setPlayer((current) => {
        if (!canMove(maze, current, direction)) return current;

        const delta = DIRECTION_DELTA[direction];
        const next = { row: current.row + delta.row, col: current.col + delta.col };

        playStep();
        setSteps((s) => s + 1);

        if (next.row === goal.row && next.col === goal.col) {
          setFinished(true);
          playWin();
        }

        return next;
      });
    },
    [maze, goal, finished, playStep, playWin]
  );

  // تحكم لوحة المفاتيح (ديسكتوب)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = ARROW_KEY_MAP[e.key];
      if (!direction) return;
      e.preventDefault();
      movePlayer(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  const handleRestart = useCallback(() => {
    setPlayer({ row: 0, col: 0 });
    setSteps(0);
    setElapsed(0);
    setFinished(false);
    setResetKey((k) => k + 1);
  }, []);

  const mazePixelSize = GRID_SIZE * CELL_PX;

  return (
    <div
      dir="rtl"
      className="
      relative
      min-h-screen
      w-full
      bg-gradient-to-b
      from-page-dreamy
      via-page-sky
      to-white
      flex
      flex-col
      items-center
      pb-10
      "
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 pt-5">
        <div className="bg-white rounded-2xl px-5 py-3 shadow-lg font-bold text-ink">
          🚶 {steps}
        </div>
        <div className="bg-white rounded-2xl px-5 py-3 shadow-lg font-bold text-ink">
          ⏳ {formatTime(elapsed)}
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-black text-primary">
        وصّل الأرنب للجزرة 🥕
      </h2>

      {/* المتاهة */}
      <div
        className="mt-6 bg-white rounded-3xl shadow-lg p-3"
        style={{ width: mazePixelSize + 24 }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_PX}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_PX}px)`,
          }}
        >
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer = player.row === rowIndex && player.col === colIndex;
              const isGoal = goal.row === rowIndex && goal.col === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="flex items-center justify-center text-lg"
                  style={{
                    borderTop: cell.top ? "2px solid var(--color-ink, #4A3A2A)" : "2px solid transparent",
                    borderRight: cell.right ? "2px solid var(--color-ink, #4A3A2A)" : "2px solid transparent",
                    borderBottom: cell.bottom ? "2px solid var(--color-ink, #4A3A2A)" : "2px solid transparent",
                    borderLeft: cell.left ? "2px solid var(--color-ink, #4A3A2A)" : "2px solid transparent",
                  }}
                >
                  {isPlayer ? "🐰" : isGoal ? "🥕" : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* أزرار الاتجاهات (موبايل/تابلت) */}
      <div className="mt-8 grid grid-cols-3 gap-2 place-items-center">
        <div />
        <DirectionButton label="⬆️" onPress={() => movePlayer("up")} />
        <div />

        <DirectionButton label="⬅️" onPress={() => movePlayer("left")} />
        <DirectionButton label="⬇️" onPress={() => movePlayer("down")} />
        <DirectionButton label="➡️" onPress={() => movePlayer("right")} />
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        استخدم الأسهم في لوحة المفاتيح أو الأزرار فوق
      </p>

      {/* End Game */}
      {finished && (
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

            <h2 className="text-3xl font-black text-primary">وصلت!</h2>

            <p className="mt-5 text-xl">عدد الخطوات</p>
            <p className="text-5xl font-black text-yellow-500 mt-1">{steps}</p>

            <p className="mt-4 text-sm text-ink-muted">
              الوقت: {formatTime(elapsed)}
            </p>

            <div className="flex justify-center gap-4 mt-8">
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
                className="
                px-6
                py-3
                rounded-full
                bg-sky
                text-white
                font-black
                hover:brightness-110
                active:scale-95
                transition-all
                flex
                items-center
                "
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