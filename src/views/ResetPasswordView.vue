<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { resetPassword } from '../services/authService';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const form = ref({
  mobile: route.query.mobile || '',
  code: '',
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);
const error = ref('');

const handleReset = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('reset_password.password_mismatch');
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const response = await resetPassword(
      form.value.mobile,
      form.value.code,
      form.value.password
    );

    if (response.code === 0) {
      alert(t('reset_password.success'));
      router.push('/login');
    } else {
      error.value = response.msg || t('reset_password.failed');
    }
  } catch (err) {
    error.value = err.message || t('reset_password.failed');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="popup-container">
    <div class="popup-card">
      <h2>{{ t('reset_password.title') }}</h2>
      <p class="subtitle">{{ t('reset_password.subtitle') }}</p>

      <form @submit.prevent="handleReset">
        <div class="input-group">
          <label for="mobile">{{ t('reset_password.mobile') }} *</label>
          <input type="tel" id="mobile" v-model="form.mobile" required />
        </div>

        <div class="input-group">
          <label for="code">{{ t('reset_password.code') }} *</label>
          <input type="text" id="code" v-model="form.code" required />
        </div>

        <div class="input-group">
          <label for="password">{{ t('reset_password.new_password') }} *</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>

        <div class="input-group">
          <label for="confirmPassword">{{ t('reset_password.confirm_password') }} *</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" required />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" :disabled="isLoading" class="popup-button">
          {{ t('reset_password.submit') }}
        </button>
      </form>

      <div class="meta-links">
        <router-link to="/login">{{ t('reset_password.back_to_login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/popup.css';
</style>
