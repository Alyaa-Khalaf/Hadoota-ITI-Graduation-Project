import { llm } from '../../config/ai.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// Safety Agent — validates story content for safety and age-appropriateness
export const validateStorySafety = async ({ story, childAge }) => {
  try {
    const systemPrompt = `أنت متخصص في حماية الأطفال من المحتوى الضار.
مهمتك تقييم سلامة وأمان القصة للأطفال من عمر ${childAge} سنة.

افحص القصة من حيث:
1. مناسبتها العمرية
2. وجود محتوى عنيف أو مخيف
3. وجود محتوى جنسي أو غير لائق
4. وجود معلومات خاطئة تربويًا
5. الرسالة الأخلاقية والقيمية
6. عدم وجود محتوى يشجع السلوك السلبي

الرد بـ JSON فقط بهذا الشكل:
{
  "safe": true أو false,
  "flagged": true أو false,
  "reason": "السبب إذا كانت غير آمنة أو تحتاج تحذير",
  "ageAppropriate": true أو false,
  "concerns": ["قلق أول", "قلق ثاني"],
  "recommendedAge": رقم سن موصى بها
}`

    const storyText = JSON.stringify(story, null, 2)
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`افحص سلامة هذه القصة:\n\n${storyText}`)
    ]

    console.log('🛡️  Checking story safety...')
    const response = await llm.invoke(messages)
    console.log('✅ Safety check completed!')

    // Parse JSON response
    const content = response.content.trim()
    let jsonStr = content.match(/\{[\s\S]*\}/)
    if (!jsonStr) throw new Error('Invalid safety check format')

    jsonStr = jsonStr[0]

    // Find proper JSON closing brace
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

    if (jsonEnd > 0) {
      jsonStr = jsonStr.substring(0, jsonEnd)
    }

    let safetyCheck
    try {
      safetyCheck = JSON.parse(jsonStr)
    } catch (e) {
      console.error('JSON parse error in safety check:', e.message)
      throw new Error(`Invalid safety check JSON: ${e.message}`)
    }

    // Validate required fields (more lenient)
    if (safetyCheck.safe === undefined || safetyCheck.flagged === undefined) {
      throw new Error('Safety check missing required fields: safe or flagged')
    }

    // Provide defaults for optional fields
    if (!safetyCheck.reason) safetyCheck.reason = ''
    if (!safetyCheck.ageAppropriate && safetyCheck.ageAppropriate !== false) safetyCheck.ageAppropriate = true
    if (!safetyCheck.concerns) safetyCheck.concerns = []
    if (!safetyCheck.recommendedAge) safetyCheck.recommendedAge = 3

    return safetyCheck
  } catch (error) {
    console.error('Safety check error:', error)
    // Default to safe with warning on error
    return {
      safe: true,
      flagged: true,
      reason: 'لم يتمكن من التحقق الكامل من السلامة',
      ageAppropriate: true,
      concerns: [],
      recommendedAge: 3
    }
  }
}
