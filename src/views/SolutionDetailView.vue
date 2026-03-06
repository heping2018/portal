<template>
  <div class="solution-detail-view" v-if="solution">
    <h1>{{ getLocalized(solution, 'title') }}</h1>
    <div class="solution-content" v-html="getLocalized(solution, 'content')"></div>

    <div class="case-studies" v-if="cases.length > 0">
      <h2>{{ $t('solution.caseStudies') }}</h2>
      <div class="case-study-list">
        <div
          v-for="caseItem in cases"
          :key="caseItem.id"
          class="case-study-card"
        >
          <h3>{{ getLocalized(caseItem, 'title') }}</h3>
          <p>{{ getLocalized(caseItem, 'summary') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getSolutionDetails, getSolutionCases } from '@/services/solutionService';

const { t, locale } = useI18n();
const route = useRoute();

const solution = ref(null);
const cases = ref([]);

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

const fetchSolutionDetails = async () => {
  try {
    const response = await getSolutionDetails(route.params.id);
    solution.value = response;
  } catch (error) {
    console.error('Error fetching solution details:', error);
  }
};

const fetchSolutionCases = async () => {
  try {
    const response = await getSolutionCases(route.params.id);
    cases.value = response;
  } catch (error) {
    console.error('Error fetching solution cases:', error);
  }
};

onMounted(() => {
  fetchSolutionDetails();
  fetchSolutionCases();
});
</script>

<style scoped>
.solution-detail-view {
  padding: 2rem;
}

.solution-content {
  margin-bottom: 2rem;
}

.case-studies h2 {
  margin-bottom: 1rem;
}

.case-study-list {
  display: grid;
  gap: 1rem;
}

.case-study-card {
  border: 1px solid #eee;
  padding: 1rem;
}
</style>
