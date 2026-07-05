/**
 * Migration: fixUserPlanIds.js
 * ────────────────────────────
 * بتصلح كل الـ users اللي planId فاضي عندهم
 * عن طريق ربطهم بالـ Plan الموجود في الـ DB بناءً على الـ slug
 *
 * الاستخدام:
 *   node server/src/scripts/fixUserPlanIds.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Plan from '../models/Plan.js'

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  // جيب كل الـ plans من الـ DB كـ map: slug → _id
  const plans = await Plan.find().select('_id slug')
  const planMap = {}
  for (const p of plans) {
    planMap[p.slug] = p._id
  }

  console.log('📋 Plans found:', Object.keys(planMap))

  // جيب كل الـ users اللي planId فاضي
  const users = await User.find({ 'subscription.planId': null }).select('_id subscription')
  console.log(`👥 Users to fix: ${users.length}`)

  let fixed = 0
  let skipped = 0

  for (const user of users) {
    const slug = user.subscription?.plan || 'free'
    const planId = planMap[slug]

    if (!planId) {
      console.warn(`⚠️  Plan slug "${slug}" not found in DB — skipping user ${user._id}`)
      skipped++
      continue
    }

    await User.findByIdAndUpdate(user._id, {
      'subscription.planId': planId,
      'subscription.status': 'active',
    })

    fixed++
  }

  console.log(`\n🎉 Done!`)
  console.log(`   ✅ Fixed:   ${fixed}`)
  console.log(`   ⚠️  Skipped: ${skipped}`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})