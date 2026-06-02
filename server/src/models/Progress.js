import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
 
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'يجب تحديد الـ childId التابع له هذا التقدم'],
    unique: true 
  },
 
  totalPoints: {
    type: Number,
    default: 0 
  },
  // 
  level: {
    type: Number,
    default: 1
  },
  //
  dailyHistory: [
    {
      day: { type: String, required: true }, // مثل: "Sun", "Mon", "Tue"
      points: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;