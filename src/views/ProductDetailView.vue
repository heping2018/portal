<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProductDetail } from '../services/productService';

const route = useRoute();
const { t, locale } = useI18n();

const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

const getLocalizedField = (item, field) => {
  if (!item) return 'N/A';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || 'N/A';
};

onMounted(async () => {
  const productId = route.params.id;
  if (!productId) {
    error.value = t('product_detail.no_id_provided');
    isLoading.value = false;
    return;
  }

  try {
    const data = await getProductDetail(productId);
    if (data) {
      product.value = data;
    } else {
      error.value = t('product_detail.not_found');
    }
  } catch (err) {
    error.value = err.message || t('product_detail.fetch_error');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="product-detail-container">
    <router-link to="/products" class="back-link">&#8592; {{ t('product_detail.back_to_products') }}</router-link>

    <div v-if="isLoading" class="state-feedback">
      <p>{{ t('product_detail.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-feedback error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="product" class="detail-card">
      <div class="product-gallery">
        <img :src="product.imageUrl || 'https://via.placeholder.com/600x400'" :alt="getLocalizedField(product, 'title')" class="main-product-image">
      </div>
      <div class="product-info">
        <h1 class="title">{{ getLocalizedField(product, 'title') }}</h1>
        <p class="description">{{ getLocalizedField(product, 'description') }}</p>

        <div class="details-section" v-if="product.specs && product.specs.length">
          <h2>{{ t('product_detail.specifications') }}</h2>
          <ul class="spec-list">
            <li v-for="spec in product.specs" :key="spec.id">
              <strong>{{ spec.specKey }}</strong>
              <span>{{ spec.specValue }} {{ spec.specUnit || '' }}</span>
            </li>
          </ul>
        </div>

        <div class="details-section" v-if="product.downloads && product.downloads.length">
          <h2>{{ t('product_detail.downloads') }}</h2>
          <ul class="download-list">
            <li v-for="file in product.downloads" :key="file.id">
              <a :href="file.downloadUrl" target="_blank" rel="noopener noreferrer">
                {{ file.title }} ({{ file.fileType }}, {{ (file.fileSize / 1024).toFixed(2) }} KB)
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main Container & Feedback States */
.product-detail-container {
  max-width: 1200px;
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

/* Glassmorphism Card */
.detail-card {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 195, 255, 0.25);
  border-radius: 16px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 3rem;
  align-items: start;
}

/* Gallery */
.product-gallery .main-product-image {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Product Info Section */
.product-info .title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.3);
  margin-bottom: 1.5rem;
}

.product-info .description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #a0c3e6;
  margin-bottom: 3rem;
}

.details-section h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #e0e0e0;
  border-bottom: 1px solid rgba(0, 195, 255, 0.3);
  padding-bottom: 0.75rem;
}

/* Spec List */
.spec-list {
  list-style: none;
  padding: 0;
  font-size: 1rem;
}

.spec-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.9rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.spec-list li:last-child {
  border-bottom: none;
}

.spec-list strong {
  color: #c0d8f0;
  font-weight: 500;
}

.spec-list span {
  color: #a0c3e6;
  text-align: right;
}

/* Download List */
.download-list {
  list-style: none;
  padding: 0;
}

.download-list li a {
  display: block;
  padding: 0.85rem 1.2rem;
  border: 1px solid rgba(0, 195, 255, 0.3);
  background-color: transparent;
  border-radius: 8px;
  text-decoration: none;
  color: #c0d8f0;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.download-list li a:hover {
  background-color: rgba(0, 195, 255, 0.15);
  border-color: rgba(0, 195, 255, 0.7);
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.2);
}

/* Responsive */
@media (max-width: 900px) {
  .detail-card {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  .product-detail-container { padding: 1rem; }
  .detail-card { padding: 1.5rem; }
  .product-info .title { font-size: 2rem; }
}
</style>
