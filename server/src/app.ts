import express, { Request, Response, Express } from 'express'
import 'dotenv/config'

import welcomeRoute from './api/v1/routes/welcomeRoute'
import productRoutes from './api/v1/routes/productRoutes'

const app: Express = express()

// Middleware
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
