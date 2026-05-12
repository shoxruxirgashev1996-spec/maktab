import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
import { errorHandler, asyncHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { validateRequest } from './middleware/validators.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Routes
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// SECURITY & PARSING MIDDLEWARE
// ============================================
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression()); // Gzip compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// REQUEST LOGGING
// ============================================
app.use(requestLogger);
app.use(rateLimiter);

// ============================================
// HEALTH CHECK
// ============================================
app.use('/api/health', healthRoutes);

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================
app.use('/api/public', publicRoutes);

// ============================================
// ADMIN ROUTES (Auth Required)
// ============================================
app.use('/api/admin', authMiddleware, adminRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  🚀 Server Started Successfully      ║
╠══════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(27)}║
║  Port: ${String(PORT).padEnd(31)}║
║  URL: http://localhost:${String(PORT).padEnd(23)}║
╚══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
