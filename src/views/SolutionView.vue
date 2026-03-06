<template>
  <div class="solution-view">
    <h1>{{ $t('solution.title') }}</h1>
    <div class="industry-tabs">
      <button
        v-for="industry in industries"
        :key="industry"
        @click="selectIndustry(industry)"
        :class="{ active: selectedIndustry === industry }"
      >
        {{ industry }}
      </button>
    </div>
      <div class="solution-list">
        <div
          v-for="solution in solutions"
          :key="solution.id"
          class="solution-card"
          @click="goToSolutionDetail(solution.id)"
        >
          <div class="card-background" :style="{ '--bg-image': `url(${solution.imageUrl || solution.thumbnail || 'https://via.placeholder.com/600x400'})` }"></div>
          <div class="card-content">
            <h3>{{ getLocalized(solution, 'title') }}</h3>
            <p class="summary">{{ getLocalized(solution, 'summary') }}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getSolutionIndustries, getSolutionsByIndustry } from '@/services/solutionService';

const { t, locale } = useI18n();
const router = useRouter();

const industries = ref([]);
const selectedIndustry = ref(null);
const solutions = ref([]);

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
  // 优先使用带语言后缀的字段，如 titleZh、titleEn
  const localizedField = item[`${field}${suffix}`];
  if (localizedField) {
    return localizedField;
  }
  // 回退到基础字段
  return item[field] || '';
};

const fetchIndustries = async () => {
  try {
    const response = await getSolutionIndustries();
    industries.value = response;
    if (industries.value.length > 0) {
      selectedIndustry.value = industries.value[0];
      fetchSolutions();
    }
  } catch (error) {
    console.error('Error fetching industries:', error);
  }
};

const fetchSolutions = async () => {
  if (!selectedIndustry.value) return;
  try {
    const response = await getSolutionsByIndustry(selectedIndustry.value);
    solutions.value = response;
  } catch (error) {
    console.error('Error fetching solutions:', error);
  }
};

const selectIndustry = (industry) => {
  selectedIndustry.value = industry;
  fetchSolutions();
};

const goToSolutionDetail = (id) => {
  router.push({ name: 'SolutionDetail', params: { id } });
};

onMounted(() => {
  fetchIndustries();
});
</script>

<style scoped>
.solution-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 2rem;
}

.industry-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.industry-tabs button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.industry-tabs button:hover {
  background-color: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.industry-tabs button.active {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
  color: var(--text-primary);
  font-weight: 600;
}

.solution-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
}

/* 1个项目时：占满一行并居中 */
.solution-list > *:only-child {
  grid-column: 1 / -1;
  max-width: 500px;
  margin: 0 auto;
}

/* 2个项目时：各占50%居中 */
.solution-list > *:first-child:nth-last-child(2) {
  grid-column: span 1;
}

.solution-list > *:first-child:nth-last-child(2) ~ * {
  grid-column: span 1;
}

/* 4个项目的特殊布局：前3个一行，第4个占满 */
.solution-list > *:first-child:nth-last-child(4),
.solution-list > *:first-child:nth-last-child(4) ~ *:nth-child(-n+3) {
  grid-column: span 1;
}

.solution-list > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
  grid-column: 1 / -1;
  max-width: 900px;
  margin: 0 auto;
}

.solution-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  min-height: 400px;
  border-radius: 16px;
  overflow: hidden;
  color: var(--text-primary);
  cursor: pointer;
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

.solution-card:hover .card-background {
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

.card-content .summary {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.solution-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-glow);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .solution-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .solution-list > *:only-child {
    grid-column: 1 / -1;
    max-width: 500px;
  }

  .solution-list > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
    grid-column: 1 / -1;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .solution-list {
    grid-template-columns: 1fr;
  }

  .solution-list > *:only-child,
  .solution-list > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
    grid-column: 1;
    max-width: 100%;
  }

  .solution-card {
    min-height: 350px;
  }
}
</style>
