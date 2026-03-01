<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
// The new v-slot syntax for router-view requires no additional script setup for this feature.
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #000B18; /* Ensure body background matches app theme */
  color: #E0E0E0;
}

/* Transition styles for fade effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
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
