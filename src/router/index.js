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
import RdCenterView from '../views/RdCenterView.vue';
import InnovationDetailView from '../views/InnovationDetailView.vue';
import SolutionView from '../views/SolutionView.vue';
import SolutionDetailView from '../views/SolutionDetailView.vue';
import RecruitmentView from '../views/RecruitmentView.vue';
import JobDetailView from '../views/JobDetailView.vue';
import CaseStudiesView from '../views/CaseStudiesView.vue';
import CaseStudyDetailView from '../views/CaseStudyDetailView.vue';

// About Page Components
import AboutView from '../views/AboutView.vue';
import ProfileSection from '../views/about/ProfileSection.vue';
import CultureSection from '../views/about/CultureSection.vue';
import HistorySection from '../views/about/HistorySection.vue';
import MembersSection from '../views/about/MembersSection.vue';

// Admin Views
import AdminDashboardView from '../views/AdminDashboardView.vue';
import AdminUserView from '../views/AdminUserView.vue';
import AdminProductView from '../views/AdminProductView.vue';
import AdminNewsView from '../views/AdminNewsView.vue';
import AdminCertificateView from '../views/AdminCertificateView.vue';
import AdminAuthConfigView from '../views/AdminAuthConfigView.vue';
import AdminCategoryView from '../views/AdminCategoryView.vue';
import AdminDictionaryView from '../views/AdminDictionaryView.vue';
import AdminFileView from '../views/AdminFileView.vue';
import RoleManagement from '../views/admin/system/role/RoleManagement.vue';

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
        component: AboutView,
        meta: { fullWidth: true }, // Mark this route for full-width layout
        redirect: '/about/profile',
        children: [
          {
            path: 'profile',
            name: 'AboutProfile',
            component: ProfileSection
          },
          {
            path: 'culture',
            name: 'AboutCulture',
            component: CultureSection
          },
          {
            path: 'history',
            name: 'AboutHistory',
            component: HistorySection
          },
          {
            path: 'members',
            name: 'AboutMembers',
            component: MembersSection
          },
        ]
      },
      {
        path: 'rd-center',
        name: 'RdCenterView',
        component: RdCenterView
      },
      {
        path: 'rd-center/innovations/:id',
        name: 'InnovationDetail',
        component: InnovationDetailView,
        props: true
      },
      {
        path: 'solutions',
        name: 'SolutionView',
        component: SolutionView
      },
      {
        path: 'solutions/:id',
        name: 'SolutionDetail',
        component: SolutionDetailView,
        props: true
      },
      {
        path: 'recruitment',
        name: 'Recruitment',
        component: RecruitmentView
      },
      {
        path: 'jobs/:id',
        name: 'JobDetail',
        component: JobDetailView,
        props: true
      },
       {
        path: 'case-studies',
        name: 'CaseStudiesView',
        component: CaseStudiesView
      },
      {
        path: 'case-studies/:id',
        name: 'CaseStudyDetail',
        component: CaseStudyDetailView,
        props: true
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
    meta: { requiresAuth: true }, // Enable authentication guard
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
        path: 'system/role',
        name: 'RoleManagement',
        component: RoleManagement
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
      {
        path: 'categories',
        name: 'AdminCategoryView',
        component: AdminCategoryView
      },
      {
        path: 'dictionary',
        name: 'AdminDictionaryView',
        component: AdminDictionaryView
      },
      {
        path: 'files',
        name: 'AdminFileView',
        component: AdminFileView
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  // Lazily get the store only when the guard is executed
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'LoginView', query: { redirect: to.fullPath } });
  } else if (to.name === 'LoginView' && authStore.isAuthenticated) {
    // If user is already logged in and tries to visit login page, redirect them away
    next({ name: 'AdminDashboard' }); 
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;
