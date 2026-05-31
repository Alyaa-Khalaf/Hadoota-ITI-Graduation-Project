import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import childRoutes from './routes/childRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import gamificationRoutes from './routes/gamificationRoutes.js'

dotenv.config()

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

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/children', childRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/gamification', gamificationRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running 🚀', data: null, errors: [] })
})

// Socket.io
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})

// Connect DB + Start Server
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})

export { io }
