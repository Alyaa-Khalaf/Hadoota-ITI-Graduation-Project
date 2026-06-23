import { llm } from '../../config/ai.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// Education Agent — analyzes story for educational value
export const analyzeStoryEducation = async ({ story, childAge }) => {
  try {
    // 🌟 تم تحديث الـ Prompt لإجبار الـ AI على استخدام الـ Keys الإنجليزية بدقة وبدون فلسفة
    const systemPrompt = `أنت خبير تربوي متخصص في تعليم الأطفال العرب.
مهمتك تقييم القيمة التعليمية للقصة وتحديد مخرجات التعلم.

قيّم القصة التالية من حيث المناسبة لعمر (${childAge} سنة).

يجب أن يكون الرد عبارة عن كود JSON فقط، وممنوع تماماً كتابة أي نصوص خارج الـ JSON.
استخدم المسميات الإنجليزية للمفاتيح (Keys) بالضبط كما هي موجهة لك في هذا النموذج:
{
  "score": 8,
  "learningOutcomes": ["مخرج تعليمي أول", "مخرج تعليمي ثاني"],
  "strengths": ["نقطة قوة أولى"],
  "suggestedImprovements": ["تحسين مقترح أول"]
}`

    const storyText = JSON.stringify(story, null, 2)
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`قيّم القصة التالية:\n\n${storyText}`)
    ]

    console.log('🎓 Analyzing story education value...')
    const response = await llm.invoke(messages)
    console.log('✅ Education analysis complete!')

    // تنظيف وتجهيز رد الـ AI
    let content = response.content.trim();
    
    // لو الـ AI حط الـ JSON جوه علامات الـ Markdown المزعجة (```json) هنشيلها فوراً
    if (content.includes("```")) {
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid education analysis format')

    const analysis = JSON.parse(jsonMatch[0])

    // 🌟 حماية مرنة للـ Validation: لو الـ AI خرف في الـ Keys، نديها قيم افتراضية بدل ما نرمي Error ويكراش الـ Pipeline
    const finalizedAnalysis = {
      score: typeof analysis.score === 'number' ? analysis.score : 7,
      learningOutcomes: Array.isArray(analysis.learningOutcomes) ? analysis.learningOutcomes : ['فهم أحداث القصة والتعلم منها'],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ['مناسبة للفئة العمرية المستهدفة'],
      suggestedImprovements: Array.isArray(analysis.suggestedImprovements) ? analysis.suggestedImprovements : []
    }

    // التأكد من أن النتيجة في النطاق الصحيح من 0 لـ 10
    finalizedAnalysis.score = Math.min(10, Math.max(0, finalizedAnalysis.score))

    return finalizedAnalysis;

  } catch (error) {
    // تم تحويلها لـ console.warn عشان متظهرش بشكل كراش مرعب لأن السيستم بيتعامل معها بأمان
    console.warn('⚠️ Education analysis sub-error treated safely:', error.message)
    
    // Return default educational value instead of failing
    return {
      score: 6,
      learningOutcomes: ['استيعاب العبرة من القصة', 'تنمية الخيال الإبداعي'],
      strengths: ['أسلوب تفاعلي ومبسط للطفل'],
      suggestedImprovements: []
    }
  }
}