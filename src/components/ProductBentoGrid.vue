<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getProductList } from '../services/productService';
import { useRouter } from 'vue-router';
import VanillaTilt from 'vanilla-tilt';

const { t, locale } = useI18n();
const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const gridRef = ref(null);

// Helper to format the image URL correctly
const formatImageUrl = (url) => {
  if (url && url.startsWith('public/')) {
    return `/${url.substring(7)}`;
  }
  return url;
};

// Safely get a product at a specific index and format its URL
const getProductAt = (index) => computed(() => {
  const product = products.value[index];
  if (!product) return null;
  return {
    ...product,
    imageUrl: formatImageUrl(product.imageUrl),
  };
});

const mainProduct = getProductAt(0);
const sideProduct1 = getProductAt(1);
const sideProduct2 = getProductAt(2);
const sideProduct3 = getProductAt(3);

// Corrected helper for localized fields
const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}`] || '';
};

// Fetch up to 4 products for the bento grid
const fetchFeaturedProducts = async () => {
  try {
    loading.value = true;
    const response = await getProductList({ pageNo: 1, pageSize: 4 });
    products.value = response || [];
    await nextTick();
    initializeTilt();
  } catch (err) {
    error.value = t('product.fetch_error');
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
};

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
    <div v-else-if="products.length > 0" class="bento-grid" ref="gridRef">
      <!-- Main featured item -->
      <div
        v-if="mainProduct"
        class="bento-item main-item"
        :style="{ '--bg-image': `url(${mainProduct.imageUrl})` }"
        @click="navigateToProduct(mainProduct.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(mainProduct, 'title') }}</h3>
          <!-- Description is now always visible and can wrap -->
          <p>{{ getLocalizedField(mainProduct, 'description') }}</p>
        </div>
      </div>

      <!-- Side items -->
      <div
        v-if="sideProduct1"
        class="bento-item side-item-1"
        :style="{ '--bg-image': `url(${sideProduct1.imageUrl})` }"
        @click="navigateToProduct(sideProduct1.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(sideProduct1, 'title') }}</h3>
        </div>
      </div>

      <div
        v-if="sideProduct2"
        class="bento-item side-item-2"
        :style="{ '--bg-image': `url(${sideProduct2.imageUrl})` }"
        @click="navigateToProduct(sideProduct2.id)"
      >
        <div class="item-content">
          <h3>{{ getLocalizedField(sideProduct2, 'title') }}</h3>
        </div>
      </div>

      <div
        v-if="sideProduct3"
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

/* Grid Definition for self-sizing rows */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* Removed fixed grid-template-rows to allow content to define height */
  gap: 1.5rem;
}

/* Item styling for content-driven height */
.bento-item {
  position: relative; /* Still needed for pseudo-elements */
  display: flex; /* Use flexbox for vertical alignment */
  flex-direction: column;
  justify-content: flex-end; /* Push content to the bottom */
  min-height: 260px; /* Minimum height for visual consistency */
  
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

/* Content is now part of the flex flow */
.item-content {
  /* No longer position: absolute */
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

/* Allow description to wrap freely */
.item-content p {
  margin: 0;
  font-size: 1rem;
  color: #a0c3e6;
  /* Removed line-clamp for full text display */
}

/* Grid Layout */
.main-item {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

.side-item-1 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.side-item-2 {
  grid-column: 4 / 5;
  grid-row: 1 / 2;
}

.side-item-3 {
  grid-column: 3 / 5;
  grid-row: 2 / 3;
}

/* Responsive adjustments for self-sizing rows */
@media (max-width: 992px) {
  .bento-grid {
     grid-template-columns: repeat(2, 1fr);
     /* No fixed rows or height */
  }
  .main-item {
    grid-column: 1 / 3;
    grid-row: auto; /* Let content decide */
    /* Removed fixed height */
  }
  .side-item-1, .side-item-2, .side-item-3 {
    grid-column: span 1;
    grid-row: auto; /* Let content decide */
    /* Removed fixed height */
  }
}

@media (max-width: 576px) {
    .bento-grid {
        grid-template-columns: 1fr;
    }
    .main-item, .side-item-1, .side-item-2, .side-item-3 {
        grid-column: 1 / 2;
        /* Height is already adaptive */
    }
}
</style>