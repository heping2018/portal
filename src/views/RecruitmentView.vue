<template>
  <div class="recruitment-view">
    <h1>{{ $t('recruitment.title') }}</h1>
    <p class="subtitle">{{ $t('recruitment.subtitle') }}</p>
    <div v-if="loading" class="loading-state">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="error-state">{{ $t('state.data_loading_failed') }}</div>
    <div v-else class="job-list">
      <div v-for="job in jobs" :key="job.id" class="job-card" @click="goToJobDetail(job.id)">
        <div class="job-header">
          <h2>{{ job.title }}</h2>
          <span class="job-location">{{ job.location }}</span>
        </div>
        <p class="job-department">{{ job.department }}</p>
        <span class="job-type">{{ job.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getJobs } from '@/services/recruitmentService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const jobs = ref([]);
const loading = ref(true);
const error = ref(false);

const fetchJobs = async () => {
  try {
    loading.value = true;
    const response = await getJobs();
    jobs.value = response.data;
  } catch (err) {
    console.error('Error fetching jobs:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const goToJobDetail = (id) => {
  router.push({ name: 'JobDetail', params: { id } });
};

onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
.recruitment-view {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.job-list {
  display: grid;
  gap: 1.5rem;
}

.job-card {
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.job-header h2 {
  font-size: 1.5rem;
  color: #0056b3;
  margin: 0;
}

.job-location {
  font-weight: 500;
  color: #555;
}

.job-department {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 1rem;
}

.job-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #f0f7ff;
  color: #0056b3;
  border-radius: 15px;
  font-weight: 500;
}

.loading-state, .error-state {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  padding: 3rem;
}
</style>
