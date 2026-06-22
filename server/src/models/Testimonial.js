import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // تأكدي إن اسم الموديل لحسابات المستخدمين عندك هو 'User' أو 'Parent'
    required: [true, 'يجب أن يكون الرأي مرتبطاً بحساب مستخدم حقيقي']
  },
  parentName: { 
    type: String, 
    required: [true, 'اسم ولي الأمر مطلوب'] 
  },
  childName: { 
    type: String 
  },
  avatar: { 
    type: String, 
    default: '👶' 
  },
  rating: { 
    type: Number, 
    required: [true, 'التقييم مطلوب'], 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: [true, 'نص الرأي أو التعليق مطلوب'] 
  },
  isFeatured: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);