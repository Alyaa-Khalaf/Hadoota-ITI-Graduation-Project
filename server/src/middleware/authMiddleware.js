// Re-export the default auth middleware as a named export for compatibility
import authMiddleware from './auth.js'
export const protect = authMiddleware
