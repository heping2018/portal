<script setup>
import { ref } from 'vue';
import { sendSmsCode } from '../services/authService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const mobile = ref('');
const isLoading = ref(false);
const message = ref('');
const error = ref('');
const smsSent = ref(false);

const handleSendSms = async () => {
  isLoading.value = true;
  error.value = '';
  message.value = '';

  try {
    const response = await sendSmsCode(mobile.value, 1);
    
    if (response.code === 0) {
      smsSent.value = true;
      message.value = t('forgot_password.sms_sent');
    } else {
      error.value = response.msg || t('forgot_password.failed');
    }
  } catch (err) {
    error.value = err.message || t('forgot_password.failed');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="popup-container">
    <div class="popup-card">
      <h2>{{ t('forgot_password.title') }}</h2>
      <p class="subtitle">{{ t('forgot_password.subtitle') }}</p>

      <form @submit.prevent="handleSendSms">
        <div class="input-group">
          <label for="mobile">{{ t('forgot_password.mobile') }} *</label>
          <input
            type="tel"
            id="mobile"
            v-model="mobile"
            :placeholder="t('forgot_password.mobile_placeholder')"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="message" class="success-message">
          {{ message }}
        </div>

        <button type="submit" :disabled="isLoading || smsSent" class="popup-button" :class="{ 'is-loading': isLoading }">
          <div class="loader"></div>
          <span class="button-text">{{ smsSent ? t('forgot_password.sms_sent_btn') : t('forgot_password.submit') }}</span>
        </button>
      </form>

      <div class="meta-links">
        <router-link to="/login">{{ t('forgot_password.back_to_login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/popup.css';

.success-message {
  background-color: rgba(100, 255, 100, 0.1);
  color: #C8E6C9;
  padding: 1rem;
  border: 1px solid rgba(100, 255, 100, 0.3);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
}
</style>
