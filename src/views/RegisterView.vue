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
  <div class="popup-container">
    <div class="popup-card">
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

        <button type="submit" :disabled="isLoading" class="popup-button" :class="{ 'is-loading': isLoading }">
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
@import '../assets/popup.css';
</style>
