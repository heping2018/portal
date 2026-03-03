hao<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getNews } from '../services/newsService'; // Corrected import

const { t, locale } = useI18n();
const route = useRoute();

const article = ref(null);
const loading = ref(true);
const error = ref(null);

const articleId = computed(() => route.params.id);

// Helper for localized fields
const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || '';
};

const fetchArticle = async () => {
  if (!articleId.value) {
    error.value = t('news_detail.no_id_provided');
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    article.value = await getNews(articleId.value); // Corrected function call
  } catch (err) {
    error.value = t('news_detail.not_found');
    console.error('Failed to fetch article:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const dateLocale = locale.value.startsWith('zh') ? 'zh-CN' : 'en-US';
  return new Date(dateString).toLocaleDateString(dateLocale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

onMounted(() => {
  fetchArticle();
});
</script>

<template>
  <div class="news-detail-view">
    <router-link to="/news" class="back-link">&#8592; {{ t('news_detail.back_to_news') }}</router-link>
    
    <div v-if="loading" class="state-feedback">
      <p>{{ t('news_detail.loading') }}</p>
    </div>
    
    <div v-if="error" class="state-feedback error">
      <p>{{ error }}</p>
    </div>

    <article v-if="article" class="article-card">
      <div class="article-header">
        <h1 class="article-title">{{ getLocalizedField(article, 'title') }}</h1>
        <p class="article-meta">{{ t('news_detail.published_on') }} {{ formatDate(article.createTime) }}</p>
      </div>
      <div class="article-image-container" v-if="article.picUrl">
        <img :src="article.picUrl" :alt="getLocalizedField(article, 'title')" class="article-image">
      </div>
      <div class="article-body" v-html="getLocalizedField(article, 'content')"></div>
    </article>
  </div>
</template>

<style scoped>
/* Main Container & Feedback States */
.news-detail-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0f0f0;
}

.state-feedback {
  text-align: center;
  padding: 6rem 0;
  font-size: 1.2rem;
  color: #a0c3e6;
}
.state-feedback.error {
  color: #ff6b6b;
}

.back-link {
  display: inline-flex; 
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: #00c3ff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s, text-shadow 0.3s;
}
.back-link:hover {
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 195, 255, 0.7);
}

/* Glassmorphism Article Card */
.article-card {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 195, 255, 0.25);
  border-radius: 16px;
  padding: 2rem 3rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.article-header {
  text-align: center;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgba(0, 195, 255, 0.2);
  padding-bottom: 2rem;
}

.article-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 12px rgba(0, 195, 255, 0.4);
  margin: 0;
  line-height: 1.3;
}

.article-meta {
  color: #a0c3e6;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.article-image-container {
  margin-bottom: 2.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.article-image {
  width: 100%;
  display: block;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #c0d8f0;
}

/* Styling for content coming from v-html */
.article-body :deep(h2) {
  font-size: 1.8rem;
  color: #e0e0e0;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 195, 255, 0.2);
}

.article-body :deep(p) {
  margin-bottom: 1.5rem;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.article-body :deep(li) {
  margin-bottom: 0.75rem;
}

.article-body :deep(a) {
  color: #00c3ff;
  text-decoration: none;
  transition: color 0.3s, text-decoration 0.3s;
}

.article-body :deep(a:hover) {
  color: #fff;
  text-decoration: underline;
}

.article-body :deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid rgba(0, 195, 255, 0.4);
  background: rgba(0, 20, 40, 0.5);
  color: #a0c3e6;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .article-card {
    padding: 1.5rem;
  }
  .article-title {
    font-size: 2.2rem;
  }
}
</style>
