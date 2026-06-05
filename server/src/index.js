import './env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { socketAuthMiddleware } from './middleware/socketAuth.js'
import authRoutes from './routes/auth.routes.js'
import storyRoutes from './routes/storyRoutes.js'
import childRoutes from './routes/childRoutes.js'
import userRoutes from './routes/userRoutes.js'
import Child from './models/Child.js'


const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', generalLimiter)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running 🚀',
    data: null,
    errors: []
  })
})

// ============== SOCKET.IO SETUP ==============

// Apply authentication middleware
io.use(socketAuthMiddleware)

io.on('connection', (socket) => {
  const userId = socket.data.userId
  console.log(`🔌 Authenticated client connected: ${socket.id} (User: ${userId})`)

  // Store socket in socket.data for later use
  socket.data.rooms = new Set()

  // ========== Join Child Room ==========
  socket.on('join:child', async (data) => {
    try {
      const { childId } = data

      if (!childId) {
        socket.emit('error', { message: 'childId is required' })
        return
      }

      // Verify user owns this child
      const child = await Child.findById(childId)
      if (!child) {
        socket.emit('error', { message: 'Child not found' })
        return
      }

      if (child.parentId.toString() !== userId.toString()) {
        socket.emit('error', { message: 'Unauthorized: You do not own this child' })
        return
      }

      // Join room
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

  // ========== Leave Child Room ==========
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

  // ========== Subscribe to Story ==========
  socket.on('story:subscribe', (storyId) => {
    const roomName = `story:${storyId}`
    socket.join(roomName)
    socket.data.rooms.add(roomName)
    console.log(`📖 ${socket.id} subscribed to story: ${storyId}`)
  })

  // ========== Unsubscribe from Story ==========
  socket.on('story:unsubscribe', (storyId) => {
    const roomName = `story:${storyId}`
    socket.leave(roomName)
    socket.data.rooms.delete(roomName)
    console.log(`📖 ${socket.id} unsubscribed from story: ${storyId}`)
  })

  // ========== Disconnect ==========
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`)
  })

  // ========== Error Handler ==========
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error)
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/children', childRoutes)
app.use('/api/stories', storyRoutes)

// 404 Handler
app.use(notFound)

// Error Handler
app.use(errorHandler)

// Connect DB + Start Server
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})

export { io }
