<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const services = [
  { 
    title: t('home.services.guide'), 
    desc: t('home.services.guide_desc'),
    route: '/support/guide'
  },
  { 
    title: t('home.services.trial'), 
    desc: t('home.services.trial_desc'),
    route: '/trial'
  },
  { 
    title: t('home.services.partner'), 
    desc: t('home.services.partner_desc'),
    route: '/partner'
  }
];

const navigateTo = (route) => {
  router.push(route);
};
</script>

<template>
  <section class="service-section">
    <div class="service-cards">
      <div 
        v-for="(service, index) in services" 
        :key="index"
        class="service-card"
        @click="navigateTo(service.route)"
      >
        <div class="service-icon">
          <svg v-if="index === 0" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <svg v-else-if="index === 1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3 class="service-title">{{ service.title }}</h3>
        <p class="service-desc">{{ service.desc }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.service-section {
  padding: 40px 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-primary);
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.service-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.service-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 195, 255, 0.2);
}

.service-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00c3ff;
}

.service-icon svg {
  width: 48px;
  height: 48px;
}

.service-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.service-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .service-section {
    padding: 30px 1rem;
  }

  .service-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .service-card {
    padding: 25px;
  }

  .service-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
