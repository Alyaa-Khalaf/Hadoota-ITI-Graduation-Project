import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
      maxlength: [50, "الاسم لا يزيد عن 50 حرف"],
    },
    email: {
      type: String,
      required: [true, "الإيميل مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: [8, "الباسورد لا يقل عن 8 أحرف"],
      select: false,
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    googleId: {
      type: String,
      default: null,
      select: false,
    },
    role: {
      type: String,
      enum: ["parent", "admin", "teacher", "student"],
      default: "parent",
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      default: null,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    schoolCode: {
      type: String,
      default: null,
    },
    isPending: {
      type: Boolean,
      default: false,
    },
    subscription: {
      plan: {
        // كان enum ثابت — اتحوّل لـ String عشان الأدمن يقدر يضيف خطط جديدة بأي slug
        type: String,
        default: "free",
      },
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        default: null,
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled"],
        default: "active",
      },
      provider: {
        type: String,
        enum: ["stripe", "paymob"],
        default: "paymob",
      },
      // Paymob fields
      paymobOrderId: String,
      lastTransactionId: String,
      lastReference: String,
      // Legacy Stripe fields (kept for existing rows; unused going forward)
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      expiresAt: Date,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    screenTimeLimitMinutes: {
      type: Number,
      default: 60,
      min: 15,
      max: 480,
    },
    notificationSettings: {
      email: {
        welcome: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: true },
        inactivityReminder: { type: Boolean, default: true },
        screenTimeAlert: { type: Boolean, default: true },
        subscription: { type: Boolean, default: true },
      },
      push: {
        badgeEarned: { type: Boolean, default: true },
        screenTimeLimit: { type: Boolean, default: true },
        weeklyReportReady: { type: Boolean, default: true },
      },
    },
    pushSubscriptions: [
      {
        endpoint: { type: String, required: true },
        keys: {
          p256dh: { type: String, required: true },
          auth: { type: String, required: true },
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  if (!this.password) return   // ← أضف السطر ده
  this.password = await bcrypt.hash(this.password, 12)
})


// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
