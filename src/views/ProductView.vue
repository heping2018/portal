ha<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue'; // Import nextTick
import { useI18n } from 'vue-i18n';
import { useProducts } from '../composables/useProducts.js';
import VanillaTilt from 'vanilla-tilt';

const { t } = useI18n();
const {
  products,
  loading,
  error,
  pagination,
  filters,
  fetchProducts
} = useProducts();

const productGridRef = ref(null);

// Initialize Vanilla Tilt on items
const initializeTilt = () => {
  if (productGridRef.value) {
    const items = productGridRef.value.querySelectorAll('.bento-item');
    VanillaTilt.init(items, {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      perspective: 1000,
      scale: 1.02,
    });
  }
};

// Fetch products on mount
onMounted(() => {
  fetchProducts();
});

// Watch for products to load, then initialize tilt
watch(products, (newProducts) => {
  if (newProducts.length > 0) {
    // Use nextTick to ensure the DOM is updated before initializing tilt
    nextTick(() => {
        initializeTilt();
    });
  }
});

const totalPages = computed(() => {
  if (pagination.total === 0) return 1;
  return Math.ceil(pagination.total / pagination.pageSize);
});

</script>

<template>
  <div class="product-view">
    <header class="view-header">
      <h1>{{ t('product.title') }}</h1>
      <p class="subtitle">{{ t('product.subtitle') }}</p>
    </header>

    <div class="filters">
       <input
        type="search"
        class="search-input"
        :placeholder="t('product.search_placeholder')"
        v-model="filters.keyword"
       />
    </div>

    <div v-if="loading" class="state-feedback">
      <p>{{ t('product.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-feedback error">
      <p>{{ t(error) }}</p>
    </div>

    <div v-else-if="products.length > 0" class="bento-grid" ref="productGridRef">
      <!-- Updated to use `imageUrl` and `category` from the API -->
      <router-link v-for="product in products" :key="product.id" :to="`/products/${product.id}`" class="bento-item" :style="{ '--bg-image': `url(${product.imageUrl || 'https://via.placeholder.com/400x300'})` }">
        <div class="item-content">
          <h3>{{ product.titleEn }}</h3>
          <p class="category-label">{{ product.category || 'Uncategorized' }}</p>
        </div>
      </router-link>
    </div>

    <div v-else class="state-feedback">
      <p>{{ t('product.no_products_found') }}</p>
    </div>

    <nav class="pagination" v-if="!loading && pagination.total > pagination.pageSize">
      <button @click="pagination.pageNo--" :disabled="pagination.pageNo <= 1">{{ t('product.previous') }}</button>
      <span>Page {{ pagination.pageNo }} of {{ totalPages }}</span>
      <button @click="pagination.pageNo++" :disabled="pagination.pageNo >= totalPages">{{ t('product.next') }}</button>
    </nav>
  </div>
</template>

<style scoped>
/* General View Styles */
.product-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0f0f0;
}

.view-header {
  text-align: center;
  margin-bottom: 3rem;
}

.view-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: #a0c3e6;
  max-width: 600px;
  margin: 0 auto;
}

/* Filters */
.filters {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.search-input {
  background: rgba(0, 20, 40, 0.7);
  border: 1px solid rgba(0, 195, 255, 0.3);
  border-radius: 8px;
  color: #f0f0f0;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  width: 320px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.search-input:focus {
  outline: none;
  border-color: rgba(0, 195, 255, 0.7);
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.3);
}

/* Loading/Error/Empty States */
.state-feedback {
  text-align: center;
  padding: 5rem 0;
  font-size: 1.2rem;
  color: #a0c3e6;
}
.state-feedback.error {
  color: #ff6b6b;
}

/* Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.bento-item {
  position: relative;
  aspect-ratio: 4 / 3;
  background-size: cover;
  background-position: center;
  background-image: var(--bg-image);
  border-radius: 12px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  background-color: #000B11;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d; /* For Vanilla-Tilt */
  will-change: transform;
}

.bento-item::before, .bento-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  transition: all 0.4s ease;
  pointer-events: none; /* Allows clicks to go through */
}

/* Gradient Overlay */
.bento-item::before {
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);
  z-index: 1;
}

/* Animated Border */
.bento-item::after {
  border: 1px solid rgba(0, 195, 255, 0.3);
  opacity: 1;
}

.bento-item:hover::after {
  border-color: rgba(0, 195, 255, 1);
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.5);
}

.item-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 2;
  transform: translateZ(20px); /* For Vanilla-Tilt */
}

.item-content h3 {
  margin: 0 0 0.25rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.item-content .category-label {
  font-size: 0.9rem;
  color: #a0c3e6;
  opacity: 0.8;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.pagination button {
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(0, 195, 255, 0.3);
  background-color: transparent;
  color: #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: rgba(0, 195, 255, 0.2);
  border-color: rgba(0, 195, 255, 0.7);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  color: #a0c3e6;
}
</style>