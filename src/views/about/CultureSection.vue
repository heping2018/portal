<template>
  <div class="culture-section">
    <div v-if="loading" class="loading-state">
      <p>{{ t('state.loading') }}</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ t('state.data_loading_failed') }}</p>
    </div>
    <div v-if="culture" class="culture-content">
      <el-card shadow="never" class="culture-card">
        <el-row :gutter="40" align="middle">
          <el-col :lg="14" :md="24" :xs="24" class="text-col">
            <div class="culture-text">
              <h2 class="section-title">{{ getLocalizedField(culture, 'title') }}</h2>
              <div v-html="getLocalizedField(culture, 'content')" class="content-body"></div>
            </div>
          </el-col>
          <el-col :lg="10" :md="24" :xs="24" class="image-col">
            <img :src="culture.imageUrl" :alt="getLocalizedField(culture, 'title')" class="culture-image" />
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCompanyCulture } from '../../services/companyService';

interface CultureData {
  title: string;
  content: string;
  imageUrl: string;
  titleEn: string;
  contentEn: string;
  titleZh: string;
  contentZh: string;
}

const { t, locale } = useI18n();
const culture = ref<CultureData | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);

const getLocalizedField = (item: CultureData, field: 'title' | 'content') => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || '';
};

const fetchCulture = async () => {
  try {
    loading.value = true;
    const response = await getCompanyCulture();
    culture.value = response.data;
  } catch (err) {
    error.value = err as Error;
    console.error('Failed to fetch company culture:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCulture);
</script>

<style scoped>
.culture-section {
  width: 100%;
}

.culture-card {
  border: none;
  background-color: transparent;
}

.culture-image {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
}

.culture-text {
  padding-right: 20px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--el-text-color-primary);
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--el-color-primary-light-3);
}

.content-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--el-text-color-secondary);
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}

@media (max-width: 991px) {
  .culture-text {
    padding-right: 0;
  }
}

@media (max-width: 767px) {
  .text-col {
    order: 2;
  }
  .image-col {
    order: 1;
    margin-bottom: 2rem;
  }
  .section-title {
    font-size: 1.8rem;
  }
  .content-body {
    font-size: 1rem;
  }
}
</style>
