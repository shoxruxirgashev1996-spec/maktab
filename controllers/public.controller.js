import * as db from '../lib/db.js';
import { orderBy, limit, where } from 'firebase/firestore';

export const getHome = async (req, res) => {
  try {
    const banners = await db.getAll('banners', [where('active', '==', true), orderBy('order', 'asc')]);
    const latestNews = await db.getAll('news', [orderBy('date', 'desc'), limit(3)]);
    const announcements = await db.getAll('announcements', [where('active', '==', true), orderBy('date', 'desc'), limit(3)]);
    const stats = {
      students: 450,
      teachers: 45,
      achievements: 120,
      clubs: 15
    };
    res.render('pages/home', { 
      title: 'Bosh sahifa',
      banners,
      news: latestNews,
      announcements,
      stats
    });
  } catch (err) {
    console.error('Home controller error:', err);
    res.render('pages/home', { 
      title: 'Bosh sahifa',
      banners: [],
      news: [],
      announcements: [],
      stats: { students: 0, teachers: 0, achievements: 0, clubs: 0 }
    });
  }
};

export const getAbout = (req, res) => {
  res.render('pages/about', { title: res.locals.t('about') });
};

export const getAdmission = (req, res) => {
  res.render('pages/admission', { title: res.locals.t('admission') });
};

export const postApply = async (req, res) => {
  try {
    const newApp = await db.create('applications', {
      ...req.body,
      status: 'pending'
    });
    res.redirect('/admission?success=true&id=' + newApp.id);
  } catch (err) {
    console.error('Apply error:', err);
    res.redirect('/admission?error=true');
  }
};

export const getNews = async (req, res) => {
  try {
    const newsList = await db.getAll('news', [orderBy('date', 'desc')]);
    res.render('pages/news', { 
      title: 'Yangiliklar',
      news: newsList
    });
  } catch (err) {
    console.error('News list error:', err);
    res.render('pages/news', { 
      title: 'Yangiliklar',
      news: []
    });
  }
};

export const getNewsDetail = async (req, res) => {
  try {
    const item = await db.getOne('news', req.params.id);
    if (!item) throw new Error('Not found');
    res.render('pages/news-detail', { 
      title: item.title[res.locals.lang] || 'Yangilik',
      item
    });
  } catch (err) {
    console.error('News detail error:', err);
    res.status(404).render('pages/error', { title: 'Topilmadi', error: 'Yangilik topilmadi' });
  }
};

export const getGallery = async (req, res) => {
  try {
    const images = await db.getAll('gallery');
    res.render('pages/gallery', { 
      title: 'Galereya',
      images
    });
  } catch (err) {
    console.error('Gallery error:', err);
    res.render('pages/gallery', { 
      title: 'Galereya',
      images: []
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const data = await db.getAll('budget', [orderBy('date', 'desc')]);
    res.render('pages/budget', { 
      title: 'Budjet ochiqligi',
      data
    });
  } catch (err) {
    console.error('Budget error:', err);
    res.render('pages/budget', { 
      title: 'Budjet ochiqligi',
      data: []
    });
  }
};

export const getContact = (req, res) => {
  res.render('pages/contact', { title: res.locals.t('contact') });
};

export const postMessage = async (req, res) => {
  try {
    await db.create('messages', req.body);
    res.redirect('/contact?success=true');
  } catch (err) {
    console.error('Message error:', err);
    res.redirect('/contact?error=true');
  }
};

export const getCheckResult = async (req, res) => {
  try {
    const app = await db.getOne('applications', req.params.id);
    res.render('pages/check-result', { 
      title: 'Natijani tekshirish',
      application: app
    });
  } catch (err) {
    console.error('Check result error:', err);
    res.status(404).render('pages/error', { title: 'Xatolik', error: 'ID noto\'g\'ri' });
  }
};
