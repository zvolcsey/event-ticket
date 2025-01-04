import express, { Request, Response, NextFunction } from 'express';

import welcomeRoute from './api/v1/routes/welcomeRoute';
import productRoutes from './api/v1/routes/productRoutes';

const app = express();

// Middleware
app.use(express.json());


// Routes
app.use('/api/v1', welcomeRoute);
app.use('/api/v1/products', productRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;