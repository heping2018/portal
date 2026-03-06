<template>
  <div class="case-studies-view">
    <header class="view-header">
      <h1>{{ $t('nav.case_studies') }}</h1>
      <p class="subtitle">{{ $t('case_studies.subtitle') }}</p>
    </header>

    <div class="controls">
      <div class="filter-tabs">
        <button
          v-for="industry in industries"
          :key="industry"
          :class="{ active: activeIndustry === industry }"
          @click="filterByIndustry(industry)"
        >
          {{ industry }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-if="!loading && caseStudies.length === 0" class="no-results">
      <p>{{ $t('case_studies.no_results') }}</p>
    </div>

    <div v-if="!loading && caseStudies.length > 0" class="case-studies-grid">
      <router-link
        v-for="study in caseStudies"
        :key="study.id"
        :to="{ name: 'CaseStudyDetail', params: { id: study.id } }"
        class="case-study-card"
      >
        <div class="card-background" :style="{ '--bg-image': `url(${study.imageUrl || 'https://via.placeholder.com/600x400'})` }"></div>
        <div class="card-content">
          <p class="industry-label">{{ getLocalized(study, 'industry') }}</p>
          <h3>{{ getLocalized(study, 'title') }}</h3>
          <p class="summary">{{ getLocalized(study, 'summary') }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCaseStudyIndustries, getCaseStudies, getCaseStudiesByIndustry } from '../services/caseStudyService';

const { locale } = useI18n();

const industries = ref([]);
const caseStudies = ref([]);
const activeIndustry = ref('All');
const loading = ref(true);

// 获取当前语言后缀
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
  const localizedField = item[`${field}${suffix}`];
  if (localizedField) {
    return localizedField;
  }
  return item[field] || '';
};

const fetchIndustries = async () => {
  try {
    const response = await getCaseStudyIndustries();
    industries.value = ['All', ...response];
  } catch (error) {
    console.error('Error fetching industries:', error);
  }
};

const fetchCaseStudies = async () => {
  loading.value = true;
  try {
    let response;
    if (activeIndustry.value === 'All') {
      response = await getCaseStudies();
    } else {
      response = await getCaseStudiesByIndustry(activeIndustry.value);
    }
    caseStudies.value = response;
  } catch (error) {
    console.error('Error fetching case studies:', error);
  } finally {
    loading.value = false;
  }
};

const filterByIndustry = (industry) => {
  activeIndustry.value = industry;
  fetchCaseStudies();
};

onMounted(() => {
  fetchIndustries();
  fetchCaseStudies();
});
</script>

<style scoped>
.case-studies-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  text-align: center;
  margin-bottom: 4rem;
}

.view-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px var(--shadow-glow);
  color: var(--text-primary);
}

.subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin: 10px 0 0 0;
}

.controls {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.filter-tabs button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.filter-tabs button:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.filter-tabs button.active {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #fff;
  font-weight: 600;
}

.loading-indicator, .no-results {
  text-align: center;
  padding: 6rem 0;
  font-size: 1.3rem;
  color: var(--text-secondary);
}

.loading-spinner {
  margin: 0 auto 2rem;
  border: 4px solid var(--shadow-color);
  border-left-color: var(--accent-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.case-studies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

/* 1个项目时：占满一行并居中 */
.case-studies-grid > *:only-child {
  grid-column: 1 / -1;
  max-width: 500px;
  margin: 0 auto;
}

/* 2个项目时：各占50%居中 */
.case-studies-grid > *:first-child:nth-last-child(2) {
  grid-column: span 1;
}

.case-studies-grid > *:first-child:nth-last-child(2) ~ * {
  grid-column: span 1;
}

/* 4个项目的特殊布局：前3个一行，第4个占满 */
.case-studies-grid > *:first-child:nth-last-child(4),
.case-studies-grid > *:first-child:nth-last-child(4) ~ *:nth-child(-n+3) {
  grid-column: span 1;
}

.case-studies-grid > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
  grid-column: 1 / -1;
  max-width: 900px;
  margin: 0 auto;
}

.case-study-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  min-height: 400px;
  border-radius: 16px;
  overflow: hidden;
  color: var(--text-primary);
  text-decoration: none;
  background-color: var(--bg-card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: var(--bg-image);
  transition: transform 0.4s ease-out;
}

.case-study-card:hover .card-background {
  transform: scale(1.05);
}

.card-content {
  position: relative;
  padding: 1.5rem;
  z-index: 2;
  background: var(--gradient-card);
  border-top: 1px solid var(--border-color);
}

.card-content h3 {
  margin: 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.card-content .industry-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.card-content .summary {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.case-study-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 5, 10, 0.5), 0 0 40px var(--shadow-glow);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .case-studies-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .case-studies-grid > *:only-child {
    grid-column: 1 / -1;
    max-width: 500px;
  }

  .case-studies-grid > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
    grid-column: 1 / -1;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .case-studies-grid {
    grid-template-columns: 1fr;
  }

  .case-studies-grid > *:only-child,
  .case-studies-grid > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
    grid-column: 1;
    max-width: 100%;
  }

  .case-study-card {
    min-height: 350px;
  }
}
</style>
