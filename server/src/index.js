import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'

import connectDB from './config/db.js'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/userRoutes.js'
import childRoutes from './routes/child.routes.js'
import quizRoutes from './routes/quizRoutes.js'
import gamificationRoutes from './routes/gamificationRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
import progressRoutes from './routes/progress.routes.js'
import parentAgentRoutes from './routes/parentAgent.routes.js'
import screenTimeRoutes from './routes/screenTime.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import schoolRoutes from './routes/school.routes.js'
import adminRoutes from './routes/admin.routes.js'
import personalizationRoutes from './routes/personalizationRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { socketAuthMiddleware } from './middleware/socketAuth.js'
import { startNotificationJobs } from './services/notifications/jobs/notificationJobs.js'

import Child from './models/Child.js'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
)

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api', generalLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/children', childRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/gamification', gamificationRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/parent-agent', parentAgentRoutes)
app.use('/api/screentime', screenTimeRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/schools', schoolRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/personalization', personalizationRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running 🚀',
  })
})

io.use(socketAuthMiddleware)

io.on('connection', (socket) => {
  const userId = socket.data.userId

  console.log(`🔌 Client connected: ${socket.id} (User: ${userId})`)

  socket.data.rooms = new Set()

  socket.on('join:child', async ({ childId }) => {
    try {
      if (!childId) {
        return socket.emit('error', { message: 'childId is required' })
      }

      const child = await Child.findById(childId)

      if (!child) {
        return socket.emit('error', { message: 'Child not found' })
      }

      if (child.parentId.toString() !== userId.toString()) {
        return socket.emit('error', { message: 'Unauthorized access' })
      }

      const room = `child:${childId}`
      socket.join(room)
      socket.data.rooms.add(room)
      socket.data.currentChildId = childId

      socket.emit('room:joined', { childId, room })
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  socket.on('leave:child', ({ childId }) => {
    const room = `child:${childId}`
    socket.leave(room)
    socket.data.rooms.delete(room)

    if (socket.data.currentChildId === childId) {
      delete socket.data.currentChildId
    }

    socket.emit('room:left', { childId })
  })

  socket.on('story:subscribe', (storyId) => {
    const room = `story:${storyId}`
    socket.join(room)
    socket.data.rooms.add(room)
  })

  socket.on('story:unsubscribe', (storyId) => {
    const room = `story:${storyId}`
    socket.leave(room)
    socket.data.rooms.delete(room)
  })

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected: ${socket.id}`)
  })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    startNotificationJobs()
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message)
    process.exit(1)
  })

export { io }
