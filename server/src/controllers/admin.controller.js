import User from '../models/User.js';
import School from '../models/School.js';
import Story from '../models/Story.js';
import Child from '../models/Child.js';
import Quiz from '../models/Quiz.js';
import KnowledgeBase from '../models/KnowledgeBase.js';
import QuizSubmission from '../models/quizSubmissionModel.js';
import Gamification from '../models/gamificationModel.js';
import Transaction from '../models/Transaction.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ============================================================
// Helpers
// ============================================================

// قراءة باراميترات التقسيم لصفحات (pagination) من الـ query بشكل آمن
const getPaging = (req) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// تغليف النتيجة المقسّمة بشكل موحّد عشان الـ DataTable في الفرونت يقراها
const paginated = (items, total, page, limit) => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
});

// ============================================================
// 📊 STATS & ACTIVITY (الموجود مسبقاً — مع توحيد شكل الـ response)
// ============================================================

/**
 * GET /api/admin/stats
 * إحصائيات الـ Dashboard كاملة
 */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalParents,
      totalTeachers,
      totalSchools,
      totalChildren,
      totalStories,
      flaggedStories,
      completedStories,
      generatingStories,
      totalQuizzes,
      totalKnowledge,
      activeSubscriptions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'parent' }),
      User.countDocuments({ role: 'teacher' }),
      School.countDocuments(),
      Child.countDocuments(),
      Story.countDocuments(),
      Story.countDocuments({ 'safetyCheck.flagged': true }),
      Story.countDocuments({ status: 'completed' }),
      Story.countDocuments({ status: 'generating' }),
      Quiz.countDocuments(),
      KnowledgeBase.countDocuments(),
      School.countDocuments({ subscriptionStatus: 'active' }),
    ]);

    const totalRevenue = activeSubscriptions * 199;

    return sendSuccess(res, 200, 'تم جلب الإحصائيات بنجاح', {
      cards: {
        totalUsers,
        totalStudents,
        totalParents,
        totalTeachers,
        totalSchools,
        totalChildren,
        totalStories,
        completedStories,
        generatingStories,
        flaggedStories,
        totalQuizzes,
        totalKnowledge,
        activeSubscriptions,
        totalRevenue,
      },
    });
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الإحصائيات', [error.message]);
  }
};

/**
 * GET /api/admin/recent-activity
 * آخر النشاطات + داتا للرسوم البيانية
 */
export const getRecentActivity = async (req, res) => {
  try {
    const [recentUsers, recentStories, storyStatusAgg] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).limit(5).lean(),
      Story.find()
        .select('title character topic status safetyCheck createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Story.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    // توزيع حالات القصص للرسم الدائري (pie chart)
    const storyStatus = storyStatusAgg.map((s) => ({
      name: s._id || 'unknown',
      value: s.count,
    }));

    return sendSuccess(res, 200, 'تم جلب آخر النشاطات', {
      recentUsers,
      recentStories,
      storyStatus,
    });
  } catch (error) {
    return sendError(res, 500, 'فشل جلب النشاطات', [error.message]);
  }
};

// ============================================================
// 👥 USERS CRUD
// ============================================================

export const listUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search, role } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'تم جلب المستخدمين', paginated(items, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب المستخدمين', [error.message]);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return sendError(res, 404, 'المستخدم غير موجود');
    return sendSuccess(res, 200, 'تم جلب المستخدم', user);
  } catch (error) {
    return sendError(res, 500, 'فشل جلب المستخدم', [error.message]);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 400, 'الاسم والإيميل والباسورد مطلوبين');
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return sendError(res, 409, 'الإيميل مستخدم بالفعل');

    const user = await User.create({ name, email, password, role: role || 'parent' });
    const safe = user.toObject();
    delete safe.password;
    return sendSuccess(res, 201, 'تم إنشاء المستخدم', safe);
  } catch (error) {
    return sendError(res, 500, 'فشل إنشاء المستخدم', [error.message]);
  }
};

