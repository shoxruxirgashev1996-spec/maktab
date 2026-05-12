import { Request, Response } from 'express';
import { sendSuccess } from '../utils/helpers.js';
import FirebaseService from '../services/firebase.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getNews = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, lang = 'uz' } = req.query;
  const news = await FirebaseService.getDocuments('news');
  
  const startIndex = (Number(page) - 1) * Number(limit);
  const paginatedNews = news.slice(startIndex, startIndex + Number(limit));

  sendSuccess(res, {
    news: paginatedNews,
    pagination: {
      total: news.length,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(news.length / Number(limit))
    }
  }, 'News retrieved successfully');
};

export const getNewsDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const news = await FirebaseService.getDocument('news', id);
  
  if (!news) {
    throw new AppError('News not found', 404);
  }

  sendSuccess(res, news, 'News retrieved successfully');
};

export const getAdmission = async (req: Request, res: Response) => {
  const settings = await FirebaseService.getDocuments('settings');
  sendSuccess(res, settings[0] || {}, 'Admission info retrieved');
};

export const postApplication = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    throw new AppError('All fields are required', 400);
  }

  const application = await FirebaseService.createDocument('applications', {
    name,
    email,
    phone,
    message,
    status: 'pending'
  });

  sendSuccess(res, application, 'Application submitted successfully', 201);
};

export const getBanners = async (req: Request, res: Response) => {
  const banners = await FirebaseService.getDocuments('banners');
  sendSuccess(res, banners, 'Banners retrieved successfully');
};

export const getGallery = async (req: Request, res: Response) => {
  const gallery = await FirebaseService.getDocuments('gallery');
  sendSuccess(res, gallery, 'Gallery retrieved successfully');
};

export const getBudget = async (req: Request, res: Response) => {
  const budget = await FirebaseService.getDocuments('budget');
  sendSuccess(res, budget, 'Budget retrieved successfully');
};

export const postMessage = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    throw new AppError('Name, email, and message are required', 400);
  }

  const msg = await FirebaseService.createDocument('messages', {
    name,
    email,
    phone,
    message
  });

  sendSuccess(res, msg, 'Message sent successfully', 201);
};

export const checkResult = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const application = await FirebaseService.getDocument('applications', id);
  
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  sendSuccess(res, application, 'Result retrieved successfully');
};

export const getSettings = async (req: Request, res: Response) => {
  const settings = await FirebaseService.getDocuments('settings');
  sendSuccess(res, settings[0] || {}, 'Settings retrieved successfully');
};
