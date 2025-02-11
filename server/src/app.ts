import express, { Request, Response, Express } from 'express'
import 'dotenv/config'
import session from 'express-session'
import helmet from 'helmet'
import connectPgSimple from 'connect-pg-simple'
import pool from './db/index'

import welcomeRoute from './api/v1/routes/welcomeRoute'
import productRoutes from './api/v1/routes/productRoutes'

// Create an Express application
const app: Express = express()

// Security middleware
app.use(helmet())
app.set('trust proxy', 1)

// Rate limit middleware
// TODO

// Session middleware
const pgSession = connectPgSimple(session)
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 15, // Cleanup every 15 minutes
    }),
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict',
      httpOnly: true,
    },
    rolling: true,
  })
)

// Handle requests with json
app.use(express.json())

// Routes
app.use('/api/v1', welcomeRoute)
app.use('/api/v1/products', productRoutes)

// Error handling
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack)

  res.status(500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const port = process.env.API_PORT ?? 8080

app.listen(port, () => {
  console.log('Server listening on port 8080')
})
