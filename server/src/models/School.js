import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المدرسة مطلوب'],
    trim: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ربط المدرسة بحساب الأدمن اللي سجلها
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true // كود مميز للمدرسة (مثلاً: HADOOTA-1234) الطلاب بيدخلوا بيه
  },
  
  // =============== STRIPE & SUBSCRIPTION ===============
  stripeCustomerId: String,
  stripePriceId: String,
  subscriptionStatus: {
    type: String,
    enum: ['pending', 'active', 'trialing', 'past_due', 'canceled'],
    default: 'pending' // بتبدأ pending لحد ما Stripe webhook يأكد الدفع
  },
  subscriptionExpiresAt: Date,

  // =============== CURRICULUM CUSTOMIZATION ===============
  // هنا بنتحكم إيه الحواديت أو الأقسام المتاحة للمدرسة دي
  customCurriculum: {
    allowedCategories: [String], // مثلاً: ['اخلاقية', 'علمية', 'تاريخية']
    excludedStories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story' // لو المعلم عاوز يحجب حدوتة معينة بالذات
    }]
  }
}, { timestamps: true });

// تكتيك ذكي: إنشاء كود تلقائي للمدرسة قبل الحفظ لو مش موجود
schoolSchema.pre('validate', function(next) {
  if (!this.code) {
    this.code = 'SCH-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

const School = mongoose.model('School', schoolSchema);
export default School;