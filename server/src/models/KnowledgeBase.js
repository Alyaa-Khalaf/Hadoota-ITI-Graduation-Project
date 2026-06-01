import mongoose from 'mongoose'

const knowledgeBaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'العنوان مطلوب'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'المحتوى مطلوب']
  },
  category: {
    type: String,
    required: [true, 'التصنيف مطلوب'],
    enum: [
      'قصص أطفال',
      'قرآن كريم',
      'مناهج رياض أطفال',
      'معلومات علمية',
      'تاريخ إسلامي',
      'قيم وأخلاق'
    ]
  },
  ageRange: {
    min: {
      type: Number,
      default: 3
    },
    max: {
      type: Number,
      default: 12
    }
  },
  tags: [String],
  lang: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar'
  },
  embedding: {
    type: [Number],
    default: undefined
  },
  source: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Vector Search Index
// knowledgeBaseSchema.index({ embedding: '2dsphere' })

// Text Index للـ keyword search
// knowledgeBaseSchema.index({ title: 1, content: 1, tags: 1 })

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema)
export default KnowledgeBase
