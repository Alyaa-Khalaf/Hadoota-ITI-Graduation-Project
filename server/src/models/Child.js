import mongoose from 'mongoose'

const childSchema = new mongoose.Schema({
  // 1. ربط الطفل بالأهل
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف الأهل مطلوب']
  },

  // 2. ربط الطفل بالمدرسة
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    default: null
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null
  },

  // 3. البيانات الشخصية للطفل
  name: {
    type: String,
    required: [true, 'اسم الطفل مطلوب'],
    trim: true,
    maxlength: [50, 'اسم الطفل لا يزيد عن 50 حرف']
  },
  age: {
    type: Number,
    required: [true, 'عمر الطفل مطلوب'],
    min: [3, 'العمر لا يقل عن 3 سنين'],
    max: [12, 'العمر لا يزيد عن 12 سنة']
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'نوع الطفل مطلوب']
  },
  avatar: {
    type: String,
    default: 'default-child.png'
  },

  // 4. التخصيص والاهتمامات
  interests: [{
    type: String,
    enum: ['فضاء', 'حيوانات', 'مغامرات', 'تاريخ', 'علوم', 'دين', 'طبيعة', 'رياضة']
  }],
  learningLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },

  // 5. إعدادات التحكم بالأمان والوقت
  settings: {
    allowedTopics: [{
      type: String,
      enum: ['دين', 'علوم', 'لغة عربية', 'تاريخ', 'طبيعة', 'مغامرات', 'فضاء']
    }],
    screenTimeLimit: {
      type: Number,
      default: 30
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    }
  },

  // 6. تتبع استهلاك الوقت اليومي
  screenTime: {
    today: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    },
    sessionStart: {
      type: Date,
      default: null
    },
    warningNotified: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true })

const Child = mongoose.model('Child', childSchema)
export default Child