export const updateUser = async (req, res) => {
  try {
    // الحقول المسموح للأدمن يعدلها فقط (مفيش password هنا)
    const allowed = ['name', 'email', 'role', 'isPending', 'subscription', 'schoolId'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return sendError(res, 404, 'المستخدم غير موجود');
    return sendSuccess(res, 200, 'تم تحديث المستخدم', user);
  } catch (error) {
    return sendError(res, 500, 'فشل تحديث المستخدم', [error.message]);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // منع الأدمن من حذف نفسه بالغلط
    const selfId = req.user?.id || req.user?.userId || req.user?._id;
    if (selfId && selfId.toString() === userId.toString()) {
      return sendError(res, 400, 'لا يمكنك حذف حسابك الخاص من هنا');
    }

    const user = await User.findById(userId);
    if (!user) return sendError(res, 404, 'المستخدم غير موجود');

    // حذف متسلسل: أطفال المستخدم وكل ما يتعلق بهم
    const children = await Child.find({ parentId: userId }).select('_id');
    const childIds = children.map((c) => c._id);

    await Promise.all([
      Story.deleteMany({ childId: { $in: childIds } }),
      Quiz.deleteMany({ childId: { $in: childIds } }),
      QuizSubmission.deleteMany({ childId: { $in: childIds } }),
      Gamification.deleteMany({ childId: { $in: childIds } }),
      Child.deleteMany({ parentId: userId }),
      User.findByIdAndDelete(userId),
    ]);

    return sendSuccess(res, 200, 'تم حذف المستخدم وكل بياناته المرتبطة');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف المستخدم', [error.message]);
  }
};

// ============================================================
// 🧒 CHILDREN CRUD
// ============================================================

export const listChildren = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      Child.find(filter)
        .populate('parentId', 'name email')
        .populate('schoolId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Child.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'تم جلب الأطفال', paginated(items, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الأطفال', [error.message]);
  }
};

export const getChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id)
      .populate('parentId', 'name email')
      .populate('schoolId', 'name code')
      .lean();
    if (!child) return sendError(res, 404, 'الطفل غير موجود');
    return sendSuccess(res, 200, 'تم جلب الطفل', child);
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الطفل', [error.message]);
  }
};

export const updateChild = async (req, res) => {
  try {
    const allowed = ['name', 'age', 'gender', 'avatar', 'interests', 'learningLevel', 'settings', 'schoolId'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const child = await Child.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!child) return sendError(res, 404, 'الطفل غير موجود');
    return sendSuccess(res, 200, 'تم تحديث الطفل', child);
  } catch (error) {
    return sendError(res, 500, 'فشل تحديث الطفل', [error.message]);
  }
};

export const deleteChild = async (req, res) => {
  try {
    const childId = req.params.id;
    const child = await Child.findById(childId);
    if (!child) return sendError(res, 404, 'الطفل غير موجود');

    await Promise.all([
      Story.deleteMany({ childId }),
      Quiz.deleteMany({ childId }),
      QuizSubmission.deleteMany({ childId }),
      Gamification.deleteMany({ childId }),
      Child.findByIdAndDelete(childId),
    ]);

    return sendSuccess(res, 200, 'تم حذف الطفل وكل بياناته المرتبطة');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف الطفل', [error.message]);
  }
};

// ============================================================
// 📚 STORIES CRUD + MODERATION
// ============================================================

export const listStories = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search, status, flagged } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (flagged === 'true') filter['safetyCheck.flagged'] = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Story.find(filter)
        .populate('childId', 'name age')
        .select('title character topic status safetyCheck isFavorite createdAt childId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Story.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'تم جلب الحواديت', paginated(items, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الحواديت', [error.message]);
  }
};

export const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('childId', 'name age').lean();
    if (!story) return sendError(res, 404, 'الحدوتة غير موجودة');
    return sendSuccess(res, 200, 'تم جلب الحدوتة', story);
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الحدوتة', [error.message]);
  }
};

