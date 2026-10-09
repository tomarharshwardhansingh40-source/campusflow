import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// API Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CampusFlow API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

// Serve React client in production (Single-Service Deployment)
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../client/dist')
  app.use(express.static(clientDistPath))

  // Fallback route for React Router client-side routing
  app.get('*', (req, res) => {
    // If request was meant for /api and didn't match, return 404 JSON
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API route not found' })
    }
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('[CampusFlow Server Error]:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  })
})

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[CampusFlow Server] Running on http://localhost:${PORT}`)
  })
}

export default app
