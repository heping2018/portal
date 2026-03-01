<script setup>
import HeroSection from '../components/HeroSection.vue';
import ProductBentoGrid from '../components/ProductBentoGrid.vue';
</script>

<template>
  <div class="home-view">
    <HeroSection />
    <ProductBentoGrid />
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 4rem; /* Spacing between sections */
}
</style>
