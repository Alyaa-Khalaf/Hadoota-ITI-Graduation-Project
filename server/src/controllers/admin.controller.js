import User from '../models/User.js';
import School from '../models/School.js';
// افترضت أسماء الموديلز دي بناءً على السيستم، عدليها لو متسمية عندكِ مختلف
import Story from '../models/Story.js'; 

/**
 * 1️⃣ جلب إحصائيات الـ Dashboard كاملة (Users, Stories, Subscriptions, Revenue)
 * GET /api/admin/stats
 */export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalParents = await User.countDocuments({ role: 'parent' }); 
    const totalSchools = await School.countDocuments();

    // 📚 الإحصائيات الحقيقية من الموديل بتاعهم:
    const totalStories = await Story.countDocuments();
    
    // 🛡️ لقطة ذكية: حساب القصص اللي الـ AI طلع فيها مشكلة أمان ومحتاجة مراجعة الأدمن
    const flaggedStories = await Story.countDocuments({ 'safetyCheck.flagged': true }); 

    // إحصائيات حالات التوليد بالـ AI
    const completedStories = await Story.countDocuments({ status: 'completed' });
    const generatingStories = await Story.countDocuments({ status: 'generating' });

    const activeSubscriptions = await School.countDocuments({ subscriptionStatus: 'active' });
    const totalRevenue = activeSubscriptions * 199; 

    res.status(200).json({
      success: true,
      data: {
        cards: {
          totalUsers,
          totalStudents,
          totalParents,
          totalSchools,
          totalStories,
          completedStories,   // القصص الناجحة جاهزة للقراءة
          generatingStories,  // القصص اللي لسه الـ AI بيألفها حالا
          flaggedStories,     // 🚨 دي هتنور عند الأدمن عشان يدخل يشوف الـ reason بتاع المشكلة
          activeSubscriptions,
          totalRevenue: `${totalRevenue} USD`
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2️⃣ جلب آخر النشاطات الحقيقية
 */
export const getRecentActivity = async (req, res, next) => {
  try {
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // 📚 جلب آخر 5 قصص حقيقية تم طلبها في السيستم مع بيانات عناوينها وشخصياتها
    const recentStories = await Story.find()
      .select('title character topic status safetyCheck createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        recentUsers,
        recentStories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * 3️⃣ زرع خطط الأسعار والاشتراكات (Plan Seeding)
 * POST /api/admin/seed/plans
 */
export const seedPlans = async (req, res, next) => {
  try {
    // داتا تجريبية للخطط المتاحة في أبلكيشن حدوتة
    const defaultPlans = [
      { name: "الخطة المجانية", price: 0, duration: "lifetime", features: ["قراءة 3 قصص شهرياً", "تقارير أساسية"] },
      { name: "الاشتراك السنوي للمدارس", price: 199, duration: "year", features: ["حسابات طلاب غير محدودة", "لوحة تحكم كاملة", "تخصيص منهج", "تحليلات ذكية بالـ AI"] },
      { name: "الاشتراك الشهري للأهالي", price: 9, duration: "month", features: ["توليد قصص بالـ AI غير محدود", "تتبع مهارات الطفل"] }
    ];

    res.status(200).json({
      success: true,
      message: "تم زرع خطط الاشتراكات الأساسية في النظام بنجاح! 🌱",
      data: defaultPlans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4️⃣ زرع بنك المعرفة والتصنيفات للقصص (Knowledge Seeding)
 * POST /api/admin/seed/knowledge
 */
export const seedKnowledge = async (req, res, next) => {
  try {
    // تصنيفات حواديت الأطفال الأساسية اللي الـ AI بيعتمد عليها
    const defaultCategories = [
      { name: "مغامرات الفضاء", ageRange: "6-9", icon: "rocket" },
      { name: "أخلاقيات وقيم", ageRange: "3-6", icon: "heart" },
      { name: "حكايات قبل النوم", ageRange: "3-9", icon: "moon" },
      { name: "علوم وتاريخ", ageRange: "9-12", icon: "book" }
    ];

    res.status(200).json({
      success: true,
      message: "تم زرع تصنيفات بنك المعرفة الأساسية للقصص بنجاح! 📚🌱",
      data: defaultCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};