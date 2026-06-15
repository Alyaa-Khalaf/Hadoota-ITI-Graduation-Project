import './env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'

// استيراد الـ Routes الكاملة من كل الفروع المدمجة
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

// استيراد الـ Middlewares والـ Models
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { socketAuthMiddleware } from './middleware/socketAuth.js'
import Child from './models/Child.js'

const app = express()
const httpServer = createServer(app)

// إعداد سيرفر الـ Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// =============== MIDDLEWARES ===============
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', generalLimiter)

// =============== GLOBAL ROUTES ===============
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/children', childRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/gamification', gamificationRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/progress', progressRoutes) // دمج مسار البروجريس الخاص بهند
app.use('/api/parent-agent', parentAgentRoutes)
app.use('/api/screentime', screenTimeRoutes)
app.use('/api/payments', paymentRoutes)

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running 🚀',
    data: null,
    errors: []
  })
})

// ============== SOCKET.IO SETUP ==============
// تطبيق حماية الـ Token على السوكت لضمان أمان الاتصال
io.use(socketAuthMiddleware)

io.on('connection', (socket) => {
  const userId = socket.data.userId
  console.log(`🔌 Authenticated client connected: ${socket.id} (User: ${userId})`)

  socket.data.rooms = new Set()

  // 👧 غرف متابعة الأطفال الفورية
  socket.on('join:child', async (data) => {
    try {
      const { childId } = data
      if (!childId) {
        socket.emit('error', { message: 'childId is required' })
        return
      }

      const child = await Child.findById(childId)
      if (!child) {
        socket.emit('error', { message: 'Child not found' })
        return
      }

      // التحقق من أن هذا الأب يملك هذا الطفل فعلياً
      if (child.parentId.toString() !== userId.toString()) {
        socket.emit('error', { message: 'Unauthorized: You do not own this child' })
        return
      }

      const roomName = `child:${childId}`
      socket.join(roomName)
      socket.data.rooms.add(roomName)
      socket.data.currentChildId = childId

      console.log(`👧 ${socket.id} joined room: ${roomName}`)
      socket.emit('room:joined', { childId, roomName })
    } catch (error) {
      console.error('Error joining room:', error)
      socket.emit('error', { message: error.message })
    }
  })

  socket.on('leave:child', (data) => {
    try {
      const { childId } = data
      const roomName = `child:${childId}`

      socket.leave(roomName)
      socket.data.rooms.delete(roomName)

      if (socket.data.currentChildId === childId) {
        delete socket.data.currentChildId
      }

      console.log(`👧 ${socket.id} left room: ${roomName}`)
      socket.emit('room:left', { childId })
    } catch (error) {
      console.error('Error leaving room:', error)
      socket.emit('error', { message: error.message })
    }
  })

  // 📖 غرف التفاعل مع الحواديت وتحديثاتها المباشرة
  socket.on('story:subscribe', (storyId) => {
    const roomName = `story:${storyId}`
    socket.join(roomName)
    socket.data.rooms.add(roomName)
    console.log(`📖 ${socket.id} subscribed to story: ${storyId}`)
  })

  socket.on('story:unsubscribe', (storyId) => {
    const roomName = `story:${storyId}`
    socket.leave(roomName)
    socket.data.rooms.delete(roomName)
    console.log(`📖 ${socket.id} unsubscribed from story: ${storyId}`)
  })

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`)
  })

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error)
  })
})

// =============== ERROR HANDLERS ===============
app.use(notFound)
app.use(errorHandler)

// =============== SERVER INITIALIZATION ===============
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}).catch(err => {
  console.error('❌ Database connection failed:', err.message)
  process.exit(1)
})

export { io }