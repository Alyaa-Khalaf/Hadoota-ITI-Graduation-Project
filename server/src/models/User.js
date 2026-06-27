import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم لا يزيد عن 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'الإيميل مطلوب'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'الباسورد مطلوب'],
    minlength: [8, 'الباسورد لا يقل عن 8 أحرف'],
    select: false
  },
  avatar: {
    type: String,
    default: '👨‍💼'
  },
  role: {
    type: String,
    enum: ['parent', 'admin','teacher', 'student'],
    default: 'parent'
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    default: null
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    default: null
  },
  schoolCode: {
    type: String,
    default: null
  },
  isPending: {
    type: Boolean,
    default: false
  },
  // 🆕 الطفل النشط حاليًا لهذا الأب — يُحفظ بشكل دائم في الداتابيز
  // عشان يفضل ثابت بعد الـ refresh أو تسجيل الدخول من جهاز/متصفح تاني
  activeChildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    default: null
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'family', 'schools'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    expiresAt: Date
  },
  refreshToken: {
    type: String,
    default: null,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  screenTimeLimitMinutes: {
    type: Number,
    default: 60,
    min: 15,
    max: 480
  },
  notificationSettings: {
    email: {
      welcome: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true },
      inactivityReminder: { type: Boolean, default: true },
      screenTimeAlert: { type: Boolean, default: true },
      subscription: { type: Boolean, default: true }
    },
    push: {
      badgeEarned: { type: Boolean, default: true },
      screenTimeLimit: { type: Boolean, default: true },
      weeklyReportReady: { type: Boolean, default: true }
    }
  },
  pushSubscriptions: [{
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User