<template>
  <div class="recruitment-view">
    <h1>{{ $t('测试') }}</h1>

    <div v-if="loading" class="loading-state">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="error-state">{{ $t('state.data_loading_failed') }}</div>
    <div v-else>
      <div class="job-list">
        <div v-for="job in jobs" :key="job.id" class="job-card" @click="goToJobDetail(job.id)">
          <div class="job-header">
            <h2>{{ job.title }}</h2>
            <span class="job-type" :class="job.type">{{ getTypeLabel(job.type) }}</span>
          </div>
          <div class="job-meta">
            <span class="job-department">{{ job.department }}</span>
            <span class="job-location">{{ job.location }}</span>
          </div>
          <div class="job-footer">
            <span class="job-salary">{{ job.salaryRange }}</span>
            <span class="job-date">{{ formatDate(job.publishDate) }}</span>
          </div>
        </div>
      </div>

      <div class="info-sections" v-if="culture || team">
        <div class="info-card" v-if="culture">
          <h3>企业文化</h3>
          <p>{{ culture.description }}</p>
        </div>
        <div class="info-card" v-if="team">
          <h3>团队介绍</h3>
          <p>{{ team.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getJobs, getRecruitCulture, getRecruitTeam } from '@/services/recruitmentService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const jobs = ref([]);
const culture = ref(null);
const team = ref(null);
const loading = ref(true);
const error = ref(false);

const fetchJobs = async () => {
  try {
    loading.value = true;
    const response = await getJobs();
    jobs.value = response;
  } catch (err) {
    console.error('Error fetching jobs:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchCultureAndTeam = async () => {
  try {
    const [cultureRes, teamRes] = await Promise.all([
      getRecruitCulture(),
      getRecruitTeam()
    ]);
    culture.value = cultureRes;
    team.value = teamRes;
  } catch (err) {
    console.error('Error fetching culture and team:', err);
  }
};

const getTypeLabel = (type) => {
  const labels = {
    'full-time': '全职',
    'part-time': '兼职',
    'internship': '实习'
  };
  return labels[type] || type;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

const goToJobDetail = (id) => {
  router.push({ name: 'JobDetail', params: { id } });
};

onMounted(() => {
  fetchJobs();
  fetchCultureAndTeam();
});
</script>

<style scoped>
.recruitment-view {
  max-width: 1100px;
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
  margin-bottom: 4rem;
}

.job-card {
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.job-header h2 {
  font-size: 1.5rem;
  color: #007bff;
  margin: 0;
  flex: 1;
}

.job-type {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background-color: #f0f7ff;
  color: #007bff;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 1rem;
}

.job-type.full-time {
  background-color: #e8f5e9;
  color: #4caf50;
}

.job-type.part-time {
  background-color: #fff3e0;
  color: #ff9800;
}

.job-type.internship {
  background-color: #e3f2fd;
  color: #2196f3;
}

.job-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.job-department,
.job-location {
  font-size: 1rem;
  color: #555;
}

.job-department {
  font-weight: 500;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.job-salary {
  font-weight: 600;
  color: #333;
}

.job-date {
  font-size: 0.9rem;
  color: #999;
}

.info-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.info-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #007bff;
}

.info-card h3 {
  color: #007bff;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.info-card p {
  color: #555;
  line-height: 1.8;
  margin: 0;
}

.loading-state, .error-state {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  padding: 3rem;
}

@media (max-width: 768px) {
  .job-header {
    flex-direction: column;
  }

  .job-type {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .job-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-sections {
    grid-template-columns: 1fr;
  }
}
</style>
