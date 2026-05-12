import * as db from '../lib/db.js';
import { orderBy, where, limit } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import fs from 'fs';

export const getLogin = (req, res) => {
  if (req.session.admin) return res.redirect('/admin/dashboard');
  res.render('admin/login', { title: 'Kirish', error: null, layout: false });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const trimmedUsername = username ? username.trim() : '';
  const trimmedPassword = password ? password.trim() : '';
  
  console.log(`Login attempt: user="${trimmedUsername}", passLen=${trimmedPassword.length}`);
  console.log(`User charCodes: ${trimmedUsername.split('').map(c => c.charCodeAt(0)).join(',')}`);
  
  const debugLog = (msg) => {
    fs.appendFileSync('login_debug.log', `${new Date().toISOString()} - ${msg}\n`);
  };

  debugLog(`Attempt: user="${trimmedUsername}", passLen=${trimmedPassword.length}`);
  debugLog(`User charCodes: ${trimmedUsername.split('').map(c => c.charCodeAt(0)).join(',')}`);

  try {
    const admin = await db.findOne('admins', [where('username', '==', trimmedUsername)]);
    
    // Fallback: search case-insensitively if not found (getting all and manual check)
    let finalAdmin = admin;
    if (!finalAdmin) {
      const allAdmins = await db.getAll('admins');
      finalAdmin = allAdmins.find(a => a.username.toLowerCase() === trimmedUsername.toLowerCase());
      if (finalAdmin) {
        debugLog(`Found admin via case-insensitive fallback: "${finalAdmin.username}"`);
      }
    }

    if (!finalAdmin) {
      debugLog(`FAILED: Admin not found for "${trimmedUsername}"`);
      const allAdmins = await db.getAll('admins');
      debugLog(`Available: ${allAdmins.map(a => a.username).join(', ')}`);
      return res.render('admin/login', { title: 'Kirish', error: 'Login yoki parol noto\'g\'ri', layout: false });
    }
    
    const isMatch = await bcrypt.compare(trimmedPassword, finalAdmin.password);
    debugLog(`Match: ${isMatch}`);
    
    if (isMatch) {
      debugLog('SUCCESS');
      req.session.admin = { id: finalAdmin.id, username: finalAdmin.username, role: finalAdmin.role };
      req.session.save((err) => {
        if (err) {
          debugLog(`Session save error: ${err.message}`);
          return res.status(500).send('Session save error');
        }
        res.redirect('/admin/dashboard');
      });
      return;
    }
    debugLog('FAILED: Password mismatch');
    res.render('admin/login', { title: 'Kirish', error: 'Login yoki parol noto\'g\'ri', layout: false });
  } catch (err) {
    debugLog(`ERROR: ${err.message}`);
    console.error('Login error:', err);
    res.status(500).send(err.message);
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

export const getDashboard = async (req, res) => {
  try {
    const stats = {
      applications: await db.count('applications'),
      news: await db.count('news'),
      pendingApps: await db.count('applications', [where('status', '==', 'pending')]),
      messages: await db.count('messages')
    };
    res.render('admin/dashboard', { 
      title: 'Dashboard',
      stats,
      layout: 'layouts/admin'
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send(err.message);
  }
};

// News CRUD (Multi-language)
export const getNews = async (req, res) => {
  const newsList = await db.getAll('news', [orderBy('date', 'desc')]);
  res.render('admin/news/index', { title: 'Yangiliklar boshqaruvi', news: newsList, layout: 'layouts/admin' });
};

export const getCreateNews = (req, res) => {
  res.render('admin/news/create', { title: 'Yangi yangilik qo\'shish', layout: 'layouts/admin' });
};

export const postNews = async (req, res) => {
  try {
    const { title_uz, title_ru, title_en, content_uz, content_ru, content_en, image, category, status } = req.body;
    await db.create('news', {
      title: { uz: title_uz, ru: title_ru, en: title_en },
      content: { uz: content_uz, ru: content_ru, en: content_en },
      image,
      category,
      status: status || 'published',
      date: new Date()
    });
    res.redirect('/admin/news');
  } catch (err) {
    console.error('Create news error:', err);
    res.status(500).send(err.message);
  }
};

export const getEditNews = async (req, res) => {
  const item = await db.getOne('news', req.params.id);
  res.render('admin/news/edit', { title: 'Yangilikni tahrirlash', item, layout: 'layouts/admin' });
};

export const putNews = async (req, res) => {
  try {
    const { title_uz, title_ru, title_en, content_uz, content_ru, content_en, image, category, status } = req.body;
    await db.update('news', req.params.id, {
      title: { uz: title_uz, ru: title_ru, en: title_en },
      content: { uz: content_uz, ru: content_ru, en: content_en },
      image,
      category,
      status: status || 'published'
    });
    res.redirect('/admin/news');
  } catch (err) {
    console.error('Update news error:', err);
    res.status(500).send(err.message);
  }
};

// System Settings
export const getSettings = async (req, res) => {
  const settings = await db.findOne('settings');
  res.render('admin/settings', { title: 'Tizim sozlamalari', settings, layout: 'layouts/admin' });
};

export const updateSettings = async (req, res) => {
  try {
    const { 
      siteName, 
      bannerTitle_uz, bannerTitle_ru, bannerTitle_en,
      bannerSubtitle_uz, bannerSubtitle_ru, bannerSubtitle_en,
      bannerImage, primaryColor, secondaryColor, footerText
    } = req.body;
    
    const settings = await db.findOne('settings');
    if (settings) {
      await db.update('settings', settings.id, {
        siteName,
        bannerTitle: { uz: bannerTitle_uz, ru: bannerTitle_ru, en: bannerTitle_en },
        bannerSubtitle: { uz: bannerSubtitle_uz, ru: bannerSubtitle_ru, en: bannerSubtitle_en },
        bannerImage,
        primaryColor,
        secondaryColor,
        footerText
      });
    } else {
      await db.create('settings', {
        siteName,
        bannerTitle: { uz: bannerTitle_uz, ru: bannerTitle_ru, en: bannerTitle_en },
        bannerSubtitle: { uz: bannerSubtitle_uz, ru: bannerSubtitle_ru, en: bannerSubtitle_en },
        bannerImage,
        primaryColor,
        secondaryColor,
        footerText
      });
    }
    res.redirect('/admin/settings');
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).send(err.message);
  }
};

// Admin Management (Super Admin only)
export const getAdmins = async (req, res) => {
  if (req.session.admin.role !== 'superadmin') return res.redirect('/admin/dashboard');
  const admins = await db.getAll('admins');
  res.render('admin/admins/index', { title: 'Adminlar boshqaruvi', admins, layout: 'layouts/admin' });
};

export const postAdmin = async (req, res) => {
  if (req.session.admin.role !== 'superadmin') return res.redirect('/admin/dashboard');
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.create('admins', { username, password: hashedPassword, role });
    res.redirect('/admin/admins');
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).send(err.message);
  }
};

export const deleteAdmin = async (req, res) => {
  if (req.session.admin.role !== 'superadmin') return res.redirect('/admin/dashboard');
  try {
    const admin = await db.getOne('admins', req.params.id);
    if (admin && admin.role !== 'superadmin') {
      await db.remove('admins', req.params.id);
    }
    res.redirect('/admin/admins');
  } catch (err) {
    console.error('Delete admin error:', err);
    res.redirect('/admin/admins');
  }
};

// Applications
export const getApplications = async (req, res) => {
  const apps = await db.getAll('applications', [orderBy('createdAt', 'desc')]);
  res.render('admin/applications', { title: 'Arizalar ro\'yxati', apps, layout: 'layouts/admin' });
};

export const updateApplicationStatus = async (req, res) => {
    try {
        await db.update('applications', req.params.id, { status: req.body.status });
        res.redirect('/admin/applications');
    } catch (err) {
        console.error('Update application error:', err);
        res.status(500).send(err.message);
    }
};

export const deleteApplication = async (req, res) => {
  try {
    await db.remove('applications', req.params.id);
    res.redirect('/admin/applications');
  } catch (err) {
    console.error('Delete application error:', err);
    res.redirect('/admin/applications');
  }
};

// Budget
export const getBudget = async (req, res) => {
  const budgetData = await db.getAll('budget', [orderBy('date', 'desc')]);
  res.render('admin/budget', { title: 'Budjet ma\'lumotlari', budget: budgetData, layout: 'layouts/admin' });
};

export const postBudget = async (req, res) => {
  try {
    await db.create('budget', {
      ...req.body,
      amount: parseFloat(req.body.amount),
      date: new Date()
    });
    res.redirect('/admin/budget');
  } catch (err) {
    console.error('Create budget error:', err);
    res.status(500).send(err.message);
  }
};

export const deleteBudget = async (req, res) => {
  try {
    await db.remove('budget', req.params.id);
    res.redirect('/admin/budget');
  } catch (err) {
    console.error('Delete budget error:', err);
    res.redirect('/admin/budget');
  }
};

export const deleteNews = async (req, res) => {
  try {
    await db.remove('news', req.params.id);
    res.redirect('/admin/news');
  } catch (err) {
    console.error('Delete news error:', err);
    res.redirect('/admin/news');
  }
};

// Messages
export const getMessages = async (req, res) => {
    const messages = await db.getAll('messages', [orderBy('createdAt', 'desc')]);
    res.render('admin/messages', { title: 'Xabarlar', messages, layout: 'layouts/admin' });
};

export const deleteMessage = async (req, res) => {
    try {
      await db.remove('messages', req.params.id);
      res.redirect('/admin/messages');
    } catch (err) {
      console.error('Delete message error:', err);
      res.redirect('/admin/messages');
    }
};

// Banners management
export const getBanners = async (req, res) => {
  try {
    const banners = await db.getAll('banners', [orderBy('order', 'asc')]);
    res.render('admin/banners/index', { title: 'Bannerlar boshqaruvi', banners, layout: 'layouts/admin' });
  } catch (err) {
    console.error('Get banners error:', err);
    res.status(500).send(err.message);
  }
};

export const postBanner = async (req, res) => {
  try {
    const { title_uz, title_ru, title_en, subtitle_uz, subtitle_ru, subtitle_en, image, order } = req.body;
    await db.create('banners', {
      title: { uz: title_uz, ru: title_ru, en: title_en },
      subtitle: { uz: subtitle_uz, ru: subtitle_ru, en: subtitle_en },
      image,
      active: true,
      order: parseInt(order) || 0,
      createdAt: new Date()
    });
    res.redirect('/admin/banners');
  } catch (err) {
    console.error('Create banner error:', err);
    res.status(500).send(err.message);
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await db.remove('banners', req.params.id);
    res.redirect('/admin/banners');
  } catch (err) {
    console.error('Delete banner error:', err);
    res.redirect('/admin/banners');
  }
};

export const toggleBanner = async (req, res) => {
  try {
    const banner = await db.getOne('banners', req.params.id);
    if (banner) {
      await db.update('banners', req.params.id, { active: !banner.active });
    }
    res.redirect('/admin/banners');
  } catch (err) {
    console.error('Toggle banner error:', err);
    res.redirect('/admin/banners');
  }
};
