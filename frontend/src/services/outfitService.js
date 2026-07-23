import api from './api';

export const outfitService = {
  // Public endpoints
  getAllOutfits: async () => {
    const response = await api.get('/public/videos');
    return response.data;
  },

  getOutfitById: async (id) => {
    const response = await api.get(`/public/videos/${id}`);
    return response.data;
  },

  getOutfitsByCategory: async (category) => {
    const response = await api.get(`/public/videos/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  getOutfitsByLocation: async (location) => {
    const response = await api.get(`/public/videos/location/${encodeURIComponent(location)}`);
    return response.data;
  },

  // Admin endpoints
  createOutfit: async (outfitData) => {
    const response = await api.post('/admin/outfits', outfitData);
    return response.data;
  },

  updateOutfit: async (id, outfitData) => {
    const response = await api.put(`/admin/outfits/${id}`, outfitData);
    return response.data;
  },

  deleteOutfit: async (id) => {
    const response = await api.delete(`/admin/outfits/${id}`);
    return response.data;
  },
};

export default outfitService;
