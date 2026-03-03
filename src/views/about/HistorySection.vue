<template>
  <div class="history-section">
    <h2 class="section-title">{{ t('about.history.title') }}</h2>
    <div v-if="loading" class="loading-state">
      <p>{{ t('state.loading') }}</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ t('state.data_loading_failed') }}</p>
    </div>
    <div v-else class="timeline-container">
      <el-timeline>
        <el-timeline-item
          v-for="(event, index) in sortedHistory"
          :key="event.id"
          :timestamp="formatDate(event.date)"
          placement="top"
          type="primary"
          :hollow="true"
          size="large"
        >
          <el-card shadow="hover" class="timeline-card">
            <h3 class="event-title">{{ getLocalizedField(event, 'title') }}</h3>
            <p class="event-description">{{ getLocalizedField(event, 'description') }}</p>
            <img v-if="event.imageUrl" :src="event.imageUrl" :alt="getLocalizedField(event, 'title')" class="event-image"/>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCompanyHistory } from '../../services/companyService';

interface MilestoneEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  titleEn: string;
  descriptionEn: string;
  titleZh: string;
  descriptionZh: string;
}

const { t, locale } = useI18n();
const history = ref<MilestoneEvent[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);

const getLocalizedField = (item: MilestoneEvent, field: 'title' | 'description') => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || '';
};

const sortedHistory = computed(() => {
  // Sort history events by date in descending order
  return [...history.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const fetchHistory = async () => {
  try {
    loading.value = true;
    const response = await getCompanyHistory();
    if (response.data && Array.isArray(response.data.milestones)) {
      history.value = response.data.milestones;
    }
  } catch (err) {
    error.value = err as Error;
    console.error('Failed to fetch company history:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Use i18n locale to format the date string correctly
  const currentLocale = locale.value === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleDateString(currentLocale, { year: 'numeric', month: 'long' });
};

onMounted(fetchHistory);
</script>

<style scoped>
.history-section {
  width: 100%;
  padding: 2rem 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3.5rem;
  color: var(--el-text-color-primary);
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.timeline-card {
  border: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.timeline-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--el-box-shadow-light);
}

.event-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 0.75rem;
}

.event-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--el-text-color-secondary);
}

.event-image {
  width: 100%;
  max-width: 250px;
  border-radius: 6px;
  margin-top: 1rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}

:deep(.el-timeline-item__timestamp) {
  font-size: 1.1rem !important;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

:deep(.el-timeline-item__node--large) {
    width: 18px;
    height: 18px;
}

</style>
