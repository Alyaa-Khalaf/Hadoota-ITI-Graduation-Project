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

    // =====================
    // Limits — ده اللي بيتحكم في الـ features فعلياً
    // =====================
    limits: {
      // عدد القصص المتاحة — (-1) يعني unlimited
      storiesCount: {
        type: Number,
        default: 5,
      },
      // عدد الأطفال اللي يقدر الـ parent يضيفهم
      childrenCount: {
        type: Number,
        default: 1,
      },
      // يقدر يشوف المحتوى المميز (premium stories)؟
      hasPremiumContent: {
        type: Boolean,
        default: false,
      },
      // يقدر يحمّل قصص للتشغيل offline؟
      hasDownloads: {
        type: Boolean,
        default: false,
      },
      // يقدر يشوف التقارير التفصيلية للطفل؟
      hasDetailedReports: {
        type: Boolean,
        default: false,
      },
    },

    // =====================
    // Trial settings
    // =====================
    // هل الخطة دي تجربة مجانية؟
    isTrial: {
      type: Boolean,
      default: false,
    },
    // مدة التجربة بالأيام (بتتفعّل لما المستخدم يبدأ الـ trial)
    trialDays: {
      type: Number,
      default: 7,
    },

    // =====================
    // Display fields (للعرض في الـ UI بس)
    // =====================
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