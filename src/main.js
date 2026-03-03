import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import './style.css';
import { useAuthStore } from './stores/authStore';

// Create the app instance
const app = createApp(App);

// Create and use Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Use ElementPlus UI framework
app.use(ElementPlus);

/**
 * Asynchronous initialization function.
 * This ensures that essential services like session resumption are completed
 * before the application is mounted.
 */
async function initializeApp() {
  // Must be called after Pinia is initialized
  const authStore = useAuthStore();

  try {
    // Attempt to resume session from localStorage.
    // This is crucial to run before the router is fully active to prevent race conditions.
    await authStore.tryToResumeSession();
  } catch (error) {
    console.error("Failed to resume session during app initialization:", error);
    // If session resumption fails, we can clear the state as a fallback
    await authStore.logout();
  }

  // Use router and i18n after session state is potentially restored
  app.use(router);
  app.use(i18n);

  // Mount the application to the DOM
  app.mount('#app');
}

// Execute the async initialization
initializeApp();
