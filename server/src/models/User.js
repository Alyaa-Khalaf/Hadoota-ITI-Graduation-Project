import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم لا يزيد عن 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'الإيميل مطلوب'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'الباسورد مطلوب'],
    minlength: [8, 'الباسورد لا يقل عن 8 أحرف'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['parent', 'admin'],
    default: 'parent'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'family', 'schools'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    expiresAt: Date
  },
  refreshToken: {
    type: String,
    default: null,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
