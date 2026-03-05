<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        <img src="/logo.svg" alt="App Logo" />
        <span>Company</span>
      </router-link>

      <div class="nav-menu-wrapper">
        <button 
          v-if="showLeftArrow" 
          class="nav-scroll-btn left" 
          @click="scrollLeft"
          aria-label="Scroll left"
        >
          ‹
        </button>
        
        <div class="nav-menu" ref="navMenuRef">
          <router-link to="/" class="nav-item">{{ t('nav.home') }}</router-link>
          <router-link to="/products" class="nav-item">{{ t('nav.products') }}</router-link>
          <router-link to="/news" class="nav-item">{{ t('nav.news') }}</router-link>
          <router-link to="/case-studies" class="nav-item">{{ t('nav.case_studies') }}</router-link>
          <router-link to="/solutions" class="nav-item">{{ t('nav.solutions') }}</router-link>
          <router-link to="/recruitment" class="nav-item">{{ t('nav.recruitment') }}</router-link>
          <router-link to="/certifications" class="nav-item">{{ t('nav.certifications') }}</router-link>
          <router-link to="/rd-center" class="nav-item">{{ t('nav.rd_center') }}</router-link>
          <router-link to="/about" class="nav-item">{{ t('nav.about') }}</router-link>
        </div>
        
        <button 
          v-if="showRightArrow" 
          class="nav-scroll-btn right" 
          @click="scrollRight"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      <div class="nav-actions">
        <ThemeToggle />
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
import ThemeToggle from './ThemeToggle.vue';

const { t } = useI18n();
const router = useRouter();
const { isAuthenticated, currentUser, logout } = useAuth();

const isScrolled = ref(false);
const navMenuRef = ref(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

const checkScrollButtons = () => {
  if (navMenuRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = navMenuRef.value;
    showLeftArrow.value = scrollLeft > 0;
    showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 1;
  }
};

const scrollLeft = () => {
  if (navMenuRef.value) {
    navMenuRef.value.scrollBy({ left: -150, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (navMenuRef.value) {
    navMenuRef.value.scrollBy({ left: 150, behavior: 'smooth' });
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleLogout = async () => {
  await logout();
  router.push('/');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (navMenuRef.value) {
    navMenuRef.value.addEventListener('scroll', checkScrollButtons);
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (navMenuRef.value) {
    navMenuRef.value.removeEventListener('scroll', checkScrollButtons);
  }
  window.removeEventListener('resize', checkScrollButtons);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.navbar.scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 3vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.navbar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  flex-shrink: 0;
}

.navbar-logo img {
  height: clamp(25px, 4vw, 30px);
  margin-right: clamp(0.3rem, 1vw, 0.5rem);
}

.nav-menu-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  max-width: 100%;
}

.nav-scroll-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 2;
}

.nav-scroll-btn:hover {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary);
}

.nav-scroll-btn.left {
  margin-right: 0.25rem;
}

.nav-scroll-btn.right {
  margin-left: 0.25rem;
}

.nav-menu {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: clamp(0.3rem, 1.5vw, 1.5rem);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  scroll-behavior: smooth;
}

.nav-menu::-webkit-scrollbar {
  display: none;
}

.nav-item {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: clamp(0.75rem, 1.3vw, 0.95rem);
  transition: color 0.3s;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 0.25rem 0;
}

.nav-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-primary);
  transition: width 0.3s ease-in-out;
}

.nav-item:hover, .router-link-exact-active {
  color: var(--text-primary);
}

.nav-item:hover::after, .router-link-exact-active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(0.3rem, 0.8vw, 1rem);
  flex-shrink: 0;
}

.user-actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(0.3rem, 0.8vw, 1rem);
  color: var(--text-primary);
  font-size: clamp(0.75rem, 1.3vw, 0.9rem);
}

.nav-button {
  padding: clamp(0.3rem, 0.6vw, 0.5rem) clamp(0.5rem, 1vw, 0.9rem);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.admin-button {
  background: transparent;
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.admin-button:hover {
  background: var(--accent-primary);
  color: #fff;
  box-shadow: var(--shadow-glow);
}

.login-button {
  background: var(--accent-primary);
  color: #fff;
}

.login-button:hover {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
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

/* 小屏幕优化 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0.4rem 0.75rem;
    gap: 0.3rem;
  }
  
  .navbar-logo {
    font-size: 0.95rem;
  }
  
  .navbar-logo img {
    height: 22px;
    margin-right: 0.25rem;
  }
  
  .nav-menu {
    gap: 0.2rem;
  }
  
  .nav-item {
    font-size: 0.7rem;
    padding: 0.2rem 0.3rem;
  }
  
  .nav-actions {
    gap: 0.3rem;
  }
  
  .nav-button {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }
  
  .nav-scroll-btn {
    width: 24px;
    height: 24px;
    font-size: 1rem;
  }
}
</style>
