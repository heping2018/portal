<template>
  <div class="about-us-view">
    <div class="container">
      <aside class="sidebar-nav">
        <h2 class="nav-title">{{ t('about.title') }}</h2>
        <nav v-if="navigation.length">
          <ul>
            <li v-for="item in navigation" :key="item.key">
              <router-link :to="`/about/${item.key}`" class="nav-item" active-class="active">
                <i :class="`icon-${item.icon}`"></i>
                <span>{{ t(`about.nav.${item.key}`) }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <div v-else class="loading-error-message">
          {{ t('about.error_loading') }}
        </div>
      </aside>
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCompanySections } from '../services/companyService';

interface NavigationItemVO {
  key: string;
  icon: string;
  title: string;
}

const { t } = useI18n();
const navigation = ref<NavigationItemVO[]>([]);

const fetchNavigation = async () => {
  try {
    const response = await getCompanySections();
    navigation.value = response || [];
  } catch (error) {
    console.error('Failed to fetch about page navigation:', error);
    navigation.value = [];
  }
};

onMounted(fetchNavigation);
</script>

<style scoped>
.about-us-view {
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
}

.sidebar-nav, .content-area {
  background-color: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sidebar-nav {
  width: 260px;
  flex-shrink: 0;
  padding: 1.5rem;
  height: fit-content;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.9rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: var(--bg-card-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--accent-primary);
  color: #fff;
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.nav-item i {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.content-area {
  flex-grow: 1;
  padding: 2rem;
  color: var(--text-primary);
}

.loading-error-message {
  color: #ff6b6b;
  padding: 1rem;
  text-align: center;
}

/* Transition effects */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Apply theme to child components globally inside content-area */
.content-area :deep(.section-title) {
  color: var(--text-primary);
  border-bottom-color: var(--accent-primary);
}

.content-area :deep(.loading-spinner) {
  border-top-color: var(--accent-primary);
}

.content-area :deep(.error-message) {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
}

/* Profile Section */
.content-area :deep(.intro-text) {
  color: var(--text-secondary);
}

.content-area :deep(.core-values li) {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.content-area :deep(.subsection-title) {
  color: var(--text-primary);
}

/* Culture Section */
.content-area :deep(.mission-statement),
.content-area :deep(.vision-statement) {
  color: var(--text-secondary);
}

.content-area :deep(.value-card) {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

.content-area :deep(.card-title) {
  color: var(--text-primary);
}

.content-area :deep(.card-description) {
  color: var(--text-secondary);
}

.content-area :deep(.quote) {
  background-color: var(--bg-secondary);
  border-left-color: var(--accent-primary);
  color: var(--text-secondary);
}

/* History Section */
.content-area :deep(.timeline::before) {
  background-color: var(--accent-primary);
}

.content-area :deep(.timeline-item::after) {
  background-color: var(--bg-secondary);
  border-color: var(--accent-primary);
}

.content-area :deep(.timeline-content) {
  background-color: transparent;
  padding: 0;
  box-shadow: none;
}

.content-area :deep(.event-title) {
  color: var(--accent-secondary);
}

.content-area :deep(.event-date) {
  color: var(--text-muted);
}

.content-area :deep(.event-description) {
  color: var(--text-secondary);
}

/* Members Section */
.content-area :deep(.member-card) {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

.content-area :deep(.card-header) {
  background-color: var(--bg-tertiary);
}

.content-area :deep(.member-name) {
  color: var(--text-primary);
}

.content-area :deep(.member-description) {
  color: var(--text-secondary);
}

.content-area :deep(.card-footer) {
  background-color: var(--bg-tertiary);
  border-top-color: var(--border-color);
}
</style>
