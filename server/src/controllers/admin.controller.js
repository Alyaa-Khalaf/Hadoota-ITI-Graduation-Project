import User from '../models/User.js';
import School from '../models/School.js';
import Story from '../models/Story.js';
import Child from '../models/Child.js';
import Quiz from '../models/Quiz.js';
import KnowledgeBase from '../models/KnowledgeBase.js';
import QuizSubmission from '../models/quizSubmissionModel.js';
import Gamification from '../models/gamificationModel.js';
import Transaction from '../models/Transaction.js';
import Plan from '../models/Plan.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { syncTransactionsFromUsers } from '../services/transactionService.js';
import { getUsageSummaryByUser, getUsageByUserId } from '../services/tokenUsageService.js';

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
      revenueAgg,
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
      // الإيرادات الفعلية: مجموع مبالغ المعاملات الناجحة (بالجنيه المصري)
      Transaction.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

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
    const { search, gender } = req.query;

    const filter = {};
    if (gender) filter.gender = gender;
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
    const { search, subscriptionStatus } = req.query;

    const filter = {};
    if (subscriptionStatus) filter.subscriptionStatus = subscriptionStatus;
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

const shapeTransaction = (t) => ({
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
});

export const listTransactions = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search, status, plan } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (plan) filter.plan = plan;

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

    const shaped = items.map(shapeTransaction);

    return sendSuccess(res, 200, 'تم جلب المعاملات', paginated(shaped, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب المعاملات', [error.message]);
  }
};

export const getTransaction = async (req, res) => {
  try {
    const t = await Transaction.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('schoolId', 'name code')
      .lean();
    if (!t) return sendError(res, 404, 'المعاملة غير موجودة');
    return sendSuccess(res, 200, 'تم جلب المعاملة', shapeTransaction(t));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب المعاملة', [error.message]);
  }
};

export const syncTransactions = async (req, res) => {
  try {
    const synced = await syncTransactionsFromUsers();
    return sendSuccess(res, 200, 'تمت مزامنة المعاملات من سجلات الدفع', { synced });
  } catch (error) {
    return sendError(res, 500, 'فشل مزامنة المعاملات', [error.message]);
  }
};

export const getKnowledgeCategories = async (req, res) => {
  try {
    const categories = await KnowledgeBase.distinct('category');
    return sendSuccess(res, 200, 'تم جلب التصنيفات', categories.filter(Boolean).sort());
  } catch (error) {
    return sendError(res, 500, 'فشل جلب التصنيفات', [error.message]);
  }
};

// ============================================================
// 💳 PLANS CRUD (خطط الاشتراك التي يديرها الأدمن)
// ============================================================

export const listPlans = async (req, res) => {
  try {
    const { page, limit, skip } = getPaging(req);
    const { search, audience, isActive } = req.query;

    const filter = {};
    if (audience) filter.audience = audience;
    if (isActive === 'true') filter.isActive = true;
    if (isActive === 'false') filter.isActive = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Plan.find(filter).sort({ sortOrder: 1, price: 1 }).skip(skip).limit(limit).lean(),
      Plan.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'تم جلب الخطط', paginated(items, total, page, limit));
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الخطط', [error.message]);
  }
};

export const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) return sendError(res, 404, 'الخطة غير موجودة');
    return sendSuccess(res, 200, 'تم جلب الخطة', plan);
  } catch (error) {
    return sendError(res, 500, 'فشل جلب الخطة', [error.message]);
  }
};

export const createPlan = async (req, res) => {
  try {
    const { slug, name, price, durationDays } = req.body;
    if (!slug || !name || price === undefined || durationDays === undefined) {
      return sendError(res, 400, 'الـ slug والاسم والسعر والمدة مطلوبين');
    }

    const normalizedSlug = String(slug).toLowerCase().trim();
    const exists = await Plan.findOne({ slug: normalizedSlug });
    if (exists) return sendError(res, 409, 'يوجد خطة بنفس الـ slug بالفعل');

    const plan = await Plan.create({ ...req.body, slug: normalizedSlug });
    return sendSuccess(res, 201, 'تم إنشاء الخطة', plan);
  } catch (error) {
    return sendError(res, 500, 'فشل إنشاء الخطة', [error.message]);
  }
};

