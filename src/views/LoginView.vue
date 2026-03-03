<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { login, isLoading, error, resetLoginState } = useAuth(); // Destructure resetLoginState
const { t } = useI18n();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await login(username.value, password.value);
  if (success) {
    await nextTick();
    router.push('/');
  }
};

// Lifecycle hooks to manage the login form's state
// When the component is mounted, and when it's unmounted,
// reset the loading and error states to ensure a clean slate.
onMounted(() => {
  resetLoginState();
});

onUnmounted(() => {
  resetLoginState();
});
</script>

<template>
  <div class="popup-container">
    <div class="popup-card">
      <h2>{{ t('login.title') }}</h2>
      <p class="subtitle">{{ t('login.subtitle') }}</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">{{ t('login.username') }}</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            :placeholder="t('login.username_placeholder')" 
            required
          />
        </div>

        <div class="input-group">
          <label for="password">{{ t('login.password') }}</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            :placeholder="t('login.password_placeholder')" 
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading" class="popup-button" :class="{ 'is-loading': isLoading }">
          <div class="loader"></div>
          <span class="button-text">{{ t('login.submit') }}</span>
        </button>
      </form>

      <div class="meta-links">
        <router-link to="/register">{{ t('login.no_account') }}</router-link>
        <router-link to="/forgot-password">{{ t('login.forgot_password') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/popup.css';
</style>
