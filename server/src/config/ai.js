import { GoogleGenerativeAI } from '@google/generative-ai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const API_KEY = process.env.GOOGLE_API_KEY

const genAI = new GoogleGenerativeAI(API_KEY)

export const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  apiKey: API_KEY,
  temperature: 0.7,
  maxOutputTokens: 2048,
})

export const getEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
    const cleanText = String(text).trim()
    console.log('Calling embedContent with text length:', cleanText.length)
    const result = await model.embedContent(cleanText)
    console.log('Embedding dimensions:', result.embedding.values.length)
    return result.embedding.values
  } catch (error) {
    console.error('Embedding error details:', JSON.stringify(error, null, 2))
    throw error
  }
}