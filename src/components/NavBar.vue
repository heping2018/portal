<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        <img src="/logo.svg" alt="App Logo" />
        <span>Maxunitech</span>
      </router-link>

      <div class="nav-menu">
        <router-link to="/" class="nav-item">{{ t('nav.home') }}</router-link>
        <router-link to="/products" class="nav-item">{{ t('nav.products') }}</router-link>
        <router-link to="/news" class="nav-item">{{ t('nav.news') }}</router-link>
        <router-link to="/certifications" class="nav-item">{{ t('nav.certifications') }}</router-link>
        <router-link to="/about" class="nav-item">{{ t('nav.about') }}</router-link>
      </div>

      <div class="nav-actions">
        <LanguageSwitcher />

        <div v-if="isAuthenticated" class="user-actions">
          <span v-if="currentUser">{{ t('nav.welcome', { name: currentUser.name }) }}</span>
          <router-link to="/admin/dashboard" class="nav-button admin-button">Admin</router-link>
          <button @click="handleLogout" class="nav-button logout-button">{{ t('nav.logout') }}</button>
        </div>
        <div v-else class="user-actions">
          <router-link to="/admin/dashboard" class="nav-button admin-button">Admin</router-link>
          <router-link to="/login" class="nav-button login-button">{{ t('nav.login') }}</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t } = useI18n();
const router = useRouter();
const { isAuthenticated, currentUser, logout } = useAuth();

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  padding: 0 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: rgba(0, 21, 41, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 195, 255, 0.2);
  transition: background-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease;
}

.navbar.scrolled {
  background-color: #001529;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.navbar-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 1.5rem;
}

.navbar-logo img {
  height: 30px;
  margin-right: 0.5rem;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: #c0c0c0;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-item::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #00c3ff;
    transition: width 0.3s ease-in-out;
}

.nav-item:hover, .router-link-exact-active {
  color: #ffffff;
}

.nav-item:hover::after, .router-link-exact-active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #e0e0e0;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.admin-button {
  background: transparent;
  color: #00AEEF;
  border-color: #00AEEF;
}

.admin-button:hover {
  background: #00AEEF;
  color: #000B18;
  box-shadow: 0 0 10px rgba(0, 174, 239, 0.5);
}

.login-button {
  background: #00c3ff;
  color: #001529;
}

.login-button:hover {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.7);
}

.logout-button {
  background: transparent;
  color: #ff4d4d;
  border-color: #ff4d4d;
}

.logout-button:hover {
  background: #ff4d4d;
  color: white;
}
</style>
