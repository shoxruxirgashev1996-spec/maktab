import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/helpers.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  }, 'Server is healthy', 200);
});

export default router;