export const updateStory = async (req, res) => {
  try {
    // الأدمن بيعدّل الميتاداتا والمراجعة (moderation) بس مش يعيد توليد المشاهد
    const { title, topic, status, safetyCheck } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (topic !== undefined) update.topic = topic;
    if (status !== undefined) update.status = status;
    if (safetyCheck !== undefined) update.safetyCheck = safetyCheck;

    const story = await Story.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!story) return sendError(res, 404, 'الحدوتة غير موجودة');
    return sendSuccess(res, 200, 'تم تحديث الحدوتة', story);
  } catch (error) {
    return sendError(res, 500, 'فشل تحديث الحدوتة', [error.message]);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);
    if (!story) return sendError(res, 404, 'الحدوتة غير موجودة');

    await Promise.all([Quiz.deleteMany({ storyId }), Story.findByIdAndDelete(storyId)]);
    return sendSuccess(res, 200, 'تم حذف الحدوتة');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف الحدوتة', [error.message]);
  }
};

// ============================================================
// 🏫 SCHOOLS CRUD
// ============================================================

export const listSchools = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      School.find(filter).populate('adminId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      School.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'تم جلب المدارس', paginated(items, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب المدارس', [error.message]);
  }
};

export const createSchool = async (req, res) => {
  try {
    const { name, adminId, code, subscriptionStatus } = req.body;
    if (!name) return sendError(res, 400, 'اسم المدرسة مطلوب');

    // لو مفيش adminId اتبعت، اربط المدرسة بالأدمن الحالي
    const owner = adminId || req.user?.id || req.user?.userId || req.user?._id;
    if (!owner) return sendError(res, 400, 'مدير المدرسة مطلوب');

    const school = await School.create({
      name,
      adminId: owner,
      ...(code && { code }),
      ...(subscriptionStatus && { subscriptionStatus }),
    });
    return sendSuccess(res, 201, 'تم إنشاء المدرسة', school);
  } catch (error) {
    return sendError(res, 500, 'فشل إنشاء المدرسة', [error.message]);
  }
};

export const updateSchool = async (req, res) => {
  try {
    const allowed = ['name', 'code', 'subscriptionStatus', 'subscriptionExpiresAt', 'customCurriculum'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const school = await School.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!school) return sendError(res, 404, 'المدرسة غير موجودة');
    return sendSuccess(res, 200, 'تم تحديث المدرسة', school);
  } catch (error) {
    return sendError(res, 500, 'فشل تحديث المدرسة', [error.message]);
  }
};

export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return sendError(res, 404, 'المدرسة غير موجودة');
    // فك ارتباط الطلاب بالمدرسة بدل حذفهم
    await Child.updateMany({ schoolId: req.params.id }, { schoolId: null });
    return sendSuccess(res, 200, 'تم حذف المدرسة');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف المدرسة', [error.message]);
  }
};

// ============================================================
// 📝 QUIZZES (list + delete)
// ============================================================

export const listQuizzes = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);

    const [items, total] = await Promise.all([
      Quiz.find()
        .populate('storyId', 'title')
        .populate('childId', 'name')
        .select('storyId childId questions bestScore createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Quiz.countDocuments(),
    ]);

    // نرجّع عدد الأسئلة بدل المصفوفة الكاملة عشان الجدول
    const shaped = items.map((q) => ({
      _id: q._id,
      story: q.storyId,
      child: q.childId,
      questionsCount: q.questions?.length || 0,
      bestScore: q.bestScore,
      createdAt: q.createdAt,
    }));

    return sendSuccess(res, 200, 'تم جلب الاختبارات', paginated(shaped, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الاختبارات', [error.message]);
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return sendError(res, 404, 'الاختبار غير موجود');
    return sendSuccess(res, 200, 'تم حذف الاختبار');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف الاختبار', [error.message]);
  }
};

// ============================================================
// 🧠 KNOWLEDGE BASE CRUD
// ============================================================

export const listKnowledge = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search, category } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      KnowledgeBase.find(filter).select('-embedding').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      KnowledgeBase.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'تم جلب بنك المعرفة', paginated(items, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب بنك المعرفة', [error.message]);
  }
};

