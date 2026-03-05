<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const router = useRouter();
const activeTab = ref(0);

const props = defineProps({
  solutions: {
    type: Array,
    default: () => []
  }
});

const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[field] || '';
};

const navigateToSolution = (solution) => {
  if (solution && solution.id) {
    router.push({ name: 'SolutionDetailView', params: { id: solution.id } });
  }
};

const displaySolutions = computed(() => {
  return props.solutions.slice(0, 5);
});
</script>

<template>
  <section class="solution-section">
    <div class="section-header">
      <h2>{{ t('home.solutions.title') }}</h2>
      <p class="section-subtitle">{{ t('home.solutions.subtitle') }}</p>
    </div>

    <div class="solution-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 0 }]"
        @click="activeTab = 0"
      >
        {{ t('home.solutions.saas') }}
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 1 }]"
        @click="activeTab = 1"
      >
        {{ t('home.solutions.industry') }}
      </button>
    </div>

    <div class="solution-cards">
      <div 
        v-for="(solution, index) in displaySolutions" 
        :key="solution.id || index"
        class="solution-card"
        @click="navigateToSolution(solution)"
      >
        <h3 class="card-title">{{ getLocalizedField(solution, 'title') }}</h3>
        <p class="card-desc">{{ getLocalizedField(solution, 'description') }}</p>
        <a class="card-link" @click.stop="navigateToSolution(solution)">
          {{ t('common.learn_more') }} >
        </a>
        <div class="card-products" v-if="solution.products && solution.products.length">
          <span>{{ t('home.related_products') }}:</span>
          <span v-for="(prod, idx) in solution.products.slice(0, 3)" :key="idx">
            {{ prod }}{{ idx < solution.products.slice(0, 3).length - 1 ? ' |' : '' }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.solution-section {
  padding: 60px 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
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

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 10px 0 0 0;
}

.solution-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  background: var(--bg-card-hover);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover,
.tab-btn.active {
  background: rgba(0, 195, 255, 0.2);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.solution-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.solution-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.solution-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 195, 255, 0.2);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-link {
  color: #00c3ff;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
}

.card-link:hover {
  color: #9cffff;
  transform: translateX(5px);
}

.card-products {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 195, 255, 0.2);
  font-size: 0.85rem;
  color: #8ab4d6;
}

.card-products span {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .solution-section {
    padding: 40px 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .solution-tabs {
    flex-direction: column;
    align-items: center;
  }

  .tab-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .solution-cards {
    grid-template-columns: 1fr;
  }
}
</style>
