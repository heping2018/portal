import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Layouts
import PublicLayout from '../layouts/PublicLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

// Public Views
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import SmsLoginView from '../views/SmsLoginView.vue';
import AuthCallbackView from '../views/AuthCallbackView.vue';
import CertificateView from '../views/CertificateView.vue';
import NewsView from '../views/NewsView.vue';
import NewsDetailView from '../views/NewsDetailView.vue';
import AboutView from '../views/AboutView.vue';

// Admin Views
import AdminDashboardView from '../views/AdminDashboardView.vue';
import AdminUserView from '../views/AdminUserView.vue';
import AdminProductView from '../views/AdminProductView.vue';
import AdminNewsView from '../views/AdminNewsView.vue';
import AdminCertificateView from '../views/AdminCertificateView.vue';
import AdminAuthConfigView from '../views/AdminAuthConfigView.vue';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'HomeView',
        component: HomeView
      },
      {
        path: 'products',
        name: 'ProductView',
        component: ProductView
      },
      {
        path: 'products/:id',
        name: 'ProductDetailView',
        component: ProductDetailView,
        props: true
      },
      {
        path: 'certifications',
        name: 'CertificateView',
        component: CertificateView,
      },
      {
        path: 'news',
        name: 'NewsView',
        component: NewsView,
      },
      {
        path: 'news/:id',
        name: 'NewsDetailView',
        component: NewsDetailView,
        props: true
      },
      {
        path: 'about',
        name: 'AboutView',
        component: AboutView,
      },
      {
        path: 'login',
        name: 'LoginView',
        component: LoginView
      },
      {
        path: 'register',
        name: 'RegisterView',
        component: RegisterView
      },
      {
        path: 'forgot-password',
        name: 'ForgotPasswordView',
        component: ForgotPasswordView
      },
      {
        path: 'reset-password',
        name: 'ResetPasswordView',
        component: ResetPasswordView
      },
      {
        path: 'sms-login',
        name: 'SmsLoginView',
        component: SmsLoginView
      },
      {
        path: 'auth/callback',
        name: 'AuthCallbackView',
        component: AuthCallbackView
      },
    ]
  },

  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    // meta: { requiresAuth: true }, // Temporarily disabled for preview
    redirect: '/admin/dashboard', // Redirect /admin to /admin/dashboard
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboardView
      },
      {
        path: 'users',
        name: 'AdminUserView',
        component: AdminUserView
      },
      {
        path: 'products',
        name: 'AdminProductView',
        component: AdminProductView
      },
      {
        path: 'news',
        name: 'AdminNewsView',
        component: AdminNewsView
      },
      {
        path: 'certificates',
        name: 'AdminCertificateView',
        component: AdminCertificateView
      },
      {
        path: 'auth-config',
        name: 'AdminAuthConfigView',
        component: AdminAuthConfigView
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Temporarily disabled for preview
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next({ name: 'LoginView' });
//   } else {
//     next();
//   }
// });

export default router;
