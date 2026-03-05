<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getNewsList } from '../services/newsService';
import VanillaTilt from 'vanilla-tilt';

const { t, locale } = useI18n();

const news = ref([]);
const loading = ref(true);
const error = ref(null);
const gridRef = ref(null);

const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  // Check for titleZh, summaryZh, etc.
  if (item[`${field}${lang}`]) {
    return item[`${field}${lang}`];
  }
  // Fallback to English
  if (item[`${field}En`]) {
    return item[`${field}En`];
  }
  // Fallback to the base field itself (e.g., title, summary)
  if (item[field]) {
    return item[field];
  }
  return '';
};

const fetchNews = async () => {
  try {
    loading.value = true;
    // The service returns an object like { list: [], total: 0 }
    const responseData = await getNewsList({ pageNo: 1, pageSize: 9 });
    // CORRECT FIX: Assign the `list` property from the response object to the `news` ref
    if (responseData) {
      news.value = responseData;
    } else {
      news.value = []; // Default to an empty array if data is missing
    }
  } catch (err) {
    error.value = t('news.error');
    console.error('Failed to fetch news:', err);
  } finally {
    loading.value = false;
  }
};

const initializeTilt = () => {
  if (gridRef.value) {
    const items = gridRef.value.querySelectorAll('.news-card');
    VanillaTilt.init(items, {
      max: 5,
      speed: 300,
      glare: true,
      'max-glare': 0.1,
      scale: 1.02,
    });
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const dateLocale = locale.value.startsWith('zh') ? 'zh-CN' : 'en-US';
  return new Date(dateString).toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchNews();
});

// When the news array is populated, initialize the tilt effect on the cards
watch(news, (newNews) => {
  if (newNews && newNews.length > 0) {
    nextTick(() => {
      initializeTilt();
    });
  }
});
</script>

<template>
  <div class="news-view">
    <header class="view-header">
      <h1>{{ t('news.title') }}</h1>
      <p class="subtitle">{{ t('news.subtitle') }}</p>
    </header>

    <div v-if="loading" class="state-feedback">
      <div class="loading-spinner"></div>
      <p>{{ t('news.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-feedback error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="news && news.length > 0" class="news-grid" ref="gridRef">
      <router-link
        v-for="article in news.filter(a => a)" 
        :key="article.id"
        :to="{ name: 'NewsDetailView', params: { id: article.id } }"
        class="news-card"
      >
        <div class="card-background" :style="{ '--bg-image': `url(${article.thumbnailUrl || 'https://via.placeholder.com/600x400'})` }"></div>
        <div class="card-content">
          <p class="date-label">{{ formatDate(article.publishDate) }}</p>
          <!-- Use getLocalizedField to display title and summary -->
          <h3>{{ getLocalizedField(article, 'title') }}</h3>
          <p class="summary">{{ getLocalizedField(article, 'summary') }}</p>
        </div>
      </router-link>
    </div>

    <div v-else class="state-feedback">
      <p>{{ t('news.no_articles') }}</p>
    </div>
  </div>
</template>

<style scoped>
.news-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  text-align: center;
  margin-bottom: 4rem;
}

.view-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px var(--shadow-color);
  color: var(--text-primary);
}

.subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
}

.state-feedback {
  text-align: center;
  padding: 6rem 0;
  font-size: 1.3rem;
  color: var(--text-secondary);
}
.state-feedback.error {
  color: #ff7b7b;
}

.loading-spinner {
  margin: 0 auto 2rem;
  border: 4px solid var(--border-color);
  border-left-color: var(--accent-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.news-card {
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
  transform-style: preserve-3d; /* Required for vanilla-tilt */
}

[data-theme="light"] .news-card {
  color: #0d47a1;
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

.news-card:hover .card-background {
  transform: scale(1.05);
}

.card-content {
  position: relative;
  padding: 1.5rem;
  z-index: 2;
  background: var(--gradient-card);
  border-top: 1px solid var(--border-color);
}

[data-theme="light"] .card-content {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 20%, rgba(255, 255, 255, 0.9) 60%, transparent 100%);
}

.card-content h3 {
  margin: 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
}

[data-theme="light"] .card-content h3 {
  color: #0d47a1;
}

.card-content .date-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.card-content .summary {
  font-size: 1rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-glow);
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .news-card {
    min-height: 350px;
  }
}
</style>