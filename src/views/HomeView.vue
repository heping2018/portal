<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BannerSection from '../components/HomeSections/BannerSection.vue';
import SolutionSection from '../components/HomeSections/SolutionSection.vue';
import ProductCategorySection from '../components/HomeSections/ProductCategorySection.vue';
import ServiceSection from '../components/HomeSections/ServiceSection.vue';
import PartnerSection from '../components/HomeSections/PartnerSection.vue';
import { getProductList } from '../services/productService';
import { getSolutionList } from '../services/solutionService';

const { t } = useI18n();
const products = ref([]);
const solutions = ref([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    const [productsRes, solutionsRes] = await Promise.all([
      getProductList({ pageNo: 1, pageSize: 10 }),
      getSolutionList({ pageNo: 1, pageSize: 10 })
    ]);
    products.value = productsRes?.data || [];
    solutions.value = solutionsRes?.data || [];
  } catch (error) {
    console.error('Failed to fetch home data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="home-view">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ t('common.loading') }}</p>
    </div>
    
    <template v-else>
      <BannerSection :solutions="solutions" />
      <ServiceSection />
      <SolutionSection :solutions="solutions" />
      <ProductCategorySection :products="products" />
      <PartnerSection />
    </template>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #001529;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 21, 41, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 195, 255, 0.3);
  border-top-color: #00c3ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  color: #a0c3e6;
  font-size: 1.1rem;
  margin-top: 1rem;
}
</style>
