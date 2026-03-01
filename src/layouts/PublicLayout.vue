<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import NavBar from '../components/NavBar.vue';
import DynamicBackground from '../components/DynamicBackground.vue';
import Footer from '../components/Footer.vue';

const { locale } = useI18n();
const routerKey = computed(() => locale.value + Date.now());
</script>

<template>
  <div id="public-layout">
    <DynamicBackground />

    <div class="content-wrapper">
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
}

.content-wrapper {
  max-width: 1400px; /* Max width for public pages */
  margin: 0 auto; /* Center the content */
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.app-header {
  width: 100%;
  z-index: 1000;
}

.app-content {
  flex-grow: 1;
  padding-top: 60px; /* Adjust if header height changes */
}
</style>
