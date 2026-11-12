import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import transactionRoutes from './routes/transactionsEnhanced';
import dashboardRoutes from './routes/dashboard';
import budgetRoutes from './routes/budgets';
import reportRoutes from './routes/reports';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error('❌ ERROR: DB_URL environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument as any));

// Public Routes
app.use(authRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Protected Routes (require authentication)
app.use(authMiddleware);
app.use(transactionRoutes);
app.use(dashboardRoutes);
app.use(budgetRoutes);
app.use(reportRoutes);

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Database connection and server startup
mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Database connected`);
    });
  })
  .catch((err: Error) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
