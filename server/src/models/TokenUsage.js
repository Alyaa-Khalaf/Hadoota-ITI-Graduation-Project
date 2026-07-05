import mongoose from 'mongoose';

// بيسجّل كل استدعاء لـ AI provider (Gemini/OpenAI) مرتبط بمستخدم معيّن،
// عشان نقدر نحسب استهلاك التوكنز الكلي لكل مستخدم (تكلفة + حدود استخدام)
const tokenUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
    },
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
    provider: {
      type: String,
      enum: ['gemini', 'openai', 'pollinations'],
      required: true,
    },
    // نوع العملية اللي استهلكت التوكنز
    operation: {
      type: String,
      enum: ['story_structure', 'scene_image', 'other'],
      required: true,
    },
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    // للعمليات اللي متسعّرش بالتوكن (زي توليد صور DALL-E أو Pollinations)
    imageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

tokenUsageSchema.index({ userId: 1, createdAt: -1 });

const TokenUsage = mongoose.model('TokenUsage', tokenUsageSchema);
export default TokenUsage;