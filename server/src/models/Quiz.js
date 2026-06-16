import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String
})

const quizSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: [true, 'معرف الحدوتة مطلوب']
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'معرف الطفل مطلوب']
  },
  questions: [questionSchema],
  attempts: [{
    answers: [{
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean
    }],
    score: Number,
    percentage: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bestScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const Quiz = mongoose.model('Quiz', quizSchema)
export default Quiz
