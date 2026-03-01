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
  <div class="reset-password-container">
    <div class="reset-password-card">
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

        <button type="submit" :disabled="isLoading" class="submit-button">
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
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
}

.reset-password-card {
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
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
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #E0E0E0;
}

.input-group input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  color: #FFFFFF;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.input-group input:focus {
  outline: none;
  border-color: rgba(0, 196, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 196, 255, 0.2);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(45deg, #007BFF, #00C4FF);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 1rem;
}

.submit-button:disabled {
  background: #a0c3e6;
  cursor: not-allowed;
}

.error-message {
  background-color: rgba(255, 100, 100, 0.1);
  color: #FFCDD2;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
}

.meta-links {
  margin-top: 2rem;
  text-align: center;
}

.meta-links a {
  color: #E0E0E0;
  text-decoration: none;
}
</style>
