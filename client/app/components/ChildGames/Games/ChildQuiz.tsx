"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useChild } from "@/hooks/useChild";

const QUESTIONS = [
  {
    question: "ما هو أكبر حيوان في العالم؟",
    options: ["الفيل", "الحوت الأزرق", "الأسد", "الزرافة"],
    answer: "الحوت الأزرق",
  },
  {
    question: "كم عدد أيام الأسبوع؟",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "أي حيوان يُعرف بملك الغابة؟",
    options: ["النمر", "الفيل", "الأسد", "الدب"],
    answer: "الأسد",
  },
  {
    question: "ما لون السماء في النهار؟",
    options: ["أخضر", "أحمر", "أزرق", "بنفسجي"],
    answer: "أزرق",
  },
  {
    question: "كم عدد أرجل العنكبوت؟",
    options: ["6", "8", "10", "12"],
    answer: "8",
  },
];

export default function QuizGame() {
  const { child } = useChild();
  const { accessToken } = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewardSent, setRewardSent] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const question = QUESTIONS[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setScore((prev) => prev + 10);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < QUESTIONS.length) {
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

      await fetch(
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
            reason: "Quiz Game Reward",
          }),
        }
      );
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
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
    setRewardSent(false);
    setSelectedAnswer(null);
  };

  if (finished) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-[40px] shadow-xl p-10 text-center">
          <div className="text-7xl mb-4">🏆</div>

          <h1 className="text-4xl font-black text-primary mb-4">
            أحسنت!
          </h1>

          <p className="text-xl font-bold text-gray-600 mb-4">
            لقد أنهيت الاختبار بنجاح
          </p>

          <div className="bg-[#FFF7D6] rounded-3xl p-5 mb-6">
            <p className="text-3xl font-black text-[#B77900]">
              ⭐ {score} نقطة
            </p>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={restartGame}
              className="
                px-8
                py-4
                rounded-full
                bg-primary
                text-white
                font-black
                text-lg
              "
            >
              🔄 العب مرة أخرى
            </button>

            <Link
              href="/games/GamesHub"
              className="
                px-8
                py-4
                rounded-full
                bg-meadow
                text-white
                font-black
                text-lg
              "
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

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">❓</div>

        <h1 className="text-5xl font-black text-magic mb-3">
          اختبر نفسك
        </h1>

        <p className="text-lg font-bold text-gray-500">
          السؤال {currentQuestion + 1} من {QUESTIONS.length}
        </p>

        <p className="text-2xl font-black mt-3 text-[#B77900]">
          ⭐ النقاط: {score}
        </p>
      </div>

      {/* Progress */}
      <div className="w-full h-4 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-meadow transition-all duration-500"
          style={{
            width: `${
              ((currentQuestion + 1) / QUESTIONS.length) * 100
            }%`,
          }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[40px] shadow-xl p-8">

        <h2 className="text-3xl font-black text-center mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="grid gap-4">

          {question.options.map((option) => {
            const isCorrect =
              selectedAnswer &&
              option === question.answer;

            const isWrong =
              selectedAnswer === option &&
              option !== question.answer;

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
                      ? "bg-[#97C459] text-white"
                      : isWrong
                      ? "bg-red-400 text-white"
                      : "bg-[#85B7EB] text-white hover:scale-[1.02]"
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