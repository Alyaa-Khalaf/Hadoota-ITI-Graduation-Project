import Quiz from "../models/Quiz.js";
import Story from "../models/Story.js";
import Gamification from "../models/gamificationModel.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1beta",
});
const PASS_THRESHOLD = 60;

// ==========================================
// 1️⃣ POST /api/quiz/generate/:storyId
// ==========================================
export const generateQuiz = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { childId } = req.body;

    if (!childId) return sendError(res, 400, "معرف الطفل مطلوب لتوليد الكويز");

    const story = await Story.findById(storyId);
    if (!story)
      return sendError(res, 404, "الحدوتة غير موجودة لتوليد الكويز لها");

    let existingQuiz = await Quiz.findOne({ storyId, childId });
    if (existingQuiz) {
      return sendSuccess(
        res,
        200,
        "تم جلب الكويز المتولد مسبقاً لهذه القصة",
        existingQuiz,
      );
    }

    const prompt = `
      بناءً على قصة الأطفال التالية المكتوبة بين علامتي التنصيص:
      "${story.content || story.title}"
      
      قم بتوليد كويز تفاعلي من 3 أسئلة اختيار من متعدد (4 خيارات لكل سؤال).
      اجعل الأسئلة مبهجة ومناسبة للأطفال.
      
      يجب أن تعيد النتيجة بصيغة JSON نظيفة جداً وبدون أي نصوص إضافية أو علامات markdown.
      الهيكل المطلوب:
      {
        "questions": [
          {
            "question": "نص السؤال الأول هنا؟",
            "options": [
              { "text": "الاختيار الأول", "isCorrect": false },
              { "text": "الاختيار الثاني الصحيح", "isCorrect": true },
              { "text": "الاختيار الثالث", "isCorrect": false },
              { "text": "الاختيار الرابع", "isCorrect": false }
            ],
            "explanation": "توضيح مبسط ومبهج للطفل"
          }
        ]
      }
      تنبيه: يجب أن يكون هناك اختيار واحد فقط صحيح من بين الاختيارات الأربعة لكل سؤال.
    `;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    if (!result.response || !result.response.text) {
      throw new Error("لم يقم الذكاء الاصطناعي بإرجاع استجابة صحيحة");
    }

    const quizData = JSON.parse(result.response.text().trim());

    const newQuiz = await Quiz.create({
      storyId,
      childId,
      questions: quizData.questions,
      attempts: [],
      bestScore: 0,
    });

    return sendSuccess(
      res,
      201,
      "تم توليد الكويز بالـ AI بنجاح بناءً على أحداث القصة",
      newQuiz,
    );
  } catch (error) {
    return sendError(res, 500, "خطأ في توليد الكويز بالـ AI", [error.message]);
  }
};

// ==========================================
// 2️⃣ POST /api/quiz/submit
// ==========================================
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;

    if (
      !userAnswers ||
      !Array.isArray(userAnswers) ||
      userAnswers.length === 0
    ) {
      return sendError(res, 400, "مصفوفة إجابات الطفل مطلوبة");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return sendError(res, 404, "الكويز غير موجود في قاعدة البيانات");

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const attemptAnswers = [];

    userAnswers.forEach((userAns) => {
      const question = quiz.questions[userAns.questionIndex];
      if (question) {
        const selectedOptionObj = question.options[userAns.selectedOption];
        const isCorrect = selectedOptionObj
          ? selectedOptionObj.isCorrect === true
          : false;

        if (isCorrect) correctCount++;

        attemptAnswers.push({
          questionIndex: userAns.questionIndex,
          selectedOption: userAns.selectedOption,
          isCorrect,
        });
      }
    });

    const score = correctCount;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;
    const passed = percentage >= PASS_THRESHOLD;

    const newAttempt = {
      answers: attemptAnswers,
      score,
      percentage,
      completedAt: new Date(),
    };

    quiz.attempts.push(newAttempt);

    if (percentage > quiz.bestScore) {
      quiz.bestScore = percentage;
    }

    await quiz.save();

    let starsEarned = correctCount * 2;
    let bonusStars = percentage === 100 ? 5 : 0;
    let totalStarsToGive = starsEarned + bonusStars;

    let newBadge = null;
    let currentStars = 0;

    if (totalStarsToGive > 0 || percentage === 100) {
      let g = await Gamification.findOne({ childId: quiz.childId });
      if (!g)
        g = new Gamification({
          childId: quiz.childId,
          stars: 0,
          badges: [],
          rewardHistory: [],
        });

      if (totalStarsToGive > 0) {
        g.stars += totalStarsToGive;
        g.rewardHistory.push({
          type: "star",
          amount: totalStarsToGive,
          reason: `أنهى كويز بنتيجة ${percentage}%`,
        });
      }

      if (
        percentage === 100 &&
        !g.badges.some((b) => b.name === "العبقري الصغير")
      ) {
        newBadge = { name: "العبقري الصغير", earnedAt: new Date() };
        g.badges.push(newBadge);

        g.rewardHistory.push({
          type: "badge",
          amount: 1,
          badgeName: "العبقري الصغير",
          reason: "تقفيل كويز الحدوتة بنتيجة 100%",
        });
      }

      await g.save();
      currentStars = g.stars;
    }

    return sendSuccess(res, 201, "تم تسليم محاولة الكويز وحساب النقاط بنجاح", {
      quizId: quiz._id,
      score,
      totalQuestions,
      percentage,
      passed,
      bestScore: quiz.bestScore,
      questionsWithExplanations: quiz.questions.map((q) => ({
        question: q.question,
        explanation: q.explanation,
      })),
      gamification: {
        starsEarned: totalStarsToGive,
        totalStars: currentStars,
        newBadge: newBadge,
      },
    });
  } catch (error) {
    return sendError(res, 500, "خطأ في تسليم إجابات الكويز", [error.message]);
  }
};

// ==========================================
// 3️⃣ GET /api/quiz/:childId/history
// ==========================================
export const getChildQuizHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    const history = await Quiz.find({
      childId,
      "attempts.0": { $exists: true },
    })
      .populate("storyId", "title")
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 200, "تم جلب تاريخ كويزات الطفل بنجاح", history);
  } catch (error) {
    return sendError(res, 500, "خطأ في جلب تاريخ الكويزات", [error.message]);
  }
};
