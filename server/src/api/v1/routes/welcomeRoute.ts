import express, { Request, Response } from 'express'

const welcomeRoute = express.Router()

// desc     Say welcome
// route    GET /api/v1/
welcomeRoute.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the API v1!',
  })
})

export default welcomeRoute
