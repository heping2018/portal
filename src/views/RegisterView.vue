<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../services/authService';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  mobile: ''
});

const isLoading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('register.password_mismatch');
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const response = await register({
      username: form.value.username,
      password: form.value.password,
      nickname: form.value.nickname,
      email: form.value.email,
      mobile: form.value.mobile
    });

    if (response.code === 0) {
      router.push('/login');
    } else {
      error.value = response.msg || t('register.failed');
    }
  } catch (err) {
    error.value = err.message || t('register.failed');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h2>{{ t('register.title') }}</h2>
      <p class="subtitle">{{ t('register.subtitle') }}</p>

      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">{{ t('register.username') }} *</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            :placeholder="t('register.username_placeholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="nickname">{{ t('register.nickname') }}</label>
          <input
            type="text"
            id="nickname"
            v-model="form.nickname"
            :placeholder="t('register.nickname_placeholder')"
          />
        </div>

        <div class="input-group">
          <label for="password">{{ t('register.password') }} *</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            :placeholder="t('register.password_placeholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="confirmPassword">{{ t('register.confirm_password') }} *</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            :placeholder="t('register.confirm_password_placeholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">{{ t('register.email') }}</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            :placeholder="t('register.email_placeholder')"
          />
        </div>

        <div class="input-group">
          <label for="mobile">{{ t('register.mobile') }}</label>
          <input
            type="tel"
            id="mobile"
            v-model="form.mobile"
            :placeholder="t('register.mobile_placeholder')"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading" class="register-button" :class="{ 'is-loading': isLoading }">
          <div class="loader"></div>
          <span class="button-text">{{ t('register.submit') }}</span>
        </button>
      </form>

      <div class="meta-links">
        <router-link to="/login">{{ t('register.have_account') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
  position: relative;
}

.register-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  padding: 3rem;
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

h2 {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #FFFFFF;
}

.subtitle {
  text-align: center;
  color: #E0E0E0;
  margin-bottom: 2.5rem;
  font-weight: 300;
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #E0E0E0;
  font-size: 0.9rem;
}

.input-group input {
  box-sizing: border-box;
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  color: #FFFFFF;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-group input:focus,
.input-group input:hover {
  outline: none;
  border-color: rgba(0, 196, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 196, 255, 0.2);
}

.register-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
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
  box-shadow: 0 4px 15px rgba(0, 150, 255, 0.3);
}

.register-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 170, 255, 0.4);
}

.register-button:disabled {
  background: #a0c3e6;
  cursor: not-allowed;
  box-shadow: none;
}

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

.register-button.is-loading .loader {
  opacity: 1;
  visibility: visible;
}

.register-button.is-loading .button-text {
  opacity: 0;
  visibility: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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
  text-align: center;
  font-size: 0.9rem;
}

.meta-links a {
  color: #E0E0E0;
  text-decoration: none;
  transition: color 0.3s;
}

.meta-links a:hover {
  color: #FFFFFF;
  text-decoration: underline;
}
</style>
