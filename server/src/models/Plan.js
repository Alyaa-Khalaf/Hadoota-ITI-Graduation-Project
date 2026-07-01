import mongoose from 'mongoose';

// خطة اشتراك يديرها الأدمن من لوحة التحكم ويشتريها المستخدم عبر Paymob.
// الـ slug هو المفتاح اللي بيتربط بيه اشتراك المستخدم (User.subscription.plan).
const planSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'الـ slug مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'اسم الخطة مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'سعر الخطة مطلوب'],
      min: [0, 'السعر لا يمكن أن يكون سالباً'],
    },
    currency: {
      type: String,
      default: 'EGP',
    },
    // مدة الاشتراك بالأيام — بتحدد expiresAt بعد الدفع
    durationDays: {
      type: Number,
      required: [true, 'مدة الاشتراك مطلوبة'],
      default: 30,
      min: [1, 'المدة لا تقل عن يوم واحد'],
    },
    features: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      default: '',
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    // الجمهور المستهدف: أولياء الأمور / المدارس / الكل
    audience: {
      type: String,
      enum: ['parent', 'school', 'all'],
      default: 'all',
    },
    // لو false الخطة بتختفي من واجهات المستخدم لكن المشتركين الحاليين يفضلوا
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
