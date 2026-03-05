<template>
  <div class="rd-center-container">
    <div class="header-section">
      <h1 class="title">{{ $t('rd_center.innovations.title') }}</h1>
      <p class="subtitle">Exploring the frontiers of technology and innovation.</p>
    </div>

    <div v-if="loading" class="loading-state">
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ $t('state.data_loading_failed') }}</p>
    </div>

    <div v-else-if="innovations.length > 0" class="innovations-grid">
      <div 
        v-for="innovation in innovations" 
        :key="innovation.id" 
        class="innovation-card"
        @click="goToDetail(innovation.id)"
      >
        <img :src="innovation.imageUrl || '/placeholder.svg'" alt="Innovation Image" class="card-image">
        <div class="card-content">
          <h3 class="card-title">{{ innovation.title }}</h3>
          <p class="card-summary">{{ innovation.summary }}</p>
          <span class="card-read-more">Read More</span>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <p>{{ $t('rd_center.innovations.no_results') }}</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInnovations } from '@/services/rdCenterService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const innovations = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchInnovations = async () => {
  try {
    loading.value = true;
    const response = await getInnovations({ page: 1, pageSize: 12 });
    if (response) {
      innovations.value = response;
    } else {
      innovations.value = [];
    }
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch innovations:', err);
  } finally {
    loading.value = false;
  }
};

const goToDetail = (id) => {
  router.push({ name: 'InnovationDetail', params: { id } });
};

onMounted(() => {
  fetchInnovations();
});

</script>

<style scoped>
.rd-center-container {
  padding: 4rem 2rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: var(--gradient-button);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.loading-state, .error-state, .no-results {
  text-align: center;
  padding: 4rem 0;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.innovations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.innovation-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.innovation-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-glow);
  border-color: var(--accent-primary);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ecf0f1;
}

.card-summary {
  font-size: 1rem;
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-read-more {
  font-weight: bold;
  color: #3498db;
  transition: color 0.3s ease;
}

.innovation-card:hover .card-read-more {
  color: var(--text-primary);
}
</style>
