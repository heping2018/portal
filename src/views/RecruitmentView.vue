<template>
  <div class="recruitment-view">
    <h1>{{ $t('recruitment.title') }}</h1>

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
          <h3>{{ t('recruitment.culture.title') }}</h3>
          <p>{{ getLocalized(culture, 'description') }}</p>
        </div>
        <div class="info-card" v-if="team">
          <h3>{{ t('recruitment.team.title') }}</h3>
          <p>{{ getLocalized(team, 'description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getJobs, getRecruitCulture, getRecruitTeam } from '@/services/recruitmentService';

const { t, locale } = useI18n();
const router = useRouter();

const jobs = ref([]);
const culture = ref(null);
const team = ref(null);
const loading = ref(true);
const error = ref(false);

// 获取当前语言后缀（如 'zh-CN' -> 'Zh'）
const getLangSuffix = () => {
  const lang = locale.value.split('-')[0];
  switch(lang) {
    case 'zh': return 'Zh';
    case 'en': return 'En';
    case 'pt': return 'Pt';
    case 'es': return 'Es';
    default: return 'En';
  }
};

// 获取本地化字段
const getLocalized = (item, field) => {
  if (!item) return '';
  const suffix = getLangSuffix();
  // 优先使用带语言后缀的字段，如 titleZh、titleEn、titlePt、titleEs
  const localizedField = item[`${field}${suffix}`];
  if (localizedField) {
    return localizedField;
  }
  // 回退到基础字段（根据Accept-Language，服务器可能已返回当前语言的基础字段）
  return item[field] || '';
};

const fetchJobs = async () => {
  try {
    loading.value = true;
    const response = await getJobs();
    jobs.value = response.list || [];
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
    'full-time': t('job_type.full_time'),
    'part-time': t('job_type.part_time'),
    'internship': t('job_type.internship')
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
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.job-list {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.job-card {
  background: var(--bg-card);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-primary);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.job-header h2 {
  font-size: 1.5rem;
  color: var(--accent-primary);
  margin: 0;
  flex: 1;
}

.job-type {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 1rem;
}

/* 职位类型标签颜色 - 使用主题变量，支持深色和浅色主题 */
.job-type.full-time {
  background-color: var(--job-type-full-time-bg);
  color: var(--job-type-full-time-color);
}

.job-type.part-time {
  background-color: var(--job-type-part-time-bg);
  color: var(--job-type-part-time-color);
}

.job-type.internship {
  background-color: var(--job-type-internship-bg);
  color: var(--job-type-internship-color);
}

.job-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.job-department,
.job-location {
  font-size: 1rem;
  color: var(--text-secondary);
}

.job-department {
  font-weight: 500;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.job-salary {
  font-weight: 600;
  color: var(--text-primary);
}

.job-date {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.info-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.info-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid var(--accent-primary);
}

.info-card h3 {
  color: var(--accent-primary);
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.info-card p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0;
}

.loading-state, .error-state {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
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
