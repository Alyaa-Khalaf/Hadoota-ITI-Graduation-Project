import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  // 1. ربط ملف التقدم بالطفل
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'معرف الطفل مطلوب'],
    unique: true
  },

  // 2. المؤشرات العامة للألعاب والتقدم
  storiesCompleted: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  totalPoints: {
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

  // 3. الشارات والإنجازات
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // 4. تاريخ النقاط اليومي
  dailyHistory: [
    {
      day: { type: String, required: true },
      points: { type: Number, default: 0 }
    }
  ],

  // 5. المواضيع والمجالات التي تعلمها الطفل
  topicsLearned: [{
    topic: String,
    count: {
      type: Number,
      default: 1
    }
  }],

  // 6. الإحصائيات الأسبوعية
  weeklyStats: [{
    week: Date,
    storiesCount: Number,
    timeSpent: Number,
    avgQuizScore: Number,
    topicsLearned: [String]
  }],

  // 7. إحصائيات الاختبارات
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

  // 8. الالتزام اليومي والتفاعل
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