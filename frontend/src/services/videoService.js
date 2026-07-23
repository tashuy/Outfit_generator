import api from './api';

export const videoService = {
  getVideos: async () => {
    const response = await api.get('/public/videos');
    return response.data;
  },
  searchVideosByLocation: async (location) => {
    const response = await api.get('/public/videos/search', { params: { location } });
    return response.data;
  },
  uploadVideo: async (formData) => {
    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
