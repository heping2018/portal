<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getProductsPage } from '../services/productService';
import { useRouter } from 'vue-router';
import VanillaTilt from 'vanilla-tilt';

const { t, locale } = useI18n();
const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const gridRef = ref(null);

// Safely get a product at a specific index
const getProductAt = (index) => computed(() => products.value[index]);

const mainProduct = getProductAt(0);
const sideProduct1 = getProductAt(1);
const sideProduct2 = getProductAt(2);
const sideProduct3 = getProductAt(3);

// Helper for localized fields
const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || '';
};

// Fetch exactly 4 products for the bento grid
const fetchFeaturedProducts = async () => {
  try {
    loading.value = true;
    const response = await getProductsPage(1, 4); // Fetch 4 products
    products.value = response.list || [];
    
    await nextTick();
    initializeTilt();

  } catch (err) {
    error.value = t('product.fetch_error'); // Use i18n key for consistency
    console.error('Bento Grid fetch error:', err);
  } finally {
    loading.value = false;
  }
};

const initializeTilt = () => {
  if (gridRef.value) {
    const items = gridRef.value.querySelectorAll('.bento-item');
    if (items.length) {
      VanillaTilt.init(items, {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        perspective: 1000,
        scale: 1.02,
      });
    }
  }
};

const navigateToProduct = (productId) => {
  if (productId) {
    router.push({ name: 'ProductDetailView', params: { id: productId } });
  }
}

onMounted(fetchFeaturedProducts);

</script>

<template>
  <section class="bento-grid-section">
    <div v-if="loading" class="state-feedback">
      <p>{{ t('bento.loading') }}</p>
    </div>
    <div v-else-if="error" class="state-feedback error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="products.length >= 4" class="bento-grid" ref="gridRef">
      <!-- Main featured item -->
      <div 
        class="bento-item main-item"
        :style="{ '--bg-image': `url(${mainProduct.imageUrl})` }"
        @click="navigateToProduct(mainProduct.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(mainProduct, 'title') }}</h3>
          <p>{{ getLocalizedField(mainProduct, 'description') }}</p>
        </div>
      </div>

      <!-- Three smaller side items -->
      <div 
        class="bento-item side-item-1"
        :style="{ '--bg-image': `url(${sideProduct1.imageUrl})` }"
        @click="navigateToProduct(sideProduct1.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(sideProduct1, 'title') }}</h3>
        </div>
      </div>

      <div 
        class="bento-item side-item-2"
        :style="{ '--bg-image': `url(${sideProduct2.imageUrl})` }"
        @click="navigateToProduct(sideProduct2.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(sideProduct2, 'title') }}</h3>
        </div>
      </div>

      <div 
        class="bento-item side-item-3"
        :style="{ '--bg-image': `url(${sideProduct3.imageUrl})` }"
        @click="navigateToProduct(sideProduct3.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(sideProduct3, 'title') }}</h3>
        </div>
      </div>
    </div>
    <div v-else class="state-feedback">
      <p>{{ t('bento.no_products') }}</p>
    </div>
  </section>
</template>

<style scoped>
.bento-grid-section {
  padding: 0 2rem 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.state-feedback {
  text-align: center;
  padding: 5rem 0;
  font-size: 1.2rem;
  color: #a0c3e6;
}
.state-feedback.error {
  color: #ff6b6b;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 250px);
  gap: 1.5rem;
  height: 515px; /* 250px * 2 + 1.5rem gap */
}

.bento-item {
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: var(--bg-image, url('https://via.placeholder.com/400x300'));
  border-radius: 12px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  background-color: #000B18;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
}

.bento-item::before, .bento-item::after {
  content: '';
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  border-radius: 12px;
  transition: all 0.4s ease;
  pointer-events: none;
}

.bento-item::before {
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%);
  z-index: 1;
}

.bento-item::after {
  border: 1px solid rgba(0, 195, 255, 0.3);
}

.bento-item:hover::after {
  border-color: #00c3ff;
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.5);
}

.item-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 1.2rem;
  z-index: 2;
  transform: translateZ(20px);
}

.item-content h3 {
  margin: 0 0 0.2rem 0;
  font-size: 1.4rem;
  line-height: 1.3;
  font-weight: 600;
}

.item-content p {
  margin: 0;
  font-size: 1rem;
  color: #a0c3e6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Grid layout definitions */
.main-item {
  grid-column: 1 / 3; /* Span 2 columns */
  grid-row: 1 / 3;    /* Span 2 rows */
}

.side-item-1 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.side-item-2 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  display: none; /* Hide for now */
}

/* A three-product layout is often more balanced */
.bento-grid {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  height: auto;
  grid-auto-rows: 250px;
}

.main-item {
  grid-column: 1 / 3;
  grid-row: 1 / 3; /* Span 2 rows */
}

.side-item-1 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.side-item-2 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  display: block; /* Show this one */
}

.side-item-3 {
  display: none; /* Hide the 4th item */
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .bento-grid {
     grid-template-columns: 1fr; /* Stack on smaller screens */
     grid-template-rows: auto;
     height: auto;
  }
  .main-item, .side-item-1, .side-item-2 {
    grid-column: 1 / 2;
    grid-row: auto;
    height: 300px;
  }
  .side-item-3 { display: none; }
}

</style>
