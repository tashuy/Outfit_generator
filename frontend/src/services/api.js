import axios from 'axios';
import { useAuthStore } from '../store/authStore';

let rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
rawApiUrl = rawApiUrl.replace(/\/+$/, '');
if (!rawApiUrl.endsWith('/api')) {
  rawApiUrl = `${rawApiUrl}/api`;
}

const API_URL = rawApiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  updatePreferences: async (gender, style, budget) => {
    const response = await api.put('/user/preferences', { gender, style, budget });
    return response.data;
  },
  getSearchHistory: async () => {
    const response = await api.get('/user/search-history');
    return response.data;
  }
};

export const recommendationService = {
  generateRecommendation: async (requestData, isAuthenticated) => {
    const endpoint = isAuthenticated ? '/recommendations/generate' : '/public/recommendations/generate';
    const response = await api.post(endpoint, requestData);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/recommendations/history');
    return response.data;
  },
  saveLook: async (lookId) => {
    const response = await api.post(`/recommendations/save-look/${lookId}`);
    return response.data;
  },
  unsaveLook: async (lookId) => {
    const response = await api.delete(`/recommendations/unsave-look/${lookId}`);
    return response.data;
  },
  getSavedLooks: async () => {
    const response = await api.get('/recommendations/saved-looks');
    return response.data;
  }
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlist/add/${productId}`);
    return response.data;
  },
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  }
};

export const productService = {
  searchProducts: async (query, budget) => {
    const params = { q: query };
    if (budget) params.budget = budget;
    const response = await api.get('/public/products/search', { params });
    return response.data;
  }
};

export default api;
