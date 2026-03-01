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
  <div class="forgot-password-container">
    <div class="forgot-password-card">
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

        <button type="submit" :disabled="isLoading || smsSent" class="submit-button" :class="{ 'is-loading': isLoading }">
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
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
  position: relative;
}

.forgot-password-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 1.8rem;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 0.7rem;
  font-weight: 500;
  color: #E0E0E0;
}

.input-group input {
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
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
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 150, 255, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 170, 255, 0.4);
}

.submit-button:disabled {
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

.submit-button.is-loading .loader {
  opacity: 1;
  visibility: visible;
}

.submit-button.is-loading .button-text {
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
