import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import i18n from '../i18n';
import router from '../router';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Restore the correct base URL
  timeout: 10000,
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    
    if (authStore.accessToken) {
      config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }

    const locale = i18n.global.locale.value;
    if (locale) {
      config.headers['Accept-Language'] = locale === 'zh' ? 'zh-CN' : locale;
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
    const res = response.data;

    if (typeof res.code !== 'undefined' && res.code !== 0) {
      console.error('API Error:', res.msg || 'Unknown error code');

      if (res.code === 401) {
        setTimeout(() => {
          const authStore = useAuthStore();
          authStore.logout();
          if (router.currentRoute.value.path !== '/login') {
            router.push('/login');
          }
        }, 0);
      }
      
      return Promise.reject(new Error(res.msg || 'API Error'));
    }

    if (response.config.url && response.config.url.includes('admin-api/system/auth/login')) {
      return res;
    }

    return res.data;
  },
  (error) => {
    console.error('Network or other interceptor error:', error.message);

   if (error.response && error.response.status === 401) {
        setTimeout(() => {
            const authStore = useAuthStore();
            authStore.logout();
            if (router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
        }, 0);
    }

    return Promise.reject(error);
  }
);

export default service;
