"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "@/hooks/useChild";

type Difficulty = "easy" | "medium" | "hard";

type Question = {
  question: string;
  options: string[];
  answer: string;
  difficulty: Difficulty;
};

const QUESTIONS: Question[] = [
  // سهل
  { question: "ما هو أكبر حيوان في العالم؟", options: ["الفيل", "الحوت الأزرق", "الأسد", "الزرافة"], answer: "الحوت الأزرق", difficulty: "easy" },
  { question: "كم عدد أيام الأسبوع؟", options: ["5", "6", "7", "8"], answer: "7", difficulty: "easy" },
  { question: "أي حيوان يُعرف بملك الغابة؟", options: ["النمر", "الفيل", "الأسد", "الدب"], answer: "الأسد", difficulty: "easy" },
  { question: "ما لون السماء في النهار؟", options: ["أخضر", "أحمر", "أزرق", "بنفسجي"], answer: "أزرق", difficulty: "easy" },
  { question: "كم عدد أرجل العنكبوت؟", options: ["6", "8", "10", "12"], answer: "8", difficulty: "easy" },
  { question: "ما هو لون الموز عندما ينضج؟", options: ["أحمر", "أصفر", "أخضر", "بنفسجي"], answer: "أصفر", difficulty: "easy" },
  { question: "كم عدد أصابع اليد الواحدة؟", options: ["4", "5", "6", "10"], answer: "5", difficulty: "easy" },
  { question: "أي فصل يأتي بعد الشتاء؟", options: ["الصيف", "الربيع", "الخريف", "الشتاء"], answer: "الربيع", difficulty: "easy" },

  // متوسط
  { question: "ما هي عاصمة مصر؟", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"], answer: "القاهرة", difficulty: "medium" },
  { question: "كم عدد قارات العالم؟", options: ["5", "6", "7", "8"], answer: "7", difficulty: "medium" },
  { question: "ما هو الكوكب الأقرب للشمس؟", options: ["الأرض", "المريخ", "عطارد", "زحل"], answer: "عطارد", difficulty: "medium" },
  { question: "كم عدد عظام جسم الإنسان البالغ تقريبًا؟", options: ["106", "206", "306", "406"], answer: "206", difficulty: "medium" },
  { question: "ما هي اللغة الرسمية في البرازيل؟", options: ["الإسبانية", "الإنجليزية", "البرتغالية", "الفرنسية"], answer: "البرتغالية", difficulty: "medium" },
  { question: "أي حاسة يستخدمها الخفاش بشكل أساسي للتنقل؟", options: ["البصر", "الشم", "السمع", "اللمس"], answer: "السمع", difficulty: "medium" },
  { question: "ما هو أطول نهر في العالم؟", options: ["النيل", "الأمازون", "الفرات", "دجلة"], answer: "النيل", difficulty: "medium" },

  // صعب
  { question: "كم عدد القلوب التي يمتلكها الأخطبوط؟", options: ["1", "2", "3", "4"], answer: "3", difficulty: "hard" },
  { question: "ما هو أسرع حيوان بري في العالم؟", options: ["النمر", "الفهد", "الحصان", "الأسد"], answer: "الفهد", difficulty: "hard" },
  { question: "في أي سنة هبط الإنسان على القمر لأول مرة؟", options: ["1959", "1969", "1979", "1989"], answer: "1969", difficulty: "hard" },
  { question: "ما هو العضو المسؤول عن ضخ الدم في الجسم؟", options: ["الكبد", "القلب", "الكلى", "الرئة"], answer: "القلب", difficulty: "hard" },
  { question: "ما هو أصغر كوكب في النظام الشمسي؟", options: ["المريخ", "زحل", "عطارد", "أورانوس"], answer: "عطارد", difficulty: "hard" },
  { question: "كم عدد أسنان الإنسان البالغ تقريبًا؟", options: ["20", "28", "32", "40"], answer: "32", difficulty: "hard" },
];

const TOTAL_QUESTIONS = 8;

const DIFFICULTY_STYLES: Record<Difficulty, { label: string; badge: string; points: number }> = {
  easy: { label: "سهل", badge: "bg-green-100 text-green-700", points: 10 },
  medium: { label: "متوسط", badge: "bg-amber-100 text-amber-700", points: 15 },
  hard: { label: "صعب", badge: "bg-red-100 text-red-700", points: 20 },
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRound(): Question[] {
  // نضمن مزيج من المستويات: نص سهل، ربع متوسط، ربع صعب تقريبًا
  const easy = shuffleArray(QUESTIONS.filter((q) => q.difficulty === "easy"));
  const medium = shuffleArray(QUESTIONS.filter((q) => q.difficulty === "medium"));
  const hard = shuffleArray(QUESTIONS.filter((q) => q.difficulty === "hard"));

  const picked = [
    ...easy.slice(0, Math.ceil(TOTAL_QUESTIONS * 0.5)),
    ...medium.slice(0, Math.ceil(TOTAL_QUESTIONS * 0.3)),
    ...hard.slice(0, Math.ceil(TOTAL_QUESTIONS * 0.2)),
  ];

  return shuffleArray(picked).slice(0, TOTAL_QUESTIONS).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

export default function QuizGame() {
  const { child } = useChild();
  const { accessToken } = useAuth();

  const [round, setRound] = useState<Question[]>(() => buildRound());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewardSent, setRewardSent] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const question = round[currentQuestion];
  const diffStyle = DIFFICULTY_STYLES[question.difficulty];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setScore((prev) => prev + diffStyle.points);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < round.length) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const sendReward = async () => {
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
          amount: score,
          reason: "Quiz Game Reward",
        }),
      });
    } catch (error) {
      console.error("Reward Error:", error);
    }
  };

  useEffect(() => {
    if (finished && !rewardSent) {
      sendReward();
      setRewardSent(true);
    }
  }, [finished]);

  const restartGame = () => {
    setRound(buildRound());
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
    setRewardSent(false);
    setSelectedAnswer(null);
    setStreak(0);
  };

  if (finished) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-[40px] shadow-xl p-10 text-center">
          <div className="text-7xl mb-4">🏆</div>

          <h1 className="text-4xl font-black text-purple-600 mb-4">
            أحسنت!
          </h1>

          <p className="text-xl font-bold text-gray-600 mb-4">
            لقد أنهيت الاختبار بنجاح
          </p>

          <div className="bg-amber-50 rounded-3xl p-5 mb-6">
            <p className="text-3xl font-black text-amber-600">
              ⭐ {score} نقطة
            </p>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={restartGame}
              className="px-8 py-4 rounded-full bg-purple-500 text-white font-black text-lg active:scale-95 transition-transform"
            >
              🔄 العب مرة أخرى
            </button>

            <Link
              href="/games/GamesHub"
              className="px-8 py-4 rounded-full bg-green-500 text-white font-black text-lg active:scale-95 transition-transform"
            >
              🎮 العودة للألعاب
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">❓</div>

        <h1 className="text-5xl font-black text-purple-600 mb-3">
          اختبر نفسك
        </h1>

        <p className="text-lg font-bold text-gray-500">
          السؤال {currentQuestion + 1} من {round.length}
        </p>

        <div className="flex items-center justify-center gap-3 mt-3">
          <p className="text-2xl font-black text-amber-600">
            ⭐ النقاط: {score}
          </p>

          {streak >= 2 && (
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-black text-sm">
              🔥 متتالية {streak}
            </span>
          )}
        </div>
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{
            width: `${((currentQuestion + 1) / round.length) * 100}%`,
          }}
        />
      </div>

      <div className="bg-white rounded-[40px] shadow-xl p-8">
        <div className="flex justify-center mb-4">
          <span className={`px-4 py-1 rounded-full font-black text-sm ${diffStyle.badge}`}>
            {diffStyle.label} • {diffStyle.points} نقطة
          </span>
        </div>

        <h2 className="text-3xl font-black text-center mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="grid gap-4">
          {question.options.map((option) => {
            const isCorrect = selectedAnswer && option === question.answer;
            const isWrong = selectedAnswer === option && option !== question.answer;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`
                  p-5
                  rounded-[24px]
                  text-xl
                  font-black
                  transition-all
                  shadow-md
                  ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : isWrong
                      ? "bg-red-400 text-white"
                      : "bg-blue-400 text-white hover:scale-[1.02]"
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}