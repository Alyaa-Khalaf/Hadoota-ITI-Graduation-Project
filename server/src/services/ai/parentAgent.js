import { llm } from '../../config/ai.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// Parent Agent — analyzes child progress and generates insights for parents

const parseJsonResponse = (content) => {
  const jsonMatch = content.trim().match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid response format: no JSON found')

  let jsonStr = jsonMatch[0]
  let braceCount = 0
  let jsonEnd = -1

  for (let i = 0; i < jsonStr.length; i++) {
    if (jsonStr[i] === '{') braceCount++
    if (jsonStr[i] === '}') braceCount--
    if (braceCount === 0) {
      jsonEnd = i + 1
      break
    }
  }

  if (jsonEnd > 0) jsonStr = jsonStr.substring(0, jsonEnd)

  try {
    return JSON.parse(jsonStr)
  } catch {
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1').replace(/[\x00-\x1F]/g, ' ')
    return JSON.parse(jsonStr)
  }
}

// Analyzes a child's learning progress and returns actionable insights
export const analyzeChildProgress = async ({ child, progress, recentStories }) => {
  try {
    const systemPrompt = `أنت مساعد تربوي ذكي متخصص في تحليل تقدم الأطفال العرب وتقديم تقارير للآباء.
مهمتك تحليل بيانات تقدم الطفل وتقديم رؤى واضحة وعملية للأهل بالعربية.

حلل البيانات وأعطِ:
1. تقييم عام لمستوى التقدم
2. نقاط القوة الواضحة
3. المجالات التي تحتاج دعم إضافي
4. توصيات عملية للأهل

الرد بـ JSON فقط بهذا الشكل:
{
  "overallAssessment": "تقييم شامل موجز",
  "progressLevel": "ممتاز" أو "جيد" أو "يحتاج دعم",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "areasForImprovement": ["مجال يحتاج تطوير 1", "مجال 2"],
  "parentRecommendations": ["توصية عملية 1", "توصية عملية 2", "توصية عملية 3"],
  "engagementScore": رقم من 0 إلى 100
}`

    const childSummary = {
      name: child.name,
      age: child.age,
      learningLevel: child.learningLevel,
      interests: child.interests,
      screenTimeToday: child.screenTime?.today || 0,
      screenTimeLimit: child.settings?.screenTimeLimit || 30
    }

    const progressSummary = {
      totalPoints: progress?.totalPoints || 0,
      level: progress?.level || 1,
      storiesCompleted: progress?.storiesCompleted || 0,
      streak: progress?.streak || { current: 0, longest: 0 },
      quizStats: progress?.quizStats || { totalQuizzes: 0, avgScore: 0 },
      topicsLearned: progress?.topicsLearned || [],
      dailyHistory: progress?.dailyHistory || []
    }

    const storiesSummary = recentStories.map(s => ({
      title: s.title,
      topic: s.topic,
      character: s.character,
      educationalScore: s.educationalValue?.score || 0,
      completedAt: s.completedAt
    }))

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `حلل تقدم الطفل التالي:\n\n` +
        `بيانات الطفل:\n${JSON.stringify(childSummary, null, 2)}\n\n` +
        `بيانات التقدم:\n${JSON.stringify(progressSummary, null, 2)}\n\n` +
        `الحدوتات الأخيرة (${storiesSummary.length}):\n${JSON.stringify(storiesSummary, null, 2)}`
      )
    ]

    console.log('🔍 Analyzing child progress...')
    const response = await llm.invoke(messages)
    console.log('✅ Progress analysis complete!')

    return parseJsonResponse(response.content)
  } catch (error) {
    console.error('Progress analysis error:', error)
    return {
      overallAssessment: 'لم يتمكن من إجراء التحليل الكامل',
      progressLevel: 'جيد',
      strengths: ['مشاركة منتظمة'],
      areasForImprovement: ['الاستمرار في ممارسة القراءة'],
      parentRecommendations: ['تشجيع الطفل على استكشاف مواضيع جديدة', 'مراجعة الحدوتات معاً'],
      engagementScore: 50
    }
  }
}

