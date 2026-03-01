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
  <div class="login-container">
    <div class="login-card">
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

        <button type="submit" :disabled="isLoading" class="login-button" :class="{ 'is-loading': isLoading }">
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
/* --- Base Container & Theme Alignment --- */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
  position: relative;
}

/* --- Glassmorphism Login Card (Refined) --- */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  
  /* Refined Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  animation: fadeInSlideUp 0.8s ease-out forwards;
}

@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Typography (High Contrast) --- */
h2 {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #FFFFFF; /* Pure White */
}

.subtitle {
  text-align: center;
  color: #E0E0E0; /* Light Gray */
  margin-bottom: 2.5rem;
  font-weight: 300;
}

/* --- Form Elements (Transparent & Glowing) --- */
.input-group {
  margin-bottom: 1.8rem;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 0.7rem;
  font-weight: 500;
  color: #E0E0E0; /* Light Gray */
}

.input-group input {
  box-sizing: border-box; /* Ensures padding is included in the width */
  width: 100%;
  padding: 1rem; /* Symmetrical padding */
  font-size: 1rem;
  color: #FFFFFF; /* Pure White */
  background: transparent; /* Transparent background */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle border */
  border-radius: 10px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-group input:focus,
.input-group input:hover {
  outline: none;
  border-color: rgba(0, 196, 255, 0.8); /* Brighter border on focus/hover */
  box-shadow: 0 0 15px rgba(0, 196, 255, 0.2); /* Glow effect */
}

/* --- Login Button (Gradient & Glow) --- */
.login-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  /* Gradient from Tech Blue to Cyan */
  background: linear-gradient(45deg, #007BFF, #00C4FF);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  position: relative;
  /* Outer Glow */
  box-shadow: 0 4px 15px rgba(0, 150, 255, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 170, 255, 0.4);
}

.login-button:disabled {
  background: #a0c3e6;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- Loader & Button Text Management --- */
.loader {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

.login-button.is-loading .loader {
  opacity: 1;
  visibility: visible;
}

.login-button.is-loading .button-text {
  opacity: 0;
  visibility: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- Error Message & Meta Links (High Contrast) --- */
.error-message {
  background-color: rgba(255, 100, 100, 0.1);
  color: #FFCDD2;
  padding: 1rem;
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.meta-links {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.meta-links a {
  color: #E0E0E0; /* Light Gray */
  text-decoration: none;
  transition: color 0.3s;
}

.meta-links a:hover {
  color: #FFFFFF; /* Pure White on hover */
  text-decoration: underline;
}
</style>
