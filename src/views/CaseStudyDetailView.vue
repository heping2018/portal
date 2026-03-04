<template>
  <div class="case-study-detail-view">
    <div v-if="loading" class="loading-indicator">
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ $t('case_studies.detail.not_found') }}</p>
      <router-link to="/case-studies">{{ $t('case_studies.detail.back_to_list') }}</router-link>
    </div>

    <article v-if="caseStudy">
      <header>
        <h1>{{ caseStudy.title }}</h1>
        <p class="meta-info">{{ $t('case_studies.detail.meta_published') }}: {{ caseStudy.publishDate }}</p>
      </header>

      <div class="content" v-html="caseStudy.content"></div>

      <footer>
        <router-link to="/case-studies" class="back-button">
          {{ $t('case_studies.detail.back_to_list') }}
        </router-link>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCaseStudyDetails } from '../services/caseStudyService';

const route = useRoute();
const caseStudy = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const caseId = route.params.id;
  try {
    const response = await getCaseStudyDetails(caseId);
    caseStudy.value = response.data;
  } catch (err) {
    console.error('Failed to fetch case study details:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.case-study-detail-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a202c; /* Dark background */
  color: #cbd5e0; /* Light text */
  border-radius: 8px;
}

.loading-indicator, .error-message {
  text-align: center;
  padding: 3rem;
  font-size: 1.25rem;
}

.error-message a {
  color: #4299e1; /* Blue link */
}

article header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2d3748; /* Darker border */
}

article h1 {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.meta-info {
  font-size: 1rem;
  color: #718096; /* Grayer text */
}

.content {
  line-height: 1.8;
  font-size: 1.1rem;
}

/* Deep selector for styling content from v-html */
.content :deep(h2) {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #2d3748;
  padding-bottom: 0.5rem;
}

.content :deep(p) {
  margin-bottom: 1.5rem;
}

.content :deep(ul) {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

footer {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #2d3748;
}

.back-button {
  display: inline-block;
  background-color: #2d3748;
  color: #cbd5e0;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #4a5568;
}
</style>
