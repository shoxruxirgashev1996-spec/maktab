import express from 'express';
import * as PublicController from '../controllers/public.controller.js';

const router = express.Router();

router.get('/', PublicController.getHome);
router.get('/about', PublicController.getAbout);
router.get('/admission', PublicController.getAdmission);
router.post('/apply', PublicController.postApply);
router.get('/news', PublicController.getNews);
router.get('/news/:id', PublicController.getNewsDetail);
router.get('/gallery', PublicController.getGallery);
router.get('/budget', PublicController.getBudget);
router.get('/contact', PublicController.getContact);
router.post('/message', PublicController.postMessage);
router.get('/check-result/:id', PublicController.getCheckResult);

export default router;
