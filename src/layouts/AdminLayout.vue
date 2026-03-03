<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">
        <router-link to="/">Maxunitech Admin</router-link>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin/dashboard">{{ t('admin.title') }}</router-link>
        <router-link to="/admin/users">{{ t('user_management.title') }}</router-link>
        <router-link to="/admin/system/role">{{ t('admin.role_management') }}</router-link>
        <router-link to="/admin/products">{{ t('admin.product_management') }}</router-link>
        <router-link to="/admin/news">{{ t('admin.news_management') }}</router-link>
        <router-link to="/admin/certificates">{{ t('admin.certificate_management') }}</router-link>
        <router-link to="/admin/categories">{{ t('admin.category_management') }}</router-link>
        <router-link to="/admin/dictionary">{{ t('admin.dictionary_management') }}</router-link>
        <router-link to="/admin/files">{{ t('admin.file_management') }}</router-link>
      </nav>
    </aside>
    <div class="main-content-wrapper">
      <header class="admin-header">
        <div class="user-info">
          <span>{{ t('nav.welcome', { name: user?.nickname || 'Admin' }) }}</span>
          <button @click="handleLogout" class="logout-button">{{ t('nav.logout') }}</button>
        </div>
      </header>
      <main class="admin-page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/authStore';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Using :root on the component is fine for local scoping CSS variables */
:root {
  --deep-navy-blue: #0A0F1E;
  --midnight-blue: #0D152A;
  --glow-blue: #00BFFF;
  --border-blue: rgba(0, 150, 255, 0.2);
  --text-primary: #E0EFFF;
  --text-secondary: #B0C4DE;
}

.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(170deg, var(--deep-navy-blue), var(--midnight-blue));
  color: var(--text-primary);
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: rgba(13, 21, 42, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid var(--border-blue);
  padding: 0;
  height: 100vh; /* Make sidebar full height */
}

.logo {
  padding: 20px 24px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-blue);
  color: var(--text-primary);
  flex-shrink: 0;
}

.logo a {
  color: inherit;
  text-decoration: none;
}

.admin-nav {
  flex-grow: 1;
  padding-top: 16px;
  overflow-y: auto;
}

.admin-nav a {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 8px 16px;
  border-radius: 8px;
  position: relative;
  border-left: 4px solid transparent;
}

.admin-nav a:hover {
  background-color: rgba(0, 191, 255, 0.1);
  color: var(--text-primary);
}

.admin-nav a.router-link-exact-active {
  background-color: rgba(13, 21, 42, 0.9);
  color: var(--glow-blue);
  font-weight: 600;
  border-left-color: var(--glow-blue);
  box-shadow: inset 3px 0 10px -2px rgba(0, 191, 255, 0.3);
}

.main-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh; /* Make wrapper full height */
  overflow: hidden;
}

.admin-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  flex-shrink: 0;
  background-color: rgba(13, 21, 42, 0.5);
  border-bottom: 1px solid var(--border-blue);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logout-button {
  border: 1px solid var(--border-blue);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  color: var(--glow-blue);
  border-color: var(--glow-blue);
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
}

.admin-page-content {
  flex-grow: 1;
  overflow-y: auto; /* Enable vertical scrolling for content area */
  padding: 24px;
  background-color: transparent; /* Content area background */
}

/* Custom scrollbar for webkit browsers */
.admin-nav::-webkit-scrollbar,
.admin-page-content::-webkit-scrollbar {
  width: 8px;
}

.admin-nav::-webkit-scrollbar-track,
.admin-page-content::-webkit-scrollbar-track {
  background: transparent;
}

.admin-nav::-webkit-scrollbar-thumb,
.admin-page-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 191, 255, 0.3);
  border-radius: 4px;
}

.admin-nav::-webkit-scrollbar-thumb:hover,
.admin-page-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 191, 255, 0.5);
}
</style>