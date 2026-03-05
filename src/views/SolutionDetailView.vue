<template>
  <div class="solution-detail-view" v-if="solution">
    <h1>{{ solution.title }}</h1>
    <div class="solution-content" v-html="solution.content"></div>

    <div class="case-studies" v-if="cases.length > 0">
      <h2>{{ $t('solution.caseStudies') }}</h2>
      <div class="case-study-list">
        <div
          v-for="caseItem in cases"
          :key="caseItem.id"
          class="case-study-card"
        >
          <h3>{{ caseItem.title }}</h3>
          <p>{{ caseItem.summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getSolutionDetails, getSolutionCases } from '@/services/solutionService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

const solution = ref(null);
const cases = ref([]);

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
