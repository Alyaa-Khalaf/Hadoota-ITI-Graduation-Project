import Progress from '../models/Progress.js';
import Child from '../models/Child.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000
const HISTORY_KEEP_DAYS = 90 // نحتفظ بآخر 90 يوم بس عشان الـ document ميكبرش أوي

const getMidnight = (d = new Date()) => {
  const midnight = new Date(d)
  midnight.setHours(0, 0, 0, 0)
  return midnight
}

// بداية الأسبوع الحالي — نفس اتفاقية screenTime: الأسبوع يبدأ يوم السبت
const getWeekStart = (d = new Date(), startDay = 6) => {
  const midnight = getMidnight(d)
  const day = midnight.getDay() // 0 = أحد ... 6 = سبت
  const diff = (day - startDay + 7) % 7
  midnight.setDate(midnight.getDate() - diff)
  return midnight
}

const verifyOwnership = async (childId, userId) => {
  const child = await Child.findById(childId);
  if (!child) return { error: 'الطفل غير موجود', status: 404 };
  if (child.parentId.toString() !== userId.toString()) return { error: 'غير مصرح', status: 401 };
  return { ok: true };
};

// تتأكد إن فيه entry بتاريخ النهاردة في dailyHistory (لو مفيش تعمله)
// ده اللي بيمنع تراكم النقط بين الأسابيع، لأن كل يوم بقى بتاريخه الحقيقي مش باسمه بس
const syncDailyHistory = (progress) => {
  const today = getMidnight()
  const exists = progress.dailyHistory.some(
    h => getMidnight(h.date).getTime() === today.getTime()
  )

  if (!exists) {
    progress.dailyHistory.push({ date: today, points: 0 })
  }

  // تنضيف: امسح أي history أقدم من HISTORY_KEEP_DAYS
  const cutoff = new Date(Date.now() - HISTORY_KEEP_DAYS * MS_PER_DAY)
  progress.dailyHistory = progress.dailyHistory.filter(h => h.date >= cutoff)
}

export const getProgress = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const userId = req.user?.id || req.user?._id;

    const { error, status } = await verifyOwnership(childId, userId);
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] });

    let progress = await Progress.findOne({ childId });

    if (!progress) {
      progress = await Progress.create({
        childId,
        totalPoints: 0,
        level: 1,
        dailyHistory: [{ date: getMidnight(), points: 0 }]
      });
    } else {
      syncDailyHistory(progress)
      if (progress.isModified()) await progress.save()
    }

    res.status(200).json({
      success: true,
      message: 'تم جلب تقدم الطفل بنجاح',
      data: progress
    });
  } catch (error) { next(error); }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { points } = req.body;
    const userId = req.user?.id || req.user?._id;

    const { error, status } = await verifyOwnership(childId, userId);
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] });

    if (typeof points !== 'number' || Number.isNaN(points)) {
      return res.status(400).json({ success: false, message: 'يجب إرسال النقاط وتكون عبارة عن رقم' });
    }

    let progress = await Progress.findOne({ childId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'سجل تقدم الطفل غير موجود' });
    }

    syncDailyHistory(progress)

    const today = getMidnight()
    const todayEntry = progress.dailyHistory.find(
      h => getMidnight(h.date).getTime() === today.getTime()
    )
    if (todayEntry) todayEntry.points += points

    progress.totalPoints += points;
    progress.level = Math.floor(progress.totalPoints / 100) + 1;

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث تقدم الطفل بنجاح وجاري رفع المستوى تلقائياً',
      data: progress
    });
  } catch (error) { next(error); }
};

// GET /api/progress/:childId/today
// تقرير النقاط بتاعت النهاردة بس (منفصل عن الملخص العام)
export const getTodayProgress = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const userId = req.user?.id || req.user?._id;

    const { error, status } = await verifyOwnership(childId, userId);
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] });

    let progress = await Progress.findOne({ childId });

    if (!progress) {
      return res.status(200).json({
        success: true,
        message: 'لا يوجد نشاط لهذا الطفل بعد',
        data: { date: getMidnight(), points: 0, totalPoints: 0, level: 1 }
      });
    }

    syncDailyHistory(progress)
    if (progress.isModified()) await progress.save()

    const today = getMidnight()
    const todayEntry = progress.dailyHistory.find(
      h => getMidnight(h.date).getTime() === today.getTime()
    )

    res.status(200).json({
      success: true,
      message: 'تم جلب تقدم اليوم بنجاح',
      data: {
        date: today,
        points: todayEntry?.points ?? 0,
        totalPoints: progress.totalPoints,
        level: progress.level
      }
    });
  } catch (error) { next(error); }
};

// GET /api/progress/:childId/weekly
export const getWeeklyReport = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const userId = req.user?.id || req.user?._id;

    const { error, status } = await verifyOwnership(childId, userId);
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] });

    let progress = await Progress.findOne({ childId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'سجل تقدم الطفل غير موجود' });
    }

    syncDailyHistory(progress)
    if (progress.isModified()) await progress.save()

    const weekStart = getWeekStart()

    // ابني السبع أيام كاملة (حتى لو مفيش نشاط = صفر)
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      days.push({ date: d, points: 0 })
    }

    progress.dailyHistory
      .filter(h => h.date >= weekStart)
      .forEach(h => {
        const entry = days.find(d => d.date.getTime() === getMidnight(h.date).getTime())
        if (entry) entry.points = h.points
      })

    const weekTotal = days.reduce((sum, d) => sum + d.points, 0)

    res.status(200).json({
      success: true,
      message: 'تم جلب التقرير الأسبوعي بنجاح',
      data: { weekStart, weekTotal, days }
    });
  } catch (error) { next(error); }
};