<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const router = useRouter();
const activeCategory = ref(0);

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
});

const categories = computed(() => [
  { key: 'saas', label: t('home.products.saas') },
  { key: 'private', label: t('home.products.private') },
  { key: 'appliance', label: t('home.products.appliance') }
]);

const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[field] || '';
};

const navigateToProduct = (product) => {
  if (product && product.id) {
    router.push({ name: 'ProductDetailView', params: { id: product.id } });
  }
};

const displayProducts = computed(() => {
  return props.products.slice(0, 10);
});
</script>

<template>
  <section class="product-section">
    <div class="section-header">
      <h2>{{ t('home.products.title') }}</h2>
      <p class="section-subtitle">{{ t('home.products.subtitle') }}</p>
    </div>

    <div class="category-tabs">
      <button 
        v-for="(cat, index) in categories"
        :key="cat.key"
        :class="['cat-btn', { active: activeCategory === index }]"
        @click="activeCategory = index"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="category-content">
      <div class="category-description">
        <p v-if="activeCategory === 0">{{ t('home.products.saas_desc') }}</p>
        <p v-else-if="activeCategory === 1">{{ t('home.products.private_desc') }}</p>
        <p v-else>{{ t('home.products.appliance_desc') }}</p>
      </div>

      <div class="products-grid">
        <div 
          v-for="(product, index) in displayProducts" 
          :key="product.id || index"
          class="product-card"
          @click="navigateToProduct(product)"
        >
          <div class="product-header">
            <img v-if="product.imageUrl" :src="product.imageUrl" :alt="getLocalizedField(product, 'title')" />
          </div>
          <h3 class="product-title">{{ getLocalizedField(product, 'title') }}</h3>
          <p class="product-desc">{{ getLocalizedField(product, 'description') }}</p>
          <a class="product-link" @click.stop="navigateToProduct(product)">
            {{ t('common.learn_more') }} >
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.product-section {
  padding: 60px 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 10px 0 0 0;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
}

.cat-btn {
  position: relative;
  padding: 15px 40px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cat-btn:hover,
.cat-btn.active {
  color: #00c3ff;
}

.category-content {
  margin-top: 30px;
}

.category-description {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 8px;
}

.category-description p {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 195, 255, 0.2);
}

.product-header {
  width: 100%;
  height: 120px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: var(--bg-card);
}

.product-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.product-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-link {
  color: #00c3ff;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
}

.product-link:hover {
  color: #9cffff;
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .product-section {
    padding: 40px 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .category-tabs {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .cat-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
