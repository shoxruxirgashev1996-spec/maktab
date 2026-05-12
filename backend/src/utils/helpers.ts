import bcrypt from 'bcryptjs';
import { Response } from 'express';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  details?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details })
  });
};

export const formatDate = (date: Date | any): string => {
  if (date?.toDate) {
    return date.toDate().toISOString();
  }
  return new Date(date).toISOString();
};

export const paginate = (items: any[], page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      totalItems: items.length,
      totalPages: Math.ceil(items.length / limit),
      currentPage: page,
      hasNextPage: endIndex < items.length,
      hasPreviousPage: page > 1
    }
  };
};

export const filterObject = (obj: any, keys: string[]) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {} as any);
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
