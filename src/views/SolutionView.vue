<template>
  <div class="solution-view">
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
        <img :src="solution.thumbnail" alt="solution.title" />
        <h3>{{ solution.title }}</h3>
        <p>{{ solution.summary }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getSolutionIndustries, getSolutionsByIndustry } from '@/services/solutionService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const industries = ref([]);
const selectedIndustry = ref(null);
const solutions = ref([]);

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
}

.industry-tabs {
  margin-bottom: 2rem;
}

.industry-tabs button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
}

.industry-tabs button.active {
  background-color: #007bff;
  color: white;
}

.solution-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.solution-card {
  border: 1px solid #eee;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.solution-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.solution-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 1rem;
}
</style>
