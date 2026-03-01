import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    // Only add auth token for admin-api routes, which require authentication
    if (authStore.token && config.url.startsWith('/admin-api')) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (response) => {
    // Check if the request was for a public endpoint (e.g., /products, /certificates)
    const isPublicEndpoint = !response.config.url.startsWith('/admin-api');

    if (isPublicEndpoint) {
      // For public endpoints, the data is typically returned directly by the server.
      // We bypass the structured response check and return the data as is.
      return response.data;
    }

    // For protected /admin-api endpoints, we expect the { code, data, message } structure.
    const res = response.data;
    if (res.code !== 0) {
      console.error('API Error for admin endpoint:', res.message || 'Unknown error');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data;
  },
  (error) => {
    console.error('Response interceptor error:', error.message);
    // Let the caller's .catch() block handle the error.
    return Promise.reject(error);
  }
);

export default service;
