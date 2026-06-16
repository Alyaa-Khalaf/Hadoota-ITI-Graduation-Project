import Story from '../models/Story.js'
import Child from '../models/Child.js'
import Personalization from '../models/Personalization.js' 
import Progress from '../models/Progress.js'
import { orchestrateStoryGeneration } from '../services/ai/orchestrator.js'
import { io } from '../index.js'
import { getCachedStory, cacheStory } from '../config/redis.js'

// Helper function لتحديث بيانات التخصيص تلقائياً بعد اكتمال الحدوتة الحقيقية
const updateChildPatterns = async (childId, character, topic) => {
  try {
    // تحديث عداد الحواديت وإضافة الشخصية والموضوع للـ arrays بدون تكرار ($addToSet)
    await Personalization.findOneAndUpdate(
      { childId },
      { 
        $inc: { storiesListenedCount: 1 },
        $addToSet: { 
          favoriteCharacters: character, 
          favoriteTopics: topic 
        }
      },
      { upsert: true, new: true } // لو البروفايل مش موجود هيكاريته تلقائي
    );
    console.log(`🤖 Personalization Engine updated for child: ${childId}`);
  } catch (err) {
    console.error('❌ Failed to update personalization patterns:', err.message);
  }
};

// Generate new story
export const generateStory = async (req, res, next) => {
  try {
    const { childId, character, topic } = req.body
    const userId = req.user.id || req.user._id

    // Verify user owns the child
    const child = await Child.findById(childId)
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'الطفل غير موجود',
        data: null,
        errors: [{ field: 'childId', message: 'الطفل غير موجود' }]
      })
    }

    if (child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بإنشاء حدوتة لهذا الطفل',
        data: null,
        errors: [{ field: 'childId', message: 'غير مصرح' }]
      })
    }

    // 1. جلب داتا الـ Personalization لتمريرها للـ Orchestrator
    let personalizationData = { isEngineActive: false };
    const profile = await Personalization.findOne({ childId });
    
    // شرط الـ 3 حواديت: لا يتم التخصيص الفعلي إلا بعد سماع 3 حواديت حقيقية على الأقل
    if (profile && profile.storiesListenedCount >= 3) {
      personalizationData = {
        favoriteCharacters: profile.favoriteCharacters,
        favoriteTopics: profile.favoriteTopics,
        preferredStoryLength: profile.preferredStoryLength,
        vocabularyLevel: profile.vocabularyLevel,
        isEngineActive: true
      };
    }

    // 2. التحقق من الـ Redis cache أولاً لتوفير كوست الـ AI والوقت
    const cached = await getCachedStory(childId, character, topic)
    if (cached) {
      const storyDoc = await Story.create({
        childId, character, topic,
        title: cached.title,
        scenes: cached.scenes,
        moralLesson: cached.moralLesson,
        educationalValue: cached.educationalValue,
        safetyCheck: cached.safetyCheck,
        status: 'completed',
        completedAt: new Date()
      })

      // الكاش بيرجع الحدوتة فوراً للفرونت إيند بدون زيادة عداد الـ Personalization
      return res.status(201).json({
        success: true,
        message: 'تم جلب الحدوتة من الكاش ⚡',
        data: storyDoc,
        errors: []
      })
    }

    // Create story document with generating status
    const storyDoc = await Story.create({
      childId,
      character,
      topic,
      title: `حدوتة عن ${topic}`,
      status: 'generating',
      safetyCheck: {
        safe: true,
        flagged: false,
        reason: ''
      }
    })

    console.log(`📖 Starting story generation for story: ${storyDoc._id}`)

    // Emit initial event via Socket.io
    const socketId = req.body.socketId || null
    if (socketId && io) {
      io.to(socketId).emit('story:generating', {
        storyId: storyDoc._id,
        stage: 'starting',
        progress: 5
      })
    }

    // Run orchestration in background
    orchestrateStoryGeneration({
      character,
      topic,
      childAge: child.age,
      childName: child.name,
      socketId,
      childId,  
      personalizationData 
    })
      .then(enrichedStory => {
        storyDoc.title = enrichedStory.title
        storyDoc.scenes = enrichedStory.scenes
        storyDoc.moralLesson = enrichedStory.moralLesson
        storyDoc.educationalValue = enrichedStory.educationalValue
        storyDoc.safetyCheck = enrichedStory.safetyCheck

        if (!enrichedStory.safetyCheck.safe) {
          storyDoc.status = 'failed'
          storyDoc.save().then(() => {
            if (socketId && io) {
              io.to(socketId).emit('story:error', {
                storyId: storyDoc._id,
                message: `القصة لم تجتز فحص السلامة: ${enrichedStory.safetyCheck.reason}`,
                reason: enrichedStory.safetyCheck.reason
              })
            }
          })
        } else {
          storyDoc.status = 'completed'
          storyDoc.completedAt = new Date()
          storyDoc.save().then(async (savedStory) => {
            console.log(`✅ Story saved: ${savedStory._id}`)
            
            // هنا المكان الصح! التحديث بيحصل فقط للقصص الجديدة والمقبولة أمنياً لضمان دقة التعلم بروفايل الطفل
            await updateChildPatterns(childId, character, topic);

            // تحديث الـ Progress للمستويات والـ Badges
            Progress.findOneAndUpdate(
              { childId },
              { $inc: { storiesCompleted: 1 } }
            ).catch(err => console.error('Failed to update storiesCompleted:', err))

            // تخزينها في كاش Redis لمدة 24 ساعة للسرعة
            cacheStory(childId, character, topic, {
              title: savedStory.title,
              scenes: savedStory.scenes,
              moralLesson: savedStory.moralLesson,
              educationalValue: savedStory.educationalValue,
              safetyCheck: savedStory.safetyCheck
            }).catch(() => {})

            if (socketId && io) {
              io.to(socketId).emit('story:completed', {
                storyId: savedStory._id,
                story: savedStory
              })
            }
          })
        }
      })
      .catch(error => {
        console.error('❌ Story generation error:', error)
        storyDoc.status = 'failed'
        storyDoc.save().then(() => {
          if (socketId && io) {
            io.to(socketId).emit('story:error', {
              storyId: storyDoc._id,
              message: error.message || 'حدث خطأ في توليد الحدوتة'
            })
          }
        })
      })

    // Return immediately with story ID and generating status
    res.status(201).json({
      success: true,
      message: 'جاري توليد الحدوتة...',
      data: {
        _id: storyDoc._id,
        childId,
        character,
        topic,
        status: 'generating',
        createdAt: storyDoc.createdAt
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// Record story choice
export const recordStoryChoice = async (req, res, next) => {
  try {
    const { id } = req.params
    const { choice } = req.body
    const userId = req.user.id || req.user._id

    const story = await Story.findById(id).populate('childId')
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'الحدوتة غير موجودة',
        data: null,
        errors: [{ field: 'id', message: 'الحدوتة غير موجودة' }]
      })
    }

    if (story.childId.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح للوصول لهذه الحدوتة',
        data: null,
        errors: []
      })
    }

    if (!story.userChoices) {
      story.userChoices = []
    }
    story.userChoices.push({
      sceneOrder: choice,
      timestamp: new Date()
    })
    await story.save()

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الاختيار',
      data: { storyId: story._id, choice },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// Get story history for child
