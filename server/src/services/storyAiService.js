import * as geminiService from './geminiService.js'
import * as openaiService from './openaiService.js'

const useGemini = () => {
  const key = process.env.GEMINI_API_KEY
  return Boolean(key && key !== 'your_gemini_key')
}

const getProvider = () => (useGemini() ? 'gemini' : 'openai')

export const generateStoryStructure = async (params) => {
  if (useGemini()) {
    return geminiService.generateStoryStructure(params)
  }
  return openaiService.generateStoryStructure(params)
}

export const generateSceneImage = async (imagePrompt, context = {}) => {
  if (useGemini()) {
    return geminiService.generateSceneImage(imagePrompt, context)
  }
  return openaiService.generateSceneImage(imagePrompt, context)
}

export { getProvider }