<template>
  <div class="innovation-detail-container">
    <div v-if="loading" class="loading-state">
      <p>{{ $t('common.loading') }}</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ $t('state.data_loading_failed') }}</p>
    </div>
    <div v-else-if="innovation" class="innovation-content">
      <div class="header">
        <h1 class="title">{{ innovation.title }}</h1>
        <p class="meta">Published on: {{ new Date(innovation.publishDate).toLocaleDateString() }}</p>
      </div>
      <img :src="innovation.imageUrl || '/placeholder.svg'" alt="Innovation Image" class="main-image">
      <div class="content-body" v-html="innovation.summary"></div>
      <div class="content-body" v-html="innovation.content"></div>
      <router-link to="/rd-center" class="back-link">Back to R&D Center</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getInnovationById } from '@/services/rdCenterService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

const innovation = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchInnovationDetail = async () => {
  try {
    loading.value = true;
    const id = route.params.id;
    const response = await getInnovationById(id);
    if (response) {
      innovation.value = response;
    } else {
      throw new Error('Innovation not found');
    }
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch innovation details:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInnovationDetail();
});
</script>

<style scoped>
.innovation-detail-container {
  padding: 4rem 2rem;
  background-color: #1a1a1a;
  color: #fff;
  max-width: 900px;
  margin: 0 auto;
}

.loading-state, .error-state {
  text-align: center;
  padding: 6rem 0;
  font-size: 1.5rem;
  color: #7f8c8d;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #3c3c3c;
}

.title {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ecf0f1;
}

.meta {
  font-size: 1rem;
  color: #bdc3c7;
}

.main-image {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 2.5rem;
}

.content-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #bdc3c7;
}

.content-body ::v-deep(h2) {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #3498db;
}

.content-body ::v-deep(p) {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  margin-top: 3rem;
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.back-link:hover {
  background-color: #2980b9;
}
</style>
