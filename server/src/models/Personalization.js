import mongoose from 'mongoose'; // ✅ تعديل الـ Import

const PersonalizationSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
    unique: true 
  },
  favoriteCharacters: [{
    type: String,
    trim: true
  }],
  favoriteTopics: [{
    type: String,
    trim: true
  }],
  preferredStoryLength: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium'
  },
  vocabularyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 1 
  },
  storiesListenedCount: {
    type: Number,
    default: 0 
  }
}, { timestamps: true });

export default mongoose.model('Personalization', PersonalizationSchema); // ✅ تعديل الـ Export