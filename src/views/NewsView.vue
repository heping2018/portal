<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getNewsPage } from '../services/newsService';
import VanillaTilt from 'vanilla-tilt';

const { t, locale } = useI18n();

const news = ref([]);
const loading = ref(true);
const error = ref(null);
const gridRef = ref(null);

const fetchNews = async () => {
  try {
    loading.value = true;
    const data = await getNewsPage({ pageNo: 1, pageSize: 9 });
    news.value = data.list;
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

// Watch for news to load, then initialize tilt
watch(news, (newNews) => {
  if (newNews.length > 0) {
    // Use nextTick to ensure the DOM is updated before initializing tilt
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
      <p>{{ t('news.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-feedback error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="news.length > 0" class="news-grid" ref="gridRef">
      <router-link
        v-for="article in news"
        :key="article.id"
        :to="{ name: 'NewsDetailView', params: { id: article.id } }"
        class="news-card"
      >
        <div class="card-background" :style="{ '--bg-image': `url(${article.thumbnailUrl || 'https://via.placeholder.com/600x400'})` }"></div>
        <div class="card-content">
          <p class="date-label">{{ formatDate(article.createTime) }}</p>
          <h3>{{ article.titleEn }}</h3>
          <!-- Use article.summaryEn for the summary -->
          <p class="summary">{{ article.summaryEn }}</p>
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
  text-shadow: 0 0 15px rgba(0, 195, 255, 0.6);
}

.subtitle {
  font-size: 1.3rem;
  color: #a0c3e6;
}

.state-feedback {
  text-align: center;
  padding: 6rem 0;
  font-size: 1.3rem;
  color: #a0c3e6;
}
.state-feedback.error {
  color: #ff7b7b;
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
  justify-content: flex-end; /* Align content to the bottom */
  position: relative;
  min-height: 400px;
  border-radius: 16px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  background-color: #001A33;
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

.news-card:hover .card-background {
  transform: scale(1.05);
}

.card-content {
  position: relative;
  padding: 1.5rem;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 10, 20, 0.95) 20%, rgba(0, 10, 20, 0.7) 60%, transparent 100%);
  border-top: 1px solid rgba(0, 195, 255, 0.2);
}

.card-content h3 {
  margin: 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
}

.card-content .date-label {
  font-size: 0.9rem;
  color: #a0c3e6;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.card-content .summary {
    font-size: 1rem;
    color: #c0d8f0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;  
    overflow: hidden;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 5, 10, 0.5), 0 0 40px rgba(0, 195, 255, 0.4);
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