export const createKnowledge = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return sendError(res, 400, 'العنوان والمحتوى والتصنيف مطلوبين');
    }
    const entry = await KnowledgeBase.create(req.body);
    return sendSuccess(res, 201, 'تمت إضافة المعرفة', entry);
  } catch (error) {
    return sendError(res, 500, 'فشل إضافة المعرفة', [error.message]);
  }
};

export const updateKnowledge = async (req, res) => {
  try {
    const allowed = ['title', 'content', 'category', 'ageRange', 'tags', 'lang', 'source', 'isActive'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const entry = await KnowledgeBase.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select('-embedding');
    if (!entry) return sendError(res, 404, 'المعرفة غير موجودة');
    return sendSuccess(res, 200, 'تم تحديث المعرفة', entry);
  } catch (error) {
    return sendError(res, 500, 'فشل تحديث المعرفة', [error.message]);
  }
};

export const deleteKnowledge = async (req, res) => {
  try {
    const entry = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!entry) return sendError(res, 404, 'المعرفة غير موجودة');
    return sendSuccess(res, 200, 'تم حذف المعرفة');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف المعرفة', [error.message]);
  }
};

// ============================================================
// 💳 TRANSACTIONS
// ============================================================

export const listTransactions = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');

      const schools = await School.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      filter.$or = [
        { userId: { $in: users.map((u) => u._id) } },
        { schoolId: { $in: schools.map((s) => s._id) } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Transaction.find(filter)
        .populate('userId', 'name email role')
        .populate('schoolId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    const shaped = items.map((t) => ({
      _id: t._id,
      user: t.userId
        ? { _id: t.userId._id, name: t.userId.name, email: t.userId.email, role: t.userId.role }
        : null,
      school: t.schoolId
        ? { _id: t.schoolId._id, name: t.schoolId.name, code: t.schoolId.code }
        : null,
      amount: t.amount,
      currency: t.currency,
      plan: t.plan,
      status: t.status,
      description: t.description,
      provider: t.provider,
      paymobTransactionId: t.paymobTransactionId,
      paymobOrderId: t.paymobOrderId,
      reference: t.reference,
      createdAt: t.createdAt,
    }));

    return sendSuccess(res, 200, 'تم جلب المعاملات', paginated(shaped, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب المعاملات', [error.message]);
  }
};

// ============================================================
// 🌱 SEEDING (الموجود مسبقاً)
// ============================================================

export const seedPlans = async (req, res) => {
  try {
    const defaultPlans = [
      { name: 'الخطة المجانية', price: 0, duration: 'lifetime', features: ['قراءة 3 قصص شهرياً', 'تقارير أساسية'] },
      { name: 'الاشتراك السنوي للمدارس', price: 199, duration: 'year', features: ['حسابات طلاب غير محدودة', 'لوحة تحكم كاملة', 'تخصيص منهج', 'تحليلات ذكية بالـ AI'] },
      { name: 'الاشتراك الشهري للأهالي', price: 9, duration: 'month', features: ['توليد قصص بالـ AI غير محدود', 'تتبع مهارات الطفل'] },
    ];
    return sendSuccess(res, 200, 'تم زرع خطط الاشتراكات بنجاح', defaultPlans);
  } catch (error) {
    return sendError(res, 500, 'فشل زرع الخطط', [error.message]);
  }
};

export const seedKnowledge = async (req, res) => {
  try {
    const defaultCategories = [
      { name: 'مغامرات الفضاء', ageRange: '6-9', icon: 'rocket' },
      { name: 'أخلاقيات وقيم', ageRange: '3-6', icon: 'heart' },
      { name: 'حكايات قبل النوم', ageRange: '3-9', icon: 'moon' },
      { name: 'علوم وتاريخ', ageRange: '9-12', icon: 'book' },
    ];
    return sendSuccess(res, 200, 'تم زرع تصنيفات بنك المعرفة بنجاح', defaultCategories);
  } catch (error) {
    return sendError(res, 500, 'فشل زرع التصنيفات', [error.message]);
  }
};
