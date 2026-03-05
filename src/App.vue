<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useThemeStore } from './stores/themeStore';

const themeStore = useThemeStore();

onMounted(() => {
  // Initialize theme on app mount
  document.documentElement.setAttribute('data-theme', themeStore.theme);
});
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Transition styles for fade effect */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Make sure the root element and app container take full height AND WIDTH */
html, body, #app {
  height: 100%;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scrollbar */
}

body {
  overflow-y: hidden; /* Prevent body scrollbars when content is managed internally */
}

</style>
