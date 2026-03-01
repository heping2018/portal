<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { smsLogin, sendSmsCode } from '../services/authService';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const mobile = ref('');
const code = ref('');
const isLoading = ref(false);
const isSending = ref(false);
const error = ref('');
const countdown = ref(0);

const handleSendSms = async () => {
  if (!mobile.value) {
    error.value = t('sms_login.mobile_required');
    return;
  }

  isSending.value = true;
  error.value = '';

  try {
    const response = await sendSmsCode(mobile.value, 2);
    if (response.code === 0) {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      error.value = response.msg || t('sms_login.send_failed');
    }
  } catch (err) {
    error.value = err.message || t('sms_login.send_failed');
  } finally {
    isSending.value = false;
  }
};

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const response = await smsLogin(mobile.value, code.value);
    if (response.code === 0) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      router.push('/');
    } else {
      error.value = response.msg || t('sms_login.failed');
    }
  } catch (err) {
    error.value = err.message || t('sms_login.failed');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="sms-login-container">
    <div class="sms-login-card">
      <h2>{{ t('sms_login.title') }}</h2>
      <p class="subtitle">{{ t('sms_login.subtitle') }}</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="mobile">{{ t('sms_login.mobile') }} *</label>
          <input type="tel" id="mobile" v-model="mobile" required />
        </div>

        <div class="input-group">
          <label for="code">{{ t('sms_login.code') }} *</label>
          <div class="code-input">
            <input type="text" id="code" v-model="code" required />
            <button 
              type="button" 
              @click="handleSendSms" 
              :disabled="isSending || countdown > 0"
              class="send-code-button"
            >
              {{ countdown > 0 ? `${countdown}s` : t('sms_login.send_code') }}
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" :disabled="isLoading" class="submit-button">
          {{ t('sms_login.submit') }}
        </button>
      </form>

      <div class="meta-links">
        <router-link to="/login">{{ t('sms_login.password_login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sms-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
}

.sms-login-card {
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

.code-input {
  display: flex;
  gap: 0.5rem;
}

.code-input input {
  flex: 1;
}

.send-code-button {
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  color: white;
  background: linear-gradient(45deg, #007BFF, #00C4FF);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
}

.send-code-button:disabled {
  background: #a0c3e6;
  cursor: not-allowed;
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
