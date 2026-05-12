import express from 'express';
import * as AdminController from '../controllers/admin.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get('/login', AdminController.getLogin);
router.post('/login', AdminController.postLogin);
router.get('/logout', AdminController.logout);

// Protected routes
router.use(isAuthenticated);

router.get('/dashboard', AdminController.getDashboard);

// News CRUD
router.get('/news', AdminController.getNews);
router.get('/news/create', AdminController.getCreateNews);
router.post('/news', AdminController.postNews);
router.get('/news/:id/edit', AdminController.getEditNews);
router.put('/news/:id', AdminController.putNews);
router.delete('/news/:id', AdminController.deleteNews);

// Banners CRUD
router.get('/banners', AdminController.getBanners);
router.post('/banners', AdminController.postBanner);
router.delete('/banners/:id', AdminController.deleteBanner);
router.put('/banners/:id/toggle', AdminController.toggleBanner);

// Applications
router.get('/applications', AdminController.getApplications);
router.put('/applications/:id/status', AdminController.updateApplicationStatus);
router.delete('/applications/:id', AdminController.deleteApplication);

// Budget
router.get('/budget', AdminController.getBudget);
router.post('/budget', AdminController.postBudget);
router.delete('/budget/:id', AdminController.deleteBudget);

// Settings
router.get('/settings', AdminController.getSettings);
router.post('/settings', AdminController.updateSettings);

// Admin Management (Super Admin only - role check inside controller)
router.get('/admins', AdminController.getAdmins);
router.post('/admins', AdminController.postAdmin);
router.delete('/admins/:id', AdminController.deleteAdmin);

// Messages
router.get('/messages', AdminController.getMessages);
router.delete('/messages/:id', AdminController.deleteMessage);

export default router;
