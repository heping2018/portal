<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  partners: {
    type: Array,
    default: () => []
  }
});

const defaultPartners = [
  { id: 1, name: 'Partner 1', logo: '/images/case/logo1.png' },
  { id: 2, name: 'Partner 2', logo: '/images/case/logo2.png' },
  { id: 3, name: 'Partner 3', logo: '/images/case/logo3.png' },
  { id: 4, name: 'Partner 4', logo: '/images/case/logo4.png' },
  { id: 5, name: 'Partner 5', logo: '/images/case/logo5.png' },
  { id: 6, name: 'Partner 6', logo: '/images/case/logo6.png' },
  { id: 7, name: 'Partner 7', logo: '/images/case/logo7.png' },
  { id: 8, name: 'Partner 8', logo: '/images/case/logo8.png' },
];

const displayPartners = computed(() => {
  return props.partners.length > 0 ? props.partners : defaultPartners;
});
</script>

<template>
  <section class="partner-section">
    <div class="section-header">
      <h2>{{ t('home.partners.title') }}</h2>
    </div>

    <div class="partner-logos">
      <div 
        v-for="(partner, index) in displayPartners" 
        :key="partner.id || index"
        class="partner-logo"
      >
        <img 
          v-if="partner.logo" 
          :src="partner.logo" 
          :alt="partner.name"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.partner-section {
  padding: 60px 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-primary);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.partner-logos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 30px;
  align-items: center;
  justify-items: center;
}

.partner-logo {
  width: 100%;
  max-width: 150px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 30, 60, 0.3);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.partner-logo:hover {
  background: var(--bg-card-hover);
  transform: scale(1.05);
}

.partner-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(100%) brightness(1.5);
  transition: filter 0.3s ease;
}

.partner-logo:hover img {
  filter: grayscale(0%) brightness(1);
}

@media (max-width: 768px) {
  .partner-section {
    padding: 40px 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .partner-logos {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
  }

  .partner-logo {
    max-width: 120px;
    height: 70px;
  }
}
</style>
