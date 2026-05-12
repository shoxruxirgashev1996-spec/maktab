import { Response } from 'express';
import { AuthRequest, generateToken } from '../middleware/auth.js';
import { sendSuccess } from '../utils/helpers.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';
import FirebaseService from '../services/firebase.service.js';
import { AppError } from '../middleware/errorHandler.js';

// ============================================
// AUTHENTICATION
// ============================================

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const admins = await FirebaseService.queryDocuments('admins', 'email', '==', email.toLowerCase());
  
  if (admins.length === 0) {
    throw new AppError('Invalid credentials', 401);
  }

  const admin = admins[0];
  const passwordMatch = await comparePassword(password, admin.password);

  if (!passwordMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(admin.id, admin.email, admin.role || 'admin');

  sendSuccess(res, {
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
  }, 'Login successful');
};

export const logout = async (req: AuthRequest, res: Response) => {
  sendSuccess(res, null, 'Logout successful');
};

// ============================================
// DASHBOARD
// ============================================

export const getDashboard = async (req: AuthRequest, res: Response) => {
  const [newsCount, applicationsCount, messagesCount] = await Promise.all([
    FirebaseService.getDocuments('news').then(d => d.length),
    FirebaseService.getDocuments('applications').then(d => d.length),
    FirebaseService.getDocuments('messages').then(d => d.length)
  ]);

  sendSuccess(res, {
    newsCount,
    applicationsCount,
    messagesCount,
    adminEmail: req.admin?.email
  }, 'Dashboard data retrieved');
};

// ============================================
// NEWS MANAGEMENT
// ============================================

export const getNews = async (req: AuthRequest, res: Response) => {
  const news = await FirebaseService.getDocuments('news');
  sendSuccess(res, news, 'News retrieved');
};

export const createNews = async (req: AuthRequest, res: Response) => {
  const { title, content, author, featured_image, category } = req.body;

  if (!title || !content || !author) {
    throw new AppError('Title, content, and author are required', 400);
  }

  const news = await FirebaseService.createDocument('news', {
    title,
    content,
    author,
    featured_image,
    category,
    published: true
  });

  sendSuccess(res, news, 'News created successfully', 201);
};

export const updateNews = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, author, featured_image, category } = req.body;

  const news = await FirebaseService.updateDocument('news', id, {
    title,
    content,
    author,
    featured_image,
    category
  });

  sendSuccess(res, news, 'News updated successfully');
};

export const deleteNews = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await FirebaseService.deleteDocument('news', id);
  sendSuccess(res, null, 'News deleted successfully');
};

// ============================================
// BANNERS MANAGEMENT
// ============================================

export const getBanners = async (req: AuthRequest, res: Response) => {
  const banners = await FirebaseService.getDocuments('banners');
  sendSuccess(res, banners, 'Banners retrieved');
};

export const createBanner = async (req: AuthRequest, res: Response) => {
  const { title, subtitle, image_url, link } = req.body;

  if (!title || !subtitle || !image_url) {
    throw new AppError('Title, subtitle, and image_url are required', 400);
  }

  const banner = await FirebaseService.createDocument('banners', {
    title,
    subtitle,
    image_url,
    link,
    active: true
  });

  sendSuccess(res, banner, 'Banner created successfully', 201);
};

export const updateBanner = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, image_url, link, active } = req.body;

  const banner = await FirebaseService.updateDocument('banners', id, {
    title,
    subtitle,
    image_url,
    link,
    active
  });

  sendSuccess(res, banner, 'Banner updated successfully');
};

export const deleteBanner = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await FirebaseService.deleteDocument('banners', id);
  sendSuccess(res, null, 'Banner deleted successfully');
};

export const toggleBanner = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const banner = await FirebaseService.getDocument('banners', id);

  if (!banner) {
    throw new AppError('Banner not found', 404);
  }

  const updated = await FirebaseService.updateDocument('banners', id, {
    active: !banner.active
  });

  sendSuccess(res, updated, 'Banner toggled successfully');
};

// ============================================
// APPLICATIONS MANAGEMENT
// ============================================

export const getApplications = async (req: AuthRequest, res: Response) => {
  const applications = await FirebaseService.getDocuments('applications');
  sendSuccess(res, applications, 'Applications retrieved');
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const updated = await FirebaseService.updateDocument('applications', id, { status });
  sendSuccess(res, updated, 'Application status updated');
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await FirebaseService.deleteDocument('applications', id);
  sendSuccess(res, null, 'Application deleted successfully');
};

// ============================================
// BUDGET MANAGEMENT
// ============================================

export const getBudget = async (req: AuthRequest, res: Response) => {
  const budget = await FirebaseService.getDocuments('budget');
  sendSuccess(res, budget, 'Budget retrieved');
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  const { category, amount, description } = req.body;

  if (!category || !amount) {
    throw new AppError('Category and amount are required', 400);
  }

  const budget = await FirebaseService.createDocument('budget', {
    category,
    amount,
    description
  });

  sendSuccess(res, budget, 'Budget item created successfully', 201);
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await FirebaseService.deleteDocument('budget', id);
  sendSuccess(res, null, 'Budget item deleted successfully');
};

// ============================================
// MESSAGES
// ============================================

export const getMessages = async (req: AuthRequest, res: Response) => {
  const messages = await FirebaseService.getDocuments('messages');
  sendSuccess(res, messages, 'Messages retrieved');
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await FirebaseService.deleteDocument('messages', id);
  sendSuccess(res, null, 'Message deleted successfully');
};

// ============================================
// SETTINGS
// ============================================

export const getSettings = async (req: AuthRequest, res: Response) => {
  const settings = await FirebaseService.getDocuments('settings');
  sendSuccess(res, settings[0] || {}, 'Settings retrieved');
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  const settingsDoc = await FirebaseService.getDocuments('settings');
  
  if (settingsDoc.length === 0) {
    throw new AppError('Settings document not found', 404);
  }

  const updated = await FirebaseService.updateDocument('settings', settingsDoc[0].id, req.body);
  sendSuccess(res, updated, 'Settings updated successfully');
};

// ============================================
// ADMIN MANAGEMENT (Super Admin Only)
// ============================================

export const getAdmins = async (req: AuthRequest, res: Response) => {
  if (req.admin?.role !== 'super_admin') {
    throw new AppError('Only super admins can access this', 403);
  }

  const admins = await FirebaseService.getDocuments('admins');
  
  // Remove passwords from response
  const safeAdmins = admins.map(({ password, ...admin }) => admin);
  sendSuccess(res, safeAdmins, 'Admins retrieved');
};

export const createAdmin = async (req: AuthRequest, res: Response) => {
  if (req.admin?.role !== 'super_admin') {
    throw new AppError('Only super admins can create admins', 403);
  }

  const { email, password, name, role = 'admin' } = req.body;

  if (!email || !password || !name) {
    throw new AppError('Email, password, and name are required', 400);
  }

  const hashedPassword = await hashPassword(password);
  const admin = await FirebaseService.createDocument('admins', {
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    role
  });

  sendSuccess(res, { id: admin.id, email: admin.email, name: admin.name, role: admin.role }, 'Admin created successfully', 201);
};

export const deleteAdmin = async (req: AuthRequest, res: Response) => {
  if (req.admin?.role !== 'super_admin') {
    throw new AppError('Only super admins can delete admins', 403);
  }

  const { id } = req.params;
  await FirebaseService.deleteDocument('admins', id);
  sendSuccess(res, null, 'Admin deleted successfully');
};
