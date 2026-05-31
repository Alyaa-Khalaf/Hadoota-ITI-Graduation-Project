import mongoose from 'mongoose'

const sceneSchema = new mongoose.Schema({
  order: Number,
  text: String,
  imageUrl: String,
  audioUrl: String,
  choices: [{
    text: String,
    nextScene: Number
  }]
})

const storySchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'معرف الطفل مطلوب']
  },
  character: {
    type: String,
    required: [true, 'الشخصية مطلوبة'],
    enum: ['أسد', 'أميرة', 'رحالة']
  },
  topic: {
    type: String,
    required: [true, 'الموضوع مطلوب']
  },
  title: {
    type: String,
    required: [true, 'عنوان الحدوتة مطلوب']
  },
  scenes: [sceneSchema],
  moralLesson: {
    type: String
  },
  educationalValue: {
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    learningOutcomes: [String]
  },
  safetyCheck: {
    safe: {
      type: Boolean,
      default: true
    },
    flagged: {
      type: Boolean,
      default: false
    },
    reason: String
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  completedAt: Date
}, { timestamps: true })

// Text index للـ search
storySchema.index({ topic: 'text', title: 'text' })

const Story = mongoose.model('Story', storySchema)
export default Story
