"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// ============================================================
// Types
// ============================================================

type Operator = "+" | "-";

type DifficultyLevel = {
  id: string;
  label: string;
  emoji: string;
  minAge: number;
  maxAge: number;
  numberRange: number; // أكبر رقم ممكن يظهر في المسألة
  operators: Operator[];
  questionSeconds: number; // مدة اللعبة بالثانية
};

type Problem = {
  a: number;
  b: number;
  operator: Operator;
  answer: number;
};

type GamePhase = "select-age" | "playing" | "finished";

// ============================================================
// Constants
// ============================================================

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: "young",
    label: "٤ - ٦ سنوات",
    emoji: "🐣",
    minAge: 4,
    maxAge: 6,
    numberRange: 10,
    operators: ["+"],
    questionSeconds: 45,
  },
  {
    id: "middle",
    label: "٧ - ٩ سنوات",
    emoji: "🦊",
    minAge: 7,
    maxAge: 9,
    numberRange: 20,
    operators: ["+", "-"],
    questionSeconds: 40,
  },
  {
    id: "older",
    label: "١٠ سنوات فأكتر",
    emoji: "🦁",
    minAge: 10,
    maxAge: 99,
    numberRange: 50,
    operators: ["+", "-"],
    questionSeconds: 35,
  },
];

const OPTIONS_COUNT = 4;

// ============================================================
// Pure helpers (برّه الكومبوننت — متتعملش recreate كل render)
// ============================================================

function randomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

function pickOperator(operators: Operator[]): Operator {
  return operators[Math.floor(Math.random() * operators.length)];
}

/**
 * بتولّد مسألة صح دايمًا (خصوصًا الطرح: النتيجة مش بتبقى بالسالب).
 */
function generateProblem(level: DifficultyLevel): Problem {
  const operator = pickOperator(level.operators);

  if (operator === "+") {
    const a = randomInt(level.numberRange);
    const b = randomInt(level.numberRange);
    return { a, b, operator, answer: a + b };
  }

  // طرح: بنولّد a أكبر من أو يساوي b عشان النتيجة تفضل موجبة
  const a = randomInt(level.numberRange);
  const b = randomInt(a);
  return { a, b, operator, answer: a - b };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * بتولّد اختيارات فريدة (الإجابة الصح + مشتتات قريبة منها) وترجعها متلخبطة.
 */
function generateOptions(problem: Problem, count: number): number[] {
  const options = new Set<number>([problem.answer]);
  let guard = 0;

  while (options.size < count && guard < 50) {
    guard++;
    const offset = randomInt(5) - 2; // فرق من -2 لـ +2 عن الإجابة
    const candidate = problem.answer + (offset === 0 ? 3 : offset);
    if (candidate >= 0) options.add(candidate);
  }

  // لو لأي سبب مكملناش العدد المطلوب، نضيف أرقام عشوائية إضافية
  while (options.size < count) {
    options.add(randomInt(problem.answer + count * 2));
  }

  return shuffle(Array.from(options));
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

  const playCorrect = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }, []);

  const playWrong = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
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

  return { playCorrect, playWrong, playWin };
}

// ============================================================
// Small presentational subcomponents
// ============================================================

function AgeCard({
  level,
  onSelect,
}: {
  level: DifficultyLevel;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="
      w-full
      bg-white
      rounded-3xl
      p-6
      shadow-lg
      border-[3px] border-transparent
      hover:border-primary
      hover:scale-[1.02]
      active:scale-95
      transition
      text-center
      "
    >
      <div className="text-5xl mb-2">{level.emoji}</div>
      <div className="font-black text-lg text-ink">{level.label}</div>
    </button>
  );
}

function OptionButton({
  value,
  onPress,
  disabled,
}: {
  value: number;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className="
      py-5
      rounded-2xl
      bg-white
      shadow-md
      text-3xl
      font-black
      text-ink
      hover:scale-105
      active:scale-90
      disabled:opacity-60
      transition
      "
    >
      {value}
    </button>
  );
}

// ============================================================
// Main component
// ============================================================

