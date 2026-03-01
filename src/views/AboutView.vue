<template>
  <div class="about-view">
    <header class="view-header">
      <h1>{{ t('about.title') }}</h1>
      <p class="subtitle">{{ t('about.subtitle') }}</p>
    </header>
    <!-- Content will be added in subsequent steps -->
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.about-view {
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
</style>
