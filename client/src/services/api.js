import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Update with your server URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = (credentials) => api.post('/api/auth/login', credentials);

// User API
export const getUsers = () => api.get('/api/users');
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const createUser = (userData) => api.post('/api/users', userData);
export const updateUser = (id, userData) => api.put(`/api/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// Health check
export const checkHealth = () => api.get('/health');

export default api;
