import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as PublicController from '../controllers/public.controller.js';

const router = Router();

// News
router.get('/news', asyncHandler(PublicController.getNews));
router.get('/news/:id', asyncHandler(PublicController.getNewsDetail));

// Admission & Applications
router.get('/admission', asyncHandler(PublicController.getAdmission));
router.post('/apply', asyncHandler(PublicController.postApplication));

// Banners
router.get('/banners', asyncHandler(PublicController.getBanners));

// Gallery
router.get('/gallery', asyncHandler(PublicController.getGallery));

// Budget
router.get('/budget', asyncHandler(PublicController.getBudget));

// Messages
router.post('/contact', asyncHandler(PublicController.postMessage));

// Check Results (if applicable)
router.get('/check-result/:id', asyncHandler(PublicController.checkResult));

// Settings/About
router.get('/settings', asyncHandler(PublicController.getSettings));

export default router;
