import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const quizSubmissionSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "child",
      required: true,
      index: true,
    },
    storyId: {
      type: String,
      default: "",
    },
    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one answer is required",
      },
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const QuizSubmission = mongoose.model("quizSubmission", quizSubmissionSchema);

export default QuizSubmission;
