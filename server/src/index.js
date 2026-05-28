import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import { generalLimiter } from './middleware/rateLimiter.js'

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
app.use('/api/users', userRoutes)
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

// Socket.io
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})

// Routes
import authRoutes from './routes/auth.routes.js'
app.use('/api/auth', authRoutes)


// 404 Handler - before error handler
app.use(notFound)

// Error Handler
app.use(errorHandler)

// Connect DB + Start Server
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
