import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

// Simple validation utilities
export const validators = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  },

  isNumber: (value: any): boolean => {
    return !isNaN(value) && value !== '';
  },

  minLength: (str: string, min: number): boolean => {
    return str.length >= min;
  },

  maxLength: (str: string, max: number): boolean => {
    return str.length <= max;
  },

  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  }
};

// Validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};

    for (const [key, rules] of Object.entries(schema)) {
      const value = req.body[key];
      const ruleList = rules as any[];

      for (const rule of ruleList) {
        if (typeof rule === 'function' && !rule(value)) {
          errors[key] = `Validation failed for ${key}`;
          break;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(`Validation error: ${Object.values(errors)[0]}`, 400);
    }

    next();
  };
};

// Common validation schemas
export const validationSchemas = {
  login: {
    email: [(v: any) => validators.required(v), (v: any) => validators.isEmail(v)],
    password: [(v: any) => validators.required(v), (v: any) => validators.minLength(v, 6)]
  },

  createNews: {
    title: [(v: any) => validators.required(v), (v: any) => validators.maxLength(v, 200)],
    content: [(v: any) => validators.required(v)],
    author: [(v: any) => validators.required(v)],
    featured_image: [(v: any) => typeof v === 'string' || v instanceof File]
  },

  createBanner: {
    title: [(v: any) => validators.required(v)],
    subtitle: [(v: any) => validators.required(v)],
    image_url: [(v: any) => validators.required(v)]
  },

  postMessage: {
    name: [(v: any) => validators.required(v)],
    email: [(v: any) => validators.required(v), (v: any) => validators.isEmail(v)],
    message: [(v: any) => validators.required(v), (v: any) => validators.minLength(v, 10)],
    phone: [(v: any) => !v || validators.isPhone(v)]
  }
};
