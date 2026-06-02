import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم الطفل مطلوب'],
    trim: true,
    maxlength: [50, 'اسم الطفل لا يزيد عن 50 حرف']
  },
  age: {
    type: Number,
    required: [true, 'عمر الطفل مطلوب']
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'نوع الطفل مطلوب']
  },
  avatar: {
    type: String,
    default: 'default-child-avatar.png'
  },
  //
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'يجب ربط الطفل بحساب الأب أو الأم']
  }
}, { timestamps: true });

const Child = mongoose.model('Child', childSchema);
export default Child;