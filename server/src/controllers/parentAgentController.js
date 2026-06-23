import Child from '../models/Child.js'
import Story from '../models/Story.js'
import Progress from '../models/Progress.js'
import {
  analyzeChildProgress,
  recommendStoryTopics,
  generateWeeklySummary
} from '../services/ai/parentAgent.js'

const verifyParentOwnsChild = async (childId, userId) => {
  const child = await Child.findById(childId)
  if (!child) return { error: 'الطفل غير موجود', status: 404 }
  if (child.parentId.toString() !== userId.toString()) return { error: 'غير مصرح للوصول لبيانات هذا الطفل', status: 401 }
  return { child }
}

// GET /api/parent-agent/:childId/analysis
// Full AI progress analysis for a specific child
export const getChildAnalysis = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { child, error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    const [progress, recentStories] = await Promise.all([
      Progress.findOne({ childId }),
      Story.find({ childId, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(10)
        .select('title topic character educationalValue completedAt')
    ])

    const analysis = await analyzeChildProgress({ child, progress, recentStories })

    res.status(200).json({
      success: true,
      message: 'تم تحليل تقدم الطفل بنجاح',
      data: {
        childId,
        childName: child.name,
        analysis,
        generatedAt: new Date().toISOString()
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/parent-agent/:childId/recommendations
// AI-powered story topic recommendations for the child
export const getTopicRecommendations = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { child, error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    const [progress, recentStories] = await Promise.all([
      Progress.findOne({ childId }),
      Story.find({ childId, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(20)
        .select('topic character title')
    ])

    const recommendations = await recommendStoryTopics({ child, progress, recentStories })

    res.status(200).json({
      success: true,
      message: 'تم توليد التوصيات بنجاح',
      data: {
        childId,
        childName: child.name,
        recommendations,
        generatedAt: new Date().toISOString()
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/parent-agent/:childId/weekly-summary
// AI weekly progress summary report
export const getWeeklySummary = async (req, res, next) => {
  try {
    const { childId } = req.params
    const userId = req.user?.id || req.user?._id

    const { child, error, status } = await verifyParentOwnsChild(childId, userId)
    if (error) return res.status(status).json({ success: false, message: error, data: null, errors: [] })

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const [progress, weeklyStories] = await Promise.all([
      Progress.findOne({ childId }),
      Story.find({
        childId,
        status: 'completed',
        completedAt: { $gte: oneWeekAgo }
      }).select('title topic character educationalValue completedAt')
    ])

    const summary = await generateWeeklySummary({ child, progress, weeklyStories })

    res.status(200).json({
      success: true,
      message: 'تم توليد التقرير الأسبوعي بنجاح',
      data: {
        childId,
        childName: child.name,
        weekPeriod: {
          from: oneWeekAgo.toISOString(),
          to: new Date().toISOString()
        },
        summary,
        generatedAt: new Date().toISOString()
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/parent-agent/overview
// Overview of all children under this parent — quick stats without AI
export const getParentOverview = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id

    const children = await Child.find({ parentId: userId })
    if (children.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'لا يوجد أطفال مسجلين',
        data: { children: [], totalChildren: 0 },
        errors: []
      })
    }

    const childIds = children.map(c => c._id)

    const [progressList, storyCounts] = await Promise.all([
      Progress.find({ childId: { $in: childIds } }),
      Story.aggregate([
        { $match: { childId: { $in: childIds }, status: 'completed' } },
        { $group: { _id: '$childId', count: { $sum: 1 }, lastStory: { $max: '$completedAt' } } }
      ])
    ])

    const progressMap = Object.fromEntries(progressList.map(p => [p.childId.toString(), p]))
    const storyMap = Object.fromEntries(storyCounts.map(s => [s._id.toString(), s]))

    const childrenOverview = children.map(child => {
      const progress = progressMap[child._id.toString()]
      const storyData = storyMap[child._id.toString()]
      return {
        _id: child._id,
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        screenTimeToday: child.screenTime?.today || 0,
        screenTimeLimit: child.settings?.screenTimeLimit || 30,
        totalPoints: progress?.totalPoints || 0,
        level: progress?.level || 1,
        streak: progress?.streak?.current || 0,
        storiesCompleted: storyData?.count || 0,
        lastActivity: storyData?.lastStory || null
      }
    })

    res.status(200).json({
      success: true,
      message: 'تم جلب نظرة عامة على أطفالك',
      data: {
        totalChildren: children.length,
        children: childrenOverview
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}
