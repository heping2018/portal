<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NavBar from '../components/NavBar.vue';
import DynamicBackground from '../components/DynamicBackground.vue';
import Footer from '../components/Footer.vue';

const { locale } = useI18n();
const route = useRoute();

const routerKey = computed(() => locale.value + Date.now());

// Check if the current route needs a full-width layout
const isFullWidthLayout = computed(() => route.meta.fullWidth === true);
</script>

<template>
  <div id="public-layout">
    <DynamicBackground />

    <div 
      class="content-wrapper"
      :class="{ 'content-wrapper--full-width': isFullWidthLayout }"
    >
      <header class="app-header">
        <NavBar />
      </header>

      <main class="app-content">
        <router-view :key="routerKey" />
      </main>

      <Footer />
    </div>
  </div>
</template>

<style scoped>
#public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000B18;
  /* The main layout container itself should not have horizontal padding */
}

.content-wrapper {
  max-width: 1400px; /* Default max width for most pages */
  margin: 0 auto;   /* Center the content by default */
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* This class will be applied when a route has meta.fullWidth = true */
.content-wrapper--full-width {
  max-width: 100%;
}

.app-header {
  width: 100%;
  z-index: 1000;
}

.app-content {
  flex-grow: 1;
  padding-top: 60px; /* Adjust if header height changes */
  /* This is the main content area, it should not have horizontal padding either */
  /* The padding should be handled by the components inside the router-view */
}
</style>
