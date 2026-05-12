// API Service for frontend
// Handles all communication with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const PUBLIC_API = `${API_BASE_URL}/public`;
const ADMIN_API = `${API_BASE_URL}/admin`;

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json'
};

// Helper function for API calls
async function apiCall(url: string, options: FetchOptions = {}) {
  const headers = { ...defaultHeaders, ...options.headers };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const config: any = {
    method: options.method || 'GET',
    headers
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.statusText}`);
  }

  return data;
}

export const apiService = {
  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  // News
  async getNews(page = 1, limit = 10) {
    return apiCall(`${PUBLIC_API}/news?page=${page}&limit=${limit}`);
  },

  async getNewsDetail(id: string) {
    return apiCall(`${PUBLIC_API}/news/${id}`);
  },

  // Admission
  async getAdmission() {
    return apiCall(`${PUBLIC_API}/admission`);
  },

  async submitApplication(data: any) {
    return apiCall(`${PUBLIC_API}/apply`, {
      method: 'POST',
      body: data
    });
  },

  // Banners
  async getBanners() {
    return apiCall(`${PUBLIC_API}/banners`);
  },

  // Gallery
  async getGallery() {
    return apiCall(`${PUBLIC_API}/gallery`);
  },

  // Budget
  async getBudget() {
    return apiCall(`${PUBLIC_API}/budget`);
  },

  // Contact
  async sendMessage(data: any) {
    return apiCall(`${PUBLIC_API}/contact`, {
      method: 'POST',
      body: data
    });
  },

  // Check Result
  async checkResult(id: string) {
    return apiCall(`${PUBLIC_API}/check-result/${id}`);
  },

  // Settings
  async getSettings() {
    return apiCall(`${PUBLIC_API}/settings`);
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  // Authentication
  async adminLogin(email: string, password: string) {
    return apiCall(`${ADMIN_API}/login`, {
      method: 'POST',
      body: { email, password }
    });
  },

  async adminLogout(token: string) {
    return apiCall(`${ADMIN_API}/logout`, {
      method: 'POST',
      token
    });
  },

  // Dashboard
  async getDashboard(token: string) {
    return apiCall(`${ADMIN_API}/dashboard`, { token });
  },

  // News Management
  async getAdminNews(token: string) {
    return apiCall(`${ADMIN_API}/news`, { token });
  },

  async createNews(data: any, token: string) {
    return apiCall(`${ADMIN_API}/news`, {
      method: 'POST',
      body: data,
      token
    });
  },

  async updateNews(id: string, data: any, token: string) {
    return apiCall(`${ADMIN_API}/news/${id}`, {
      method: 'PUT',
      body: data,
      token
    });
  },

  async deleteNews(id: string, token: string) {
    return apiCall(`${ADMIN_API}/news/${id}`, {
      method: 'DELETE',
      token
    });
  },

  // Banners Management
  async getAdminBanners(token: string) {
    return apiCall(`${ADMIN_API}/banners`, { token });
  },

  async createBanner(data: any, token: string) {
    return apiCall(`${ADMIN_API}/banners`, {
      method: 'POST',
      body: data,
      token
    });
  },

  async updateBanner(id: string, data: any, token: string) {
    return apiCall(`${ADMIN_API}/banners/${id}`, {
      method: 'PUT',
      body: data,
      token
    });
  },

  async deleteBanner(id: string, token: string) {
    return apiCall(`${ADMIN_API}/banners/${id}`, {
      method: 'DELETE',
      token
    });
  },

  async toggleBanner(id: string, token: string) {
    return apiCall(`${ADMIN_API}/banners/${id}/toggle`, {
      method: 'PATCH',
      token
    });
  },

  // Applications
  async getApplications(token: string) {
    return apiCall(`${ADMIN_API}/applications`, { token });
  },

  async updateApplicationStatus(id: string, status: string, token: string) {
    return apiCall(`${ADMIN_API}/applications/${id}/status`, {
      method: 'PUT',
      body: { status },
      token
    });
  },

  async deleteApplication(id: string, token: string) {
    return apiCall(`${ADMIN_API}/applications/${id}`, {
      method: 'DELETE',
      token
    });
  },

  // Budget
  async getAdminBudget(token: string) {
    return apiCall(`${ADMIN_API}/budget`, { token });
  },

  async createBudget(data: any, token: string) {
    return apiCall(`${ADMIN_API}/budget`, {
      method: 'POST',
      body: data,
      token
    });
  },

  async deleteBudget(id: string, token: string) {
    return apiCall(`${ADMIN_API}/budget/${id}`, {
      method: 'DELETE',
      token
    });
  },

  // Messages
  async getMessages(token: string) {
    return apiCall(`${ADMIN_API}/messages`, { token });
  },

  async deleteMessage(id: string, token: string) {
    return apiCall(`${ADMIN_API}/messages/${id}`, {
      method: 'DELETE',
      token
    });
  },

  // Settings
  async getAdminSettings(token: string) {
    return apiCall(`${ADMIN_API}/settings`, { token });
  },

  async updateSettings(data: any, token: string) {
    return apiCall(`${ADMIN_API}/settings`, {
      method: 'PUT',
      body: data,
      token
    });
  }
};

export default apiService;
