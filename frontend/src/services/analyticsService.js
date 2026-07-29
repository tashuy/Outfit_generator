import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },

  getTopOutfits: async () => {
    const response = await api.get('/admin/analytics/top-outfits');
    return response.data;
  },

  getTopLocations: async () => {
    const response = await api.get('/admin/analytics/top-locations');
    return response.data;
  },

  getTopCategories: async () => {
    const response = await api.get('/admin/analytics/top-categories');
    return response.data;
  },

  trackProductClick: async (productId) => {
    const response = await api.post(`/public/products/${productId}/click`);
    return response.data;
  },
};

export default analyticsService;