export const updatePlan = async (req, res) => {
  try {
    const allowed = [
      'name', 'description', 'price', 'currency', 'durationDays',
      'features', 'badge', 'highlight', 'audience', 'isActive', 'sortOrder',
      'isTrial', 'trialDays',
    ];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    // limits عبارة عن object متداخل — لازم نتعامل معاه بشكل منفصل
    // عشان لو الفرونت بعت limits جزئي منمسحش باقي القيم اللي مبعتتش
    if (req.body.limits !== undefined) {
      const allowedLimits = [
        'storiesCount', 'childrenCount', 'hasPremiumContent', 'hasDownloads', 'hasDetailedReports',
      ];
      for (const key of allowedLimits) {
        if (req.body.limits[key] !== undefined) {
          update[`limits.${key}`] = req.body.limits[key];
        }
      }
    }

    // السماح بتعديل الـ slug مع التحقق من عدم التكرار
    if (req.body.slug !== undefined) {
      const normalizedSlug = String(req.body.slug).toLowerCase().trim();
      const clash = await Plan.findOne({ slug: normalizedSlug, _id: { $ne: req.params.id } });
      if (clash) return sendError(res, 409, 'يوجد خطة بنفس الـ slug بالفعل');
      update.slug = normalizedSlug;
    }

    const plan = await Plan.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!plan) return sendError(res, 404, 'الخطة غير موجودة');
    return sendSuccess(res, 200, 'تم تحديث الخطة', plan);
  } catch (error) {
    return sendError(res, 500, 'فشل تحديث الخطة', [error.message]);
  }
};

export const deletePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await Plan.findById(planId);
    if (!plan) return sendError(res, 404, 'الخطة غير موجودة');

    // منع الحذف لو فيه مستخدمين مشتركين في الخطة دي — يُفضّل التعطيل بدل الحذف
    const subscribers = await User.countDocuments({ 'subscription.planId': planId });
    if (subscribers > 0) {
      return sendError(
        res,
        400,
        `لا يمكن حذف الخطة — يوجد ${subscribers} مشترك بها. عطّلها (isActive=false) بدلاً من الحذف.`
      );
    }

    await Plan.findByIdAndDelete(planId);
    return sendSuccess(res, 200, 'تم حذف الخطة');
  } catch (error) {
    return sendError(res, 500, 'فشل حذف الخطة', [error.message]);
  }
};

// ============================================================
// 🔢 TOKEN USAGE (استهلاك الـ AI tokens لكل مستخدم)
// ============================================================

export const getTokenUsageSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const summary = await getUsageSummaryByUser({ from, to });
    return sendSuccess(res, 200, 'تم جلب ملخص استهلاك التوكنز', summary);
  } catch (error) {
    return sendError(res, 500, 'فشل جلب استهلاك التوكنز', [error.message]);
  }
};

export const getTokenUsageForUser = async (req, res) => {
  try {
    const { page, limit } = getPaging(req);
    const result = await getUsageByUserId(req.params.id, { page, limit });
    return sendSuccess(res, 200, 'تم جلب استهلاك المستخدم', result);
  } catch (error) {
    return sendError(res, 500, 'فشل جلب استهلاك المستخدم', [error.message]);
  }
};

// ============================================================
// 🌱 SEEDING (الموجود مسبقاً)
// ============================================================

export const seedPlans = async (req, res) => {
  try {
    // الخطط الافتراضية — تُزرع في مجموعة Plan لو مش موجودة (idempotent)
    const defaultPlans = [
      {
        slug: 'pro', name: 'خطة Pro', price: 149, durationDays: 30, audience: 'parent',
        badge: 'الأكثر شعبية 🔥', highlight: true, sortOrder: 1,
        description: 'كل المميزات لطفل واحد',
        features: ['توليد قصص بالـ AI غير محدود', 'تتبع مهارات الطفل', 'تقارير أسبوعية ذكية'],
      },
      {
        slug: 'family', name: 'خطة العائلة', price: 249, durationDays: 30, audience: 'parent',
        sortOrder: 2, description: 'حتى 4 أطفال + تقارير متقدمة',
        features: ['كل مميزات Pro', 'حتى 4 حسابات أطفال', 'تقارير عائلية مقارنة'],
      },
      {
        slug: 'schools', name: 'خطة المدارس', price: 4999, durationDays: 365, audience: 'school',
        sortOrder: 3, description: 'اشتراك سنوي للمدارس',
        features: ['حسابات طلاب غير محدودة', 'لوحة تحكم كاملة', 'تخصيص منهج', 'تحليلات ذكية بالـ AI'],
      },
    ];

    let created = 0;
    for (const p of defaultPlans) {
      const result = await Plan.updateOne(
        { slug: p.slug },
        { $setOnInsert: p },
        { upsert: true }
      );
      if (result.upsertedCount) created += 1;
    }

    const all = await Plan.find().sort({ sortOrder: 1 }).lean();
    return sendSuccess(res, 200, `تم زرع الخطط (${created} جديدة)`, all);
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