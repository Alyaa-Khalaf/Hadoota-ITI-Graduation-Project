import jwt from 'jsonwebtoken'

export const socketAuthMiddleware = (socket, next) => {
  try {
    // Get token from handshake auth
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]

    if (!token) {
      return next(new Error('No authentication token provided'))
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to socket
    socket.data.userId = decoded.id
    socket.data.user = decoded

    next()
  } catch (error) {
    next(new Error(`Authentication failed: ${error.message}`))
  }
}

export const socketRoomMiddleware = async (socket, next) => {
  try {
    // This will be called after room join
    // Verify user owns the child they're joining
    next()
  } catch (error) {
    next(new Error(`Room authorization failed: ${error.message}`))
  }
}
