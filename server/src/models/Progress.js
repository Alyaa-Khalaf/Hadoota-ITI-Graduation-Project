import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'معرف الطفل مطلوب'],
    unique: true
  },
  storiesCompleted: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  xpPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  stars: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  topicsLearned: [{
    topic: String,
    count: {
      type: Number,
      default: 1
    }
  }],
  weeklyStats: [{
    week: Date,
    storiesCount: Number,
    timeSpent: Number,
    avgQuizScore: Number,
    topicsLearned: [String]
  }],
  quizStats: {
    totalQuizzes: {
      type: Number,
      default: 0
    },
    totalCorrect: {
      type: Number,
      default: 0
    },
    avgScore: {
      type: Number,
      default: 0
    }
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  }
}, { timestamps: true })

const Progress = mongoose.model('Progress', progressSchema)
export default Progress
