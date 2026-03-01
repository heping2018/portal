<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">
        <router-link to="/admin/dashboard">Maxunitech Admin</router-link>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin/dashboard">{{ t('admin.title') }}</router-link>
        <router-link to="/admin/users">{{ t('user_management.title') }}</router-link>
        <router-link to="/admin/products">{{ t('admin.product_management') }}</router-link>
        <router-link to="/admin/news">{{ t('admin.news_management') }}</router-link>
        <router-link to="/admin/certificates">{{ t('admin.certificate_management') }}</router-link>
      </nav>
    </aside>
    <div class="main-content">
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
  background: linear-gradient(170deg, var(--deep-navy-blue), var(--midnight-blue));
  color: var(--text-primary);
}

.sidebar, .admin-header, .admin-page-content {
  background-color: rgba(13, 21, 42, 0.7); /* Slightly transparent dark blue */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-blue);
  border-radius: 16px;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.logo {
  padding: 16px 24px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-blue);
}
.logo a {
  color: var(--text-primary);
  text-decoration: none;
}

.admin-nav {
  flex-grow: 1;
  padding-top: 16px;
}

.admin-nav a {
  display: block;
  padding: 12px 24px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
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
  color: var(--text-primary);
  font-weight: bold;
  border-left: 4px solid var(--glow-blue);
  box-shadow: inset 5px 0 15px -5px rgba(0, 191, 255, 0.3);
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

.admin-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logout-button {
  border: 1px solid var(--border-blue);
  background: rgba(13, 21, 42, 0.5);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s, color 0.3s;
}

.logout-button:hover {
  color: var(--glow-blue);
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
}

.admin-page-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Custom scrollbar */
.admin-page-content::-webkit-scrollbar {
  width: 8px;
}

.admin-page-content::-webkit-scrollbar-track {
  background: transparent;
}

.admin-page-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 191, 255, 0.3);
  border-radius: 4px;
}
.admin-page-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 191, 255, 0.5);
}
</style>
