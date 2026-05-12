import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, Green for success
    const reset = '\x1b[0m';

    console.log(
      `${statusColor}${req.method} ${req.path} - ${statusCode}${reset} | ${duration}ms`
    );
  });

  next();
};
