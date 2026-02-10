import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers.set('Authorization', `Bearer ${user.token}`);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default api;
