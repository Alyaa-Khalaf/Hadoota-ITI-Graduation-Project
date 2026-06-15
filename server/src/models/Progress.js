import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  // 1. ربط ملف التقدم بالطفل
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'معرف الطفل مطلوب'],
    unique: true
  },

  // 2. المؤشرات العامة للألعاب والتقدم (Gamification & Overview)
  storiesCompleted: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0 // بالدقائق الإجمالية
  },
  totalPoints: {
    type: Number,
    default: 0 // تم دمج حقل هند ليكون مرادفاً للـ XP
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

  // 3. الشارات والإنجازات (Badges)
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // 4. تاريخ النقاط اليومي (من كود هند - ممتاز للـ Charts والرسوم البيانية)
  dailyHistory: [
    {
      day: { type: String, required: true }, // مثل: "Sun", "Mon", "Tue"
      points: { type: Number, default: 0 }
    }
  ],

  // 5. المواضيع والمجالات التي تعلمها الطفل (مهم جداً لتخصيص المنهج للمدرسة)
  topicsLearned: [{
    topic: String,
    count: {
      type: Number,
      default: 1
    }
  }],

  // 6. الإحصائيات الأسبوعية (المغذي الرئيسي لـ GET /api/schools/:id/report)
  weeklyStats: [{
    week: Date,
    storiesCount: Number,
    timeSpent: Number,
    avgQuizScore: Number,
    topicsLearned: [String]
  }],

  // 7. إحصائيات الاختبارات (المغذي لـ GET /api/schools/:id/analytics)
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

  // 8. الالتزام اليومي والتفاعل (Streak)
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

