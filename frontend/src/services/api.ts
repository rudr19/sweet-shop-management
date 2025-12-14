import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Sweet,
  CreateSweet,
  UpdateSweet
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  }
};

// Sweets API
export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets');
    return response.data;
  },

  getById: async (id: number): Promise<Sweet> => {
    const response = await api.get(`/api/sweets/${id}`);
    return response.data;
  },

  create: async (sweet: CreateSweet): Promise<Sweet> => {
    const response = await api.post('/api/sweets', sweet);
    return response.data;
  },

  update: async (id: number, sweet: UpdateSweet): Promise<Sweet> => {
    const response = await api.put(`/api/sweets/${id}`, sweet);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/sweets/${id}`);
  },

  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets/search', { params });
    return response.data;
  },

  purchase: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  restock: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
    return response.data;
  }
};

// Profile API
export const profileAPI = {
  get: async (): Promise<any> => {
    const response = await api.get('/api/profile');
    return response.data;
  },

  update: async (profileData: any): Promise<any> => {
    const response = await api.put('/api/profile', profileData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<any> => {
    const response = await api.post('/api/profile/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  getAll: async (status?: string): Promise<any[]> => {
    const params = status ? { status } : {};
    const response = await api.get('/api/orders', { params });
    return response.data;
  },

  getById: async (id: number): Promise<any> => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  create: async (orderData: any): Promise<any> => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  }
};

// Payment Methods API
export const paymentMethodsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/api/payment-methods');
    return response.data;
  },

  add: async (paymentData: any): Promise<any> => {
    const response = await api.post('/api/payment-methods', paymentData);
    return response.data;
  },

  setDefault: async (id: number): Promise<any> => {
    const response = await api.put(`/api/payment-methods/${id}/default`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/payment-methods/${id}`);
  }
};

export default api;
