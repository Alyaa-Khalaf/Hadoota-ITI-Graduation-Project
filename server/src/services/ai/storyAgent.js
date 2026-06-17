import { llm } from '../../config/ai.js'
import { getStoryContext } from './ragPipeline.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// Story Agent — generates interactive Arabic story
export const generateStory = async ({ character, topic, childAge, childName }) => {
  try {
    // Get RAG context
    console.log('🔍 Getting RAG context for:', topic)
    const context = await getStoryContext(topic, childAge)
    console.log('✅ RAG context retrieved, length:', context.length)

    // System prompt
    const systemPrompt = `أنت راوي قصص متخصص للأطفال العرب من عمر ${childAge} سنين.
مهمتك تكتب حدوتة تعليمية تفاعلية بالعامية المصرية البسيطة.

قواعد مهمة:
- استخدم عامية مصرية بسيطة مناسبة للأطفال
- الجمل قصيرة وواضحة
- فيه قيمة تعليمية واضحة
- الحدوتة ممتعة وشيقة
- البطل هو ${character}
- الموضوع: ${topic}

${context ? `معلومات مفيدة للقصة:\n${context}` : ''}

اكتب الحدوتة بالتنسيق ده بالظبط (JSON):
{
  "title": "عنوان الحدوتة",
  "scenes": [
    {
      "order": 1,
      "text": "نص المشهد الأول"
    },
    {
      "order": 2, 
      "text": "نص المشهد التاني"
    },
    {
      "order": 3,
      "text": "نص المشهد التالت"
    }
  ],
  "question": "سؤال تفاعلي للطفل؟",
  "choices": [
    "اختيار أول",
    "اختيار تاني", 
    "اختيار تالت"
  ],
  "moralLesson": "الدرس المستفاد"
}

مهم جداً: رد بـ JSON فقط من غير أي كلام تاني.`

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`اكتب حدوتة عن ${topic} بطلها ${character} ${childName ? `لـ ${childName}` : ''}`)
    ]

    console.log('🤖 Generating story...')
    const response = await llm.invoke(messages)
    console.log('✅ Story generated!')
    console.log('Response content sample:', response.content.substring(0, 200))

    // Parse JSON response with better error handling
    const content = response.content.trim()
    let jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid story format: no JSON object found')

    let jsonStr = jsonMatch[0]

    // Try to find the closing brace more intelligently
    // by counting braces to find the actual end
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

    let story
    try {
      story = JSON.parse(jsonStr)
    } catch (e) {
      // Try to fix common JSON issues
      console.error('Initial JSON parse failed, attempting to fix...')

      // Remove trailing commas before ] or }
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1')

      // Remove control characters
      jsonStr = jsonStr.replace(/[\x00-\x1F]/g, ' ')

      try {
        story = JSON.parse(jsonStr)
      } catch (e2) {
        // Log the problematic JSON for debugging
        console.error('JSON parse error:', e2.message)
        console.error('Problematic JSON (first 500 chars):', jsonStr.substring(0, 500))
        throw new Error(`Invalid JSON format: ${e2.message}`)
      }
    }

    return story

  } catch (error) {
    throw new Error(`فشل توليد الحدوتة: ${error.message}`)
  }
}
