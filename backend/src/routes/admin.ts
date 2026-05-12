import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as AdminController from '../controllers/admin.controller.js';

const router = Router();

// Authentication
router.post('/login', asyncHandler(AdminController.login));
router.post('/logout', asyncHandler(AdminController.logout));

// Dashboard
router.get('/dashboard', asyncHandler(AdminController.getDashboard));

// News Management
router.get('/news', asyncHandler(AdminController.getNews));
router.post('/news', asyncHandler(AdminController.createNews));
router.put('/news/:id', asyncHandler(AdminController.updateNews));
router.delete('/news/:id', asyncHandler(AdminController.deleteNews));

// Banners Management
router.get('/banners', asyncHandler(AdminController.getBanners));
router.post('/banners', asyncHandler(AdminController.createBanner));
router.put('/banners/:id', asyncHandler(AdminController.updateBanner));
router.delete('/banners/:id', asyncHandler(AdminController.deleteBanner));
router.patch('/banners/:id/toggle', asyncHandler(AdminController.toggleBanner));

// Applications Management
router.get('/applications', asyncHandler(AdminController.getApplications));
router.put('/applications/:id/status', asyncHandler(AdminController.updateApplicationStatus));
router.delete('/applications/:id', asyncHandler(AdminController.deleteApplication));

// Budget Management
router.get('/budget', asyncHandler(AdminController.getBudget));
router.post('/budget', asyncHandler(AdminController.createBudget));
router.delete('/budget/:id', asyncHandler(AdminController.deleteBudget));

// Messages
router.get('/messages', asyncHandler(AdminController.getMessages));
router.delete('/messages/:id', asyncHandler(AdminController.deleteMessage));

// Settings
router.get('/settings', asyncHandler(AdminController.getSettings));
router.put('/settings', asyncHandler(AdminController.updateSettings));

// Admin Management (Super Admin Only)
router.get('/admins', asyncHandler(AdminController.getAdmins));
router.post('/admins', asyncHandler(AdminController.createAdmin));
router.delete('/admins/:id', asyncHandler(AdminController.deleteAdmin));

export default router;