export default function MathQuizGame() {
  const [phase, setPhase] = useState<GamePhase>("select-age");
  const [level, setLevel] = useState<DifficultyLevel | null>(null);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [options, setOptions] = useState<number[]>([]);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);

  const [time, setTime] = useState(0);
  const isPlayingRef = useRef(false);

  const { playCorrect, playWrong, playWin } = useGameSounds();

  const nextQuestion = useCallback((currentLevel: DifficultyLevel) => {
    const newProblem = generateProblem(currentLevel);
    setProblem(newProblem);
    setOptions(generateOptions(newProblem, OPTIONS_COUNT));
    setAnswered(false);
  }, []);

  const startGame = useCallback(
    (chosenLevel: DifficultyLevel) => {
      setLevel(chosenLevel);
      setScore(0);
      setStreak(0);
      setTime(chosenLevel.questionSeconds);
      isPlayingRef.current = true;
      setPhase("playing");
      nextQuestion(chosenLevel);
    },
    [nextQuestion]
  );

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          isPlayingRef.current = false;
          setPhase("finished");
          playWin();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, playWin]);

  const handleAnswer = useCallback(
    (value: number) => {
      if (!isPlayingRef.current || answered || !problem || !level) return;

      setAnswered(true);
      const isCorrect = value === problem.answer;

      if (isCorrect) {
        playCorrect();
        setStreak((s) => s + 1);
        setScore((s) => s + 10);
      } else {
        playWrong();
        setStreak(0);
      }

      setTimeout(() => {
        if (isPlayingRef.current) nextQuestion(level);
      }, 500);
    },
    [answered, problem, level, playCorrect, playWrong, nextQuestion]
  );

  const handleRestart = useCallback(() => {
    setPhase("select-age");
    setLevel(null);
    setProblem(null);
    setOptions([]);
  }, []);

  const questionText = useMemo(() => {
    if (!problem) return "";
    return `${problem.a} ${problem.operator} ${problem.b} = ؟`;
  }, [problem]);

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
      {/* -------------------- شاشة اختيار العمر -------------------- */}
      {phase === "select-age" && (
        <div className="w-full max-w-md px-6 pt-16 text-center">
          <div className="text-6xl mb-4">🧮</div>
          <h2 className="text-2xl font-black text-primary mb-8">
            اختر عمر اللاعب
          </h2>

          <div className="space-y-4">
            {DIFFICULTY_LEVELS.map((lvl) => (
              <AgeCard key={lvl.id} level={lvl} onSelect={() => startGame(lvl)} />
            ))}
          </div>
        </div>
      )}

      {/* -------------------- شاشة اللعب -------------------- */}
      {phase === "playing" && problem && (
        <>
          {/* Header */}
          <div className="w-full flex items-center justify-between px-5 pt-5">
            <div className="bg-white rounded-2xl px-5 py-3 shadow-lg font-bold text-ink">
              ⭐ {score}
            </div>
            <div className="bg-white rounded-2xl px-5 py-3 shadow-lg font-bold text-ink">
              ⏳ {formatTime(time)}
            </div>
          </div>

          {streak >= 3 && (
            <div className="mt-4 text-sm font-black text-meadow">
              🔥 متتالية {streak}!
            </div>
          )}

          {/* المسألة */}
          <div className="mt-10 bg-white rounded-3xl px-10 py-8 shadow-lg">
            <h2 className="text-5xl font-black text-ink text-center" dir="ltr">
              {questionText}
            </h2>
          </div>

          {/* الاختيارات */}
          <div className="grid grid-cols-2 gap-4 mt-10 px-8 w-full max-w-sm">
            {options.map((option) => (
              <OptionButton
                key={option}
                value={option}
                disabled={answered}
                onPress={() => handleAnswer(option)}
              />
            ))}
          </div>
        </>
      )}

      {/* -------------------- شاشة النهاية -------------------- */}
      {phase === "finished" && (
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

            <h2 className="text-3xl font-black text-primary">
              انتهت اللعبة
            </h2>

            <p className="mt-5 text-xl">مجموع نقاطك</p>
            <p className="text-5xl font-black text-yellow-500 mt-3">{score}</p>

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