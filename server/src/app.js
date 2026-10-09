import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.routes.js'

// Load environment variables
dotenv.config()

// Startup check: JWT_SECRET must be set
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.')
  console.error('Please configure JWT_SECRET in server/.env before starting the server.')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)

// API Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CampusFlow API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

// Serve React client in production (Single-Service Deployment)
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../client/dist')
  app.use(express.static(clientDistPath))

  // Fallback route for React Router client-side routing
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'API route not found',
        },
      })
    }
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

// Global error handler adhering to { error: { code, message } }
app.use((err, req, res, next) => {
  console.error('[CampusFlow Server Error]:', err.stack || err)
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected internal server error occurred',
    },
  })
})

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[CampusFlow Server] Running on http://localhost:${PORT}`)
  })
}

export default app
