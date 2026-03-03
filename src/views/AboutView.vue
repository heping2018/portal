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
import { getCompanySections } from '../services/companyService'; // Corrected import

interface NavigationItemVO {
  key: string;
  icon: string;
  title: string;
}

const { t } = useI18n();
const navigation = ref<NavigationItemVO[]>([]);

const fetchNavigation = async () => {
  try {
    const response = await getCompanySections(); // Corrected function call
    navigation.value = response || [];
  } catch (error) {
    console.error('Failed to fetch about page navigation:', error);
    navigation.value = []; // Clear navigation on error
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
  background-color: #162231; /* Dark theme background */
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
  color: #E0E0E0; /* Light text color */
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #2c3e50; /* Darker border */
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.9rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  color: #A9B4C0; /* Light inactive text color */
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: #2c3e50; /* Darker hover background */
  color: #FFFFFF; /* White text on hover */
}

.nav-item.active {
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
  transform: translateY(-2px);
}

.nav-item i {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.content-area {
  flex-grow: 1;
  padding: 2rem;
  color: #E0E0E0; /* Default light text color for content */
}

.loading-error-message {
  color: #ff6b6b;
  padding: 1rem;
  text-align: center;
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Apply dark theme to child components globally inside content-area */
.content-area :deep(.section-title) {
  color: #EAEAEA;
  border-bottom-color: #007bff;
}

.content-area :deep(.loading-spinner) {
  border-top-color: #007bff;
}

.content-area :deep(.error-message) {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
}

/* Profile Section */
.content-area :deep(.intro-text) {
  color: #B0C4DE;
}

.content-area :deep(.core-values li) {
  background-color: #1E2D3B;
  color: #B0C4DE;
}

.content-area :deep(.subsection-title) {
  color: #D3D3D3;
}

/* Culture Section */
.content-area :deep(.mission-statement), 
.content-area :deep(.vision-statement) {
  color: #B0C4DE;
}

.content-area :deep(.value-card) {
  background-color: #1E2D3B;
  border-color: #2c3e50;
}

.content-area :deep(.card-title) {
  color: #EAEAEA;
}

.content-area :deep(.card-description) {
  color: #B0C4DE;
}

.content-area :deep(.quote) {
  background-color: #1E2D3B;
  border-left-color: #007bff;
  color: #B0C4DE;
}

/* History Section */
.content-area :deep(.timeline::before) {
  background-color: #007bff;
}

.content-area :deep(.timeline-item::after) {
  background-color: #162231; /* Match content area background */
  border-color: #007bff;
}

.content-area :deep(.timeline-content) {
  background-color: #1E2D3B;
}

.content-area :deep(.event-title) {
  color: #00aaff;
}

.content-area :deep(.event-date) {
  color: #8899A6;
}

.content-area :deep(.event-description) {
  color: #B0C4DE;
}

/* Members Section */
.content-area :deep(.member-card) {
  background-color: #1E2D3B;
  border-color: #2c3e50;
}

.content-area :deep(.card-header) {
  background-color: #162231;
}

.content-area :deep(.member-name) {
  color: #EAEAEA;
}

.content-area :deep(.member-description) {
  color: #B0C4DE;
}

.content-area :deep(.card-footer) {
  background-color: #162231;
  border-top-color: #2c3e50;
}

</style>