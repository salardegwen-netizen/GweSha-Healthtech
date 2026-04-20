import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout to prevent hanging connections
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and auth failures
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response?.status === 404) {
        toast.error('Resource not found.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (!error.response) {
        toast.error('Network error. Please check your connection.');
      } else {
        const message = (error.response.data as any)?.message || 'An error occurred';
        toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

// API Service methods
export const api = {
  // ========== AUTHENTICATION ==========
  auth: {
    login: (email: string, password: string, role?: string) =>
      apiClient.post('/auth/login', { email, password, role }),
    register: (name: string, email: string, password: string, role: string, password_confirmation: string) =>
      apiClient.post('/auth/register', { name, email, password, password_confirmation, role }),
    logout: () => apiClient.post('/auth/logout'),
    me: () => apiClient.get('/auth/me'),
  },

  // ========== PATIENTS ==========
  patients: {
    list: () => apiClient.get('/patients'),
    create: (data: any) => apiClient.post('/patients', data),
    show: (id: number) => apiClient.get(`/patients/${id}`),
    update: (id: number, data: any) => apiClient.put(`/patients/${id}`, data),
    delete: (id: number) => apiClient.delete(`/patients/${id}`),
    appointments: (id: number) => apiClient.get(`/patients/${id}/appointments`),
    invoices: (id: number) => apiClient.get(`/patients/${id}/invoices`),
    healthRecords: (id: number) => apiClient.get(`/patients/${id}/health-records`),
    getMe: () => apiClient.get('/patients/me'),
    updateProfile: (data: any) => apiClient.put('/patients/me', data),
  },

  // ========== APPOINTMENTS ==========
  appointments: {
    list: () => apiClient.get('/appointments'),
    create: (data: any) => apiClient.post('/appointments', data),
    show: (id: number) => apiClient.get(`/appointments/${id}`),
    update: (id: number, data: any) => apiClient.put(`/appointments/${id}`, data),
    delete: (id: number) => apiClient.delete(`/appointments/${id}`),
  },

  // ========== INVOICES & BILLING ==========
  invoices: {
    list: () => apiClient.get('/invoices'),
    create: (data: any) => apiClient.post('/invoices', data),
    show: (id: number) => apiClient.get(`/invoices/${id}`),
  },
  billing: {
    dashboardMetrics: () => apiClient.get('/billing/dashboard-metrics'),
    payments: {
      create: (data: any) => apiClient.post('/payments', data),
    },
  },

  // ========== STAFF ==========
  staff: {
    list: () => apiClient.get('/staff'),
    create: (data: any) => apiClient.post('/staff', data),
    show: (id: number) => apiClient.get(`/staff/${id}`),
    update: (id: number, data: any) => apiClient.put(`/staff/${id}`, data),
    delete: (id: number) => apiClient.delete(`/staff/${id}`),
    updateStatus: (id: number, status: string) =>
      apiClient.put(`/staff/${id}/status`, { status }),
  },

  // ========== SCHEDULE ==========
  schedule: {
    list: () => apiClient.get('/schedule'),
    createBlock: (data: any) => apiClient.post('/schedule/blocks', data),
    updateBlock: (id: number, data: any) =>
      apiClient.put(`/schedule/blocks/${id}`, data),
    deleteBlock: (id: number) => apiClient.delete(`/schedule/blocks/${id}`),
  },

  // ========== HEALTH RECORDS ==========
  healthRecords: {
    list: () => apiClient.get('/health-records'),
    create: (data: any) => apiClient.post('/health-records', data),
    show: (id: number) => apiClient.get(`/health-records/${id}`),
    update: (id: number, data: any) => apiClient.put(`/health-records/${id}`, data),
    delete: (id: number) => apiClient.delete(`/health-records/${id}`),
  },

  // ========== VITALS ==========
  vitals: {
    current: () => apiClient.get('/vitals/current'),
    create: (data: any) => apiClient.post('/vitals', data),
    history: () => apiClient.get('/vitals/history'),
  },

  // ========== SPECIALISTS ==========
  specialists: {
    list: () => apiClient.get('/specialists'),
  },

  // ========== SETTINGS ==========
  settings: {
    get: () => apiClient.get('/settings'),
    updateClinicProfile: (data: any) => apiClient.post('/settings/clinic-profile', data),
    updateBillingConfig: (data: any) => apiClient.post('/settings/billing-config', data),
    updateNotifications: (data: any) => apiClient.post('/settings/notifications', data),
    updateSecurity: (data: any) => apiClient.post('/settings/security', data),
  },

  // ========== NOTIFICATIONS ==========
  notifications: {
    list: () => apiClient.get('/notifications'),
    markAsRead: (id: number | string) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.post('/notifications/mark-all-read'),
    clearAll: () => apiClient.delete('/notifications/clear-all'),
    unreadCount: () => apiClient.get('/notifications/unread-count'),
  },
};
