<template>
  <div class="case-studies-view">
    <header class="page-header">
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
        <img :src="study.imageUrl || 'https://via.placeholder.com/400x250'" :alt="study.title" />
        <div class="card-content">
          <h3>{{ study.title }}</h3>
          <p>{{ study.summary }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCaseStudyIndustries, getCaseStudies, getCaseStudiesByIndustry } from '../services/caseStudyService';

const industries = ref([]);
const caseStudies = ref([]);
const activeIndustry = ref('All');
const loading = ref(true);

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

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.2rem;
  color: #666;
}

.controls {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
}

.filter-tabs button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.filter-tabs button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.loading-indicator, .no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}

.case-studies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.case-study-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
}

.case-study-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.case-study-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.card-content p {
  margin: 0;
  color: #555;
}
</style>
