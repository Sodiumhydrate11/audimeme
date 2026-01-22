import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (username, email, password) => 
    api.post('/auth/signup', { username, email, password }),
  signin: (email, password) => 
    api.post('/auth/signin', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const audioAPI = {
  uploadAudio: (formData) => 
    api.post('/audio/upload', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  getMyAudios: () => api.get('/audio/my-audios'),
  getPublicAudios: () => api.get('/audio/public'),
  getAudio: (id) => api.get(`/audio/${id}`),
  deleteAudio: (id) => api.delete(`/audio/${id}`),
  shareOnWhatsApp: (id) => api.post(`/audio/${id}/share`),
  trackPlay: (id) => api.post(`/audio/${id}/play`)
};

export default api;
