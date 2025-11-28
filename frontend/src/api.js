import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Summary stats
export const getSummary = () => api.get('/api/stats/summary');

// Content
export const getContent = () => api.get('/api/content');
export const getContentById = (id) => api.get(`/api/content/${id}`);

// Compare
export const compareItems = (ids) => api.post('/api/compare', { ids });
// Старое имя для совместимости
export const postCompare = (ids) => compareItems(ids);

// Chat
export const askLLM = (query) => api.post('/api/chat', { query });
// Старое имя для совместимости
export const postChat = (query) => askLLM(query);

// Auth
export const login = (email, password) => api.post('/api/auth/login', { email, password });
export const register = (email, password) => api.post('/api/auth/register', { email, password });
export const getProfile = (email) => api.get('/api/user/profile', { params: { email } });
export const updateProfile = (req) => api.put('/api/user/profile', req);
export const uploadAvatar = (email, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/user/avatar', formData, {
    params: { email },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
