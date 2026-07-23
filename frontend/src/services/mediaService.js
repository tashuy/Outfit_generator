import api from './api';

export const mediaService = {
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMedia: async (publicId) => {
    const response = await api.delete('/admin/media', {
      params: { publicId },
    });
    return response.data;
  },
};

export default mediaService;