// Recommends story topics tailored to the child's interests and learning gaps
export const recommendStoryTopics = async ({ child, progress, recentStories }) => {
  try {
    const systemPrompt = `أنت منسق محتوى تعليمي للأطفال العرب.
مهمتك اقتراح مواضيع حدوتات مناسبة للطفل بناءً على اهتماماته وتقدمه.

اقترح مواضيع تراعي:
1. عمر الطفل واهتماماته
2. المواضيع التي لم يتناولها كثيراً
3. المستوى التعليمي المناسب
4. التنوع في المحتوى

الرد بـ JSON فقط بهذا الشكل:
{
  "recommendations": [
    {
      "topic": "اسم الموضوع",
      "character": "أسد" أو "أميرة" أو "رحالة",
      "reason": "سبب الاقتراح",
      "educationalGoal": "الهدف التعليمي"
    }
  ],
  "focusArea": "المجال الذي يحتاج تركيز أكثر",
  "avoidTopics": ["موضوع يجب تجنبه لأن الطفل يتناوله كثيراً"]
}`

    const usedTopics = recentStories.map(s => s.topic)
    const topicsLearnedCounts = progress?.topicsLearned || []

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `اقترح مواضيع لـ ${child.name} (${child.age} سنة)\n\n` +
        `الاهتمامات: ${child.interests?.join(', ') || 'غير محدد'}\n` +
        `المستوى: ${child.learningLevel}\n` +
        `المواضيع المسموحة: ${child.settings?.allowedTopics?.join(', ') || 'كل المواضيع'}\n` +
        `الحدوتات الأخيرة: ${usedTopics.join(', ') || 'لا يوجد'}\n` +
        `المواضيع المدروسة: ${JSON.stringify(topicsLearnedCounts)}`
      )
    ]

    console.log('💡 Generating topic recommendations...')
    const response = await llm.invoke(messages)
    console.log('✅ Recommendations generated!')

    return parseJsonResponse(response.content)
  } catch (error) {
    console.error('Recommendations error:', error)
    return {
      recommendations: [
        { topic: 'الطبيعة', character: 'رحالة', reason: 'موضوع شيق للأطفال', educationalGoal: 'التعرف على البيئة' },
        { topic: 'العلوم', character: 'أسد', reason: 'يشجع التفكير العلمي', educationalGoal: 'تنمية الفضول' }
      ],
      focusArea: 'القراءة والاستكشاف',
      avoidTopics: []
    }
  }
}

// Generates a weekly progress summary report for the parent
export const generateWeeklySummary = async ({ child, progress, weeklyStories }) => {
  try {
    const systemPrompt = `أنت مساعد ذكي يكتب تقارير أسبوعية للآباء عن تقدم أطفالهم في تطبيق الحدوتات التعليمي.
اكتب تقريراً أسبوعياً واضحاً وودوداً بالعربية.

التقرير يشمل:
1. ملخص الأسبوع
2. الإنجازات والنقاط المكتسبة
3. الحدوتات المكتملة والمواضيع
4. مستوى التفاعل والالتزام
5. نصيحة للأسبوع القادم

الرد بـ JSON فقط بهذا الشكل:
{
  "weekSummary": "ملخص الأسبوع بصيغة ودودة",
  "achievements": ["إنجاز 1", "إنجاز 2"],
  "pointsEarned": رقم,
  "storiesCount": رقم,
  "topTopics": ["موضوع 1", "موضوع 2"],
  "attendanceRate": رقم من 0 إلى 100,
  "nextWeekTip": "نصيحة للأسبوع القادم",
  "parentMessage": "رسالة شخصية للأهل"
}`

    const weekData = {
      childName: child.name,
      childAge: child.age,
      storiesThisWeek: weeklyStories.length,
      topics: weeklyStories.map(s => s.topic),
      avgEducationalScore: weeklyStories.length > 0
        ? (weeklyStories.reduce((acc, s) => acc + (s.educationalValue?.score || 0), 0) / weeklyStories.length).toFixed(1)
        : 0,
      dailyHistory: progress?.dailyHistory || [],
      totalPoints: progress?.totalPoints || 0,
      currentLevel: progress?.level || 1,
      streak: progress?.streak?.current || 0
    }

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`اكتب تقريراً أسبوعياً لـ ${child.name}:\n\n${JSON.stringify(weekData, null, 2)}`)
    ]

    console.log('📊 Generating weekly summary...')
    const response = await llm.invoke(messages)
    console.log('✅ Weekly summary generated!')

    return parseJsonResponse(response.content)
  } catch (error) {
    console.error('Weekly summary error:', error)
    return {
      weekSummary: `${child.name} أمضى أسبوعاً تعليمياً ممتعاً`,
      achievements: ['أتم حدوتات هذا الأسبوع'],
      pointsEarned: progress?.totalPoints || 0,
      storiesCount: weeklyStories.length,
      topTopics: weeklyStories.map(s => s.topic).slice(0, 2),
      attendanceRate: 70,
      nextWeekTip: 'تشجيع الطفل على استكشاف مواضيع متنوعة',
      parentMessage: 'أداء جيد هذا الأسبوع!'
    }
  }
}
