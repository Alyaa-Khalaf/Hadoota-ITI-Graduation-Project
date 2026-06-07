import mongoose from 'mongoose'

const childSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف الأهل مطلوب']
  },
  name: {
    type: String,
    required: [true, 'اسم الطفل مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم لا يزيد عن 50 حرف']
  },
  age: {
    type: Number,
    required: [true, 'عمر الطفل مطلوب'],
    min: [3, 'العمر لا يقل عن 3 سنين'],
    max: [12, 'العمر لا يزيد عن 12 سنة']
  },
  avatar: {
    type: String,
    default: 'default-child.png'
  },
  interests: [{
    type: String,
    enum: ['فضاء', 'حيوانات', 'مغامرات', 'تاريخ', 'علوم', 'دين', 'طبيعة', 'رياضة']
  }],
  learningLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
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
  screenTime: {
    today: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  }
}, { timestamps: true })

const Child = mongoose.model('Child', childSchema)
export default Child
