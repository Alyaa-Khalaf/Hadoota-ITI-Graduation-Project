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

export const generateSceneImage = async (imagePrompt) => {
  if (useGemini()) {
    return geminiService.generateSceneImage(imagePrompt)
  }
  return openaiService.generateSceneImage(imagePrompt)
}

export { getProvider }
