import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer as createViteServer } from 'vite';
// import mongoose from 'mongoose'; // Removed Mongoose
import session from 'express-session';
// import MongoStore from 'connect-mongo'; // Removed MongoStore
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import bcrypt from 'bcryptjs';
import { 
  collection, 
  getDocs, 
  query, 
  limit, 
  addDoc, 
  serverTimestamp,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './lib/firebase.js';
import * as dbHelper from './lib/db.js';
import { translations } from './lib/translations.js';

// Routes
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log('Starting application...');

  const app = express();
  const PORT = 3000;

  // View Engine
  app.use(expressLayouts);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('layout', 'layouts/main');

  // Middlewares
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));

  app.set('trust proxy', 1);

  // Session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'none',
      secure: true 
    }
  }));

  // Language Middleware
  app.use((req, res, next) => {
    const lang = req.query.lang || req.session.lang || 'uz';
    req.session.lang = lang;
    res.locals.lang = lang;
    next();
  });

  // Global settings
  app.use(async (req, res, next) => {
    try {
      let settings = await dbHelper.findOne('settings');
      const defaults = {
        siteName: 'Ixtisoslashtirilgan Maktab',
        logo: '/images/logo.png',
        primaryColor: '#003366',
        secondaryColor: '#fbbf24',
        bannerTitle: { uz: '', ru: '', en: '' },
        bannerSubtitle: { uz: '', ru: '', en: '' }
      };

      if (!settings) {
        settings = defaults;
      } else {
        settings = { ...defaults, ...settings };
      }
      res.locals.settings = settings;
      res.locals.admin = req.session.admin || null;
      res.locals.path = req.path;
      res.locals.t = (key) => translations[res.locals.lang][key] || key;
      next();
    } catch (err) {
      console.error('Global middleware error:', err);
      res.locals.settings = { siteName: 'Maktab', logo: '', primaryColor: '#003366', secondaryColor: '#fbbf24' };
      next();
    }
  });

  // Use Routes
  app.use('/', publicRoutes);
  app.use('/admin', adminRoutes);

  // DEBUG ROUTE - REMOVE LATER
  app.get('/api/debug-admins', async (req, res) => {
    try {
      const admins = await dbHelper.getAll('admins');
      res.json(admins.map(a => ({ id: a.id, username: a.username, role: a.role, hasPassword: !!a.password })));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Use custom since we have our own routing
    });
    app.use(vite.middlewares);
  }

  // Error Handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/error', { 
      title: 'Xatolik',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Ichki server xatosi yuz berdi'
    });
  });

  // Seed data
  const seedInitialData = async () => {
    console.log('--- Seeding Check ---');
    if (!db) {
      console.error('❌ Database not initialized during seeding!');
      return;
    }
    try {
      const userRaw = (process.env.ADMIN_USERNAME || 'admin').trim();
      const passRaw = (process.env.ADMIN_PASSWORD || 'password123').trim();
      
      const debugLog = (msg) => {
        fs.appendFileSync('login_debug.log', `${new Date().toISOString()} - SEED: ${msg}\n`);
      };

      await debugLog(`Seeding config: user="${userRaw}", passLen=${passRaw.length}`);
      
      const adminCount = await dbHelper.count('admins');
      await debugLog(`Current total admin count: ${adminCount}`);
      
      const defaultAdmin = await dbHelper.findOne('admins', [where('username', '==', userRaw)]);
      
      if (!defaultAdmin) {
        await debugLog(`Default admin "${userRaw}" not found, creating...`);
        const hashedPassword = await bcrypt.hash(passRaw, 10);
        await dbHelper.create('admins', {
          username: userRaw,
          password: hashedPassword,
          role: 'superadmin'
        });
        await debugLog(`✅ Default admin created: ${userRaw}`);
      } else {
        await debugLog(`Default admin "${userRaw}" exists, updating password...`);
        const hashedPassword = await bcrypt.hash(passRaw, 10);
        await dbHelper.update('admins', defaultAdmin.id, {
          password: hashedPassword
        });
        await debugLog(`✅ Default admin "${userRaw}" password updated.`);
      }

      // Backup admin for safety if the primary is not exactly 'admin'
      if (userRaw !== 'admin') {
        const backupAdmin = await dbHelper.findOne('admins', [where('username', '==', 'admin')]);
        if (!backupAdmin) {
          await debugLog('Creating backup admin "admin"...');
          const backupHash = await bcrypt.hash('password123', 10);
          await dbHelper.create('admins', {
            username: 'admin',
            password: backupHash,
            role: 'superadmin'
          });
          await debugLog('✅ Backup admin "admin" created.');
        } else {
          await debugLog('Updating backup admin "admin" password to password123...');
          const backupHash = await bcrypt.hash('password123', 10);
          await dbHelper.update('admins', backupAdmin.id, {
            password: backupHash
          });
          await debugLog('✅ Backup admin "admin" password updated.');
        }
      }
    } catch (err) {
      console.error('❌ Seeding error:', err);
    }
    console.log('--- Seeding Check Done ---');
  };
  await seedInitialData();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
