import { generateStory } from './storyAgent.js'
import { analyzeStoryEducation } from './educationAgent.js'
import { validateStorySafety } from './safetyAgent.js'
import { io } from '../../index.js'

// Multi-agent orchestrator for story generation
export const orchestrateStoryGeneration = async ({
  character,
  topic,
  childAge,
  childName,
  socketId = null,
  childId = null
}) => {
  const roomName = childId ? `child:${childId}` : null

  const emitProgress = (stage, progress, chunk = null) => {
    const eventData = {
      stage,
      progress,
      timestamp: new Date().toISOString()
    }

    if (chunk) {
      eventData.chunk = chunk
    }

    // Emit to socket if provided
    if (socketId && io) {
      io.to(socketId).emit('story:generating', eventData)
    }

    // Emit to room if provided
    if (roomName && io) {
      io.to(roomName).emit('story:generating', eventData)
    }

    console.log(`📊 Progress: ${stage} (${progress}%)`)
  }

  try {
    emitProgress('starting', 5)
    console.log('🚀 Starting story orchestration...')

    // Step 1: Generate story
    emitProgress('story_generation', 20)
    const story = await generateStory({
      character,
      topic,
      childAge,
      childName
    })
    console.log('✅ Story generated!')
    emitProgress('story_generation', 40, { title: story.title })

    // Step 2: Analyze education value
    emitProgress('education_analysis', 55)
    const educationAnalysis = await analyzeStoryEducation({
      story,
      childAge
    })
    console.log('✅ Education analysis complete!')
    emitProgress('education_analysis', 70, {
      score: educationAnalysis.score,
      outcomes: educationAnalysis.learningOutcomes?.length || 0
    })

    // Step 3: Safety check
    emitProgress('safety_check', 80)
    const safetyCheck = await validateStorySafety({
      story,
      childAge
    })
    console.log('✅ Safety check complete!')
    emitProgress('safety_check', 90, {
      safe: safetyCheck.safe,
      ageAppropriate: safetyCheck.ageAppropriate
    })

    // Return complete enriched story
    emitProgress('processing', 95)
    const enrichedStory = {
      ...story,
      educationalValue: {
        score: educationAnalysis.score,
        learningOutcomes: educationAnalysis.learningOutcomes,
        strengths: educationAnalysis.strengths || [],
        suggestedImprovements: educationAnalysis.suggestedImprovements || []
      },
      safetyCheck: {
        safe: safetyCheck.safe,
        flagged: safetyCheck.flagged,
        reason: safetyCheck.reason,
        ageAppropriate: safetyCheck.ageAppropriate,
        concerns: safetyCheck.concerns || [],
        recommendedAge: safetyCheck.recommendedAge || childAge
      }
    }

    emitProgress('completed', 100)
    console.log('🎉 Story orchestration complete!')

    return enrichedStory
  } catch (error) {
    console.error('❌ Orchestration error:', error)

    // Emit error to socket/room
    const errorEvent = {
      message: error.message || 'حدث خطأ في توليد الحدوتة',
      timestamp: new Date().toISOString()
    }

    if (socketId && io) {
      io.to(socketId).emit('story:error', errorEvent)
    }

    if (roomName && io) {
      io.to(roomName).emit('story:error', errorEvent)
    }

    throw error
  }
}
