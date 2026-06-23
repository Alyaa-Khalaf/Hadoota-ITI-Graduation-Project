import Progress from '../models/Progress.js';
import Child from '../models/Child.js';

const verifyOwnership = async (childId, userId) => {
  const child = await Child.findById(childId);
  if (!child) return { error: 'الطفل غير موجود', status: 404 };
  if (child.parentId.toString() !== userId.toString()) return { error: 'غير مصرح', status: 401 };
  return { ok: true };
};

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
        dailyHistory: [
          { day: 'Sat', points: 0 },
          { day: 'Sun', points: 0 },
          { day: 'Mon', points: 0 },
          { day: 'Tue', points: 0 },
          { day: 'Wed', points: 0 },
          { day: 'Thu', points: 0 },
          { day: 'Fri', points: 0 }
        ]
      });
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

    if (!points || typeof points !== 'number') {
      return res.status(400).json({ success: false, message: 'يجب إرسال النقاط وتكون عبارة عن رقم' });
    }

    let progress = await Progress.findOne({ childId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'سجل تقدم الطفل غير موجود' });
    }

    const daysLookup = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = daysLookup[new Date().getDay()];

    const dayIndex = progress.dailyHistory.findIndex(d => d.day === currentDayName);
    if (dayIndex !== -1) {
      progress.dailyHistory[dayIndex].points += points;
    }

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

export const getWeeklyReport = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const userId = req.user?.id || req.user?._id;

    const { error, status } = await verifyOwnership(childId, userId);
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] });

    const progress = await Progress.findOne({ childId });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'سجل تقدم الطفل غير موجود' });
    }

    res.status(200).json({
      success: true,
      message: 'تم جلب التقرير الأسبوعي بنجاح',
      data: progress.dailyHistory
    });
  } catch (error) { next(error); }
};