export const getStoryHistory = async (req, res, next) => {
  try {
    const { childId } = req.params
    const { page = 1, limit = 10, character, topic } = req.query
    const userId = req.user.id || req.user._id

    const child = await Child.findById(childId)
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'الطفل غير موجود',
        data: null,
        errors: [{ field: 'childId', message: 'الطفل غير موجود' }]
      })
    }

    if (child.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح للوصول لبيانات هذا الطفل',
        data: null,
        errors: []
      })
    }

    const query = { childId, status: 'completed' }
    if (character) query.character = character
    if (topic) query.topic = new RegExp(topic, 'i')

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const stories = await Story.find(query)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('title character topic moralLesson status isFavorite createdAt completedAt educationalValue safetyCheck')

    const total = await Story.countDocuments(query)

    res.status(200).json({
      success: true,
      message: 'تم الحصول على سجل الحدوتات',
      data: {
        stories,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      },
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// Get single story
export const getSingleStory = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id || req.user._id

    const story = await Story.findById(id).populate('childId')
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'الحدوتة غير موجودة',
        data: null,
        errors: [{ field: 'id', message: 'الحدوتة غير موجودة' }]
      })
    }

    if (story.childId.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح للوصول لهذه الحدوتة',
        data: null,
        errors: []
      })
    }

    res.status(200).json({
      success: true,
      message: 'تم الحصول على الحدوتة',
      data: story,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}

// Update story
export const updateStory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { isFavorite } = req.body
    const userId = req.user.id || req.user._id

    const story = await Story.findById(id).populate('childId')
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'الحدوتة غير موجودة',
        data: null,
        errors: [{ field: 'id', message: 'الحدوتة غير موجودة' }]
      })
    }

    if (story.childId.parentId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لتحديث هذه الحدوتة',
        data: null,
        errors: []
      })
    }

    if (isFavorite !== undefined) {
      story.isFavorite = isFavorite
    }

    await story.save()

    res.status(200).json({
      success: true,
      message: 'تم تحديث الحدوتة',
      data: story,
      errors: []
    })
  } catch (error) {
    next(error)
  }
}