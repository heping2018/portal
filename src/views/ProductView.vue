<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getProductList, getProductCategories, getProductsByCategory, searchProducts } from '../services/productService.js';
import VanillaTilt from 'vanilla-tilt';

const { t, locale } = useI18n();

// --- Reactive State ---
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const searchKeyword = ref('');
const selectedCategory = ref(null);

const pagination = ref({
  pageNo: 1,
  pageSize: 12,
  total: 0,
});

const productGridRef = ref(null);

// --- Data Fetching ---

// Main function to fetch products from the original source
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    
    const response = await getProductList({ 
      pageNo: pagination.value.pageNo, 
      pageSize: pagination.value.pageSize 
    });
    if (response) {
      products.value = response;
      pagination.value.total = response.length;
    } else {
      products.value = [];
      pagination.value.total = 0;
    }
  } catch (err) {
    error.value = 'product.fetch_error';
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await getProductCategories();
    if (response.data) {
      categories.value = response.data;
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

// --- Business Logic ---

const handleCategorySelect = async (categoryCode) => {
  selectedCategory.value = categoryCode;
  searchKeyword.value = ''; // Reset search
  pagination.value.pageNo = 1; // Reset page
  loading.value = true;
  error.value = null;

  try {
    let response;
    if (categoryCode) {
      response = await getProductsByCategory(categoryCode);
    } else {
      // When "All Products" is selected, fetch the first page of all products
      response = await getProductList({ pageNo: 1, pageSize: pagination.value.pageSize });
    }

    if (response.data) {
      // The category and search endpoints might not return paginated data in the same structure
      // We adapt based on the response structure
      if (Array.isArray(response.data)) {
        products.value = response.data;
        pagination.value.total = response.data.length; // No pagination from this endpoint
      } else if (response.data.list) {
        products.value = response.data.list;
        pagination.value.total = response.data.total;
      }
    } else {
        products.value = [];
        pagination.value.total = 0;
    }

  } catch (err) {
    error.value = 'product.fetch_error';
    console.error(`Error fetching products for category ${categoryCode}:`, err);
  } finally {
    loading.value = false;
  }
};

const performSearch = async () => {
  if (!searchKeyword.value.trim()) return;
  selectedCategory.value = null; // Reset category
  pagination.value.pageNo = 1;
  loading.value = true;
  error.value = null;

  try {
    const response = await searchProducts(searchKeyword.value);
    if (response.data && Array.isArray(response.data)) {
      products.value = response.data;
      pagination.value.total = response.data.length; // No pagination from search
    } else {
        products.value = [];
        pagination.value.total = 0;
    }
  } catch (err) {
    error.value = 'product.search_error';
    console.error(`Error searching for "${searchKeyword.value}":`, err);
  } finally {
    loading.value = false;
  }
};

// --- Computed Properties ---

const totalPages = computed(() => {
  if (pagination.value.total === 0) return 1;
  // Only show pagination if we are not in a category/search view that doesn't support it
  if (selectedCategory.value !== null || searchKeyword.value) {
      return 1;
  }
  return Math.ceil(pagination.value.total / pagination.value.pageSize);
});

const getLocalized = (item, field) => {
  const lang = locale.value.split('-')[0]; // en-US -> en
  return item[`${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || item[`${field}`]; // Fallback to English
}

// --- Lifecycle & Watchers ---

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

watch(() => pagination.value.pageNo, (newPage) => {
  // Only trigger refetch if not in a filtered/searched state
  if (selectedCategory.value === null && !searchKeyword.value) {
    fetchProducts();
  }
});

const initializeTilt = () => {
  if (productGridRef.value) {
    const items = productGridRef.value.querySelectorAll('.bento-item');
    // Ensure previous instances are destroyed if any
    items.forEach(item => {
        if(item.vanillaTilt) {
            item.vanillaTilt.destroy();
        }
    });
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

watch(products, (newProducts) => {
  if (newProducts && newProducts.length >= 0) {
    nextTick(() => {
      initializeTilt();
    });
  }
}, { deep: true });

</script>

<template>
  <div class="product-view">
    <header class="view-header">
      <h1>{{ t('product.title') }}</h1>
      <p class="subtitle">{{ t('product.subtitle') }}</p>
    </header>

    <div class="product-layout">
      <!-- Sidebar for Categories -->
      <aside class="sidebar">
        <h2>{{ t('product.categories') }}</h2>
        <ul class="category-list">
          <li 
            @click="handleCategorySelect(null)" 
            :class="{ active: selectedCategory === null }"
          >
            {{ t('product.all_products') }}
          </li>
          <li 
            v-for="cat in categories" 
            :key="cat.id" 
            @click="handleCategorySelect(cat.code)" 
            :class="{ active: selectedCategory === cat.code }"
          >
            {{ getLocalized(cat, 'name') }}
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="filters">
          <input
            type="search"
            class="search-input"
            :placeholder="t('product.search_placeholder')"
            v-model="searchKeyword"
            @keyup.enter="performSearch"
          />
          <button @click="performSearch" class="search-button">{{ t('product.search') }}</button>
        </div>

        <div v-if="loading" class="state-feedback">
          <p>{{ t('product.loading') }}</p>
        </div>

        <div v-else-if="error" class="state-feedback error">
          <p>{{ t(error) }}</p>
        </div>

            <div v-else-if="products.length > 0" class="bento-grid" ref="productGridRef">
                <router-link 
                    v-for="product in products" 
                    :key="product.id" 
                    :to="`/products/${product.id}`" 
                    class="bento-item"
                >
                    <div class="card-background" :style="{ '--bg-image': `url(${product.imageUrl || 'https://via.placeholder.com/600x400'})` }"></div>
                    <div class="item-content">
                        <h3>{{ getLocalized(product, 'title') }}</h3>
                        <p class="description">{{ getLocalized(product, 'description') || 'Uncategorized' }}</p>
                    </div>
                </router-link>
            </div>

        <div v-else class="state-feedback">
          <p>{{ t('product.no_products_found') }}</p>
        </div>

        <nav class="pagination" v-if="!loading && products.length > 0 && totalPages > 1">
          <button @click="pagination.pageNo--" :disabled="pagination.pageNo <= 1">{{ t('product.previous') }}</button>
          <span>Page {{ pagination.pageNo }} of {{ totalPages }}</span>
          <button @click="pagination.pageNo++" :disabled="pagination.pageNo >= totalPages">{{ t('product.next') }}</button>
        </nav>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* General View Styles */
.product-view {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-primary);
}

.view-header {
  text-align: center;
  margin-bottom: 3rem;
}

.view-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  text-shadow: 0 0 10px var(--shadow-color);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Main Layout */
.product-layout {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
}

.sidebar {
  flex: 0 0 240px;
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(5px);
}

.sidebar h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: var(--text-secondary);
}

.category-list li:hover {
  background-color: var(--bg-card-hover);
  color: var(--text-primary);
}

.category-list li.active {
  background-color: rgba(0, 195, 255, 0.2);
  color: var(--text-primary);
  font-weight: 600;
}

.main-content {
  flex: 1;
}

/* Filters */
.filters {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 3rem;
}

.search-input {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 15px var(--shadow-color);
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: rgba(0, 195, 255, 0.2);
  border: 1px solid var(--border-color-hover);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.search-button:hover {
  background-color: rgba(0, 195, 255, 0.3);
  border-color: var(--accent-primary);
}

/* State Feedback */
.state-feedback {
  text-align: center;
  padding: 5rem 0;
  font-size: 1.2rem;
  color: var(--text-secondary);
}
.state-feedback.error {
  color: #ff6b6b;
}

/* Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 1200px;
}

/* 1个项目时：占满一行并居中 */
.bento-grid > *:only-child {
  grid-column: 1 / -1;
}

/* 2个项目时：各占50%居中 */
.bento-grid > *:first-child:nth-last-child(2) {
  grid-column: span 1;
}

.bento-grid > *:first-child:nth-last-child(2) ~ * {
  grid-column: span 1;
}

/* 4个项目的特殊布局：前3个一行，第4个占满 */
.bento-grid > *:first-child:nth-last-child(4),
.bento-grid > *:first-child:nth-last-child(4) ~ *:nth-child(-n+3) {
  grid-column: span 1;
}

.bento-grid > *:first-child:nth-last-child(4) ~ *:nth-child(4) {
  grid-column: 1 / -1;
}

.bento-item {
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
  transform-style: preserve-3d;
}

[data-theme="light"] .bento-item {
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

.bento-item:hover .card-background {
  transform: scale(1.05);
}

.item-content {
  position: relative;
  padding: 1.5rem;
  z-index: 2;
  background: var(--gradient-card);
  border-top: 1px solid var(--border-color);
}

[data-theme="light"] .item-content {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 20%, rgba(255, 255, 255, 0.9) 60%, transparent 100%);
}

.item-content h3 {
  margin: 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
}

[data-theme="light"] .item-content h3 {
  color: #0d47a1;
}

.item-content .description {
  font-size: 1rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bento-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-glow);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {  .bento-grid {    grid-template-columns: 1fr;  }  .bento-grid > *:only-child,  .bento-grid > *:first-child:nth-last-child(4) ~ *:nth-child(4) {    grid-column: 1;  }
  
  .bento-item {
    min-height: 350px;
  }
  
  .product-layout {
    flex-direction: column;
  }

  .sidebar {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: 2rem;
  }

  .filters {
    flex-direction: column;
  }

  .search-input {
    max-width: none;
  }
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
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: rgba(0, 195, 255, 0.2);
  border-color: var(--accent-primary);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  color: var(--text-secondary);
}
</style>
