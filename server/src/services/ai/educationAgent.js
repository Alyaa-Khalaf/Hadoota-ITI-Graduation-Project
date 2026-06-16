import { llm } from '../../config/ai.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// Education Agent — analyzes story for educational value
export const analyzeStoryEducation = async ({ story, childAge }) => {
  try {
    const systemPrompt = `أنت خبير تربوي متخصص في تعليم الأطفال العرب.
مهمتك تقييم القيمة التعليمية للقصة وتحديد مخرجات التعلم.

قيّم القصة التالية من حيث:
1. مستوى المناسبة للعمر (${childAge} سنة)
2. الفائدة التعليمية من 1 إلى 10
3. المهارات والمعارف التي يتعلمها الطفل
4. مدى تحقيق الأهداف التعليمية

الرد بـ JSON فقط بهذا الشكل:
{
  "score": رقم من 0 إلى 10,
  "learningOutcomes": ["المخرج الأول", "المخرج الثاني", "المخرج الثالث"],
  "strengths": ["نقطة قوة أولى", "نقطة قوة ثانية"],
  "suggestedImprovements": ["تحسين مقترح أول", "تحسين مقترح ثاني"]
}`

    const storyText = JSON.stringify(story, null, 2)
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`قيّم القصة التالية:\n\n${storyText}`)
    ]

    console.log('🎓 Analyzing story education value...')
    const response = await llm.invoke(messages)
    console.log('✅ Education analysis completed!')

    // Parse JSON response
    const content = response.content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid education analysis format')

    const analysis = JSON.parse(jsonMatch[0])

    // Validate required fields
    if (analysis.score === undefined || !Array.isArray(analysis.learningOutcomes)) {
      throw new Error('Education analysis missing required fields')
    }

    // Ensure score is within range
    analysis.score = Math.min(10, Math.max(0, analysis.score))

    return analysis
  } catch (error) {
    console.error('Education analysis error:', error)
    // Return default educational value instead of failing
    return {
      score: 5,
      learningOutcomes: ['فهم القصة', 'الدرس المستفاد'],
      strengths: ['تفاعلية'],
      suggestedImprovements: []
    }
  }
}
