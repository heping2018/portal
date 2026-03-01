<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { socialLogin } from '../services/authService';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

onMounted(async () => {
  const { type, code, state } = route.query;

  if (!type || !code || !state) {
    alert(t('auth_callback.invalid_params'));
    router.push('/login');
    return;
  }

  try {
    const response = await socialLogin(
      parseInt(type),
      code,
      state
    );

    if (response.code === 0) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      router.push('/');
    } else {
      alert(response.msg || t('auth_callback.failed'));
      router.push('/login');
    }
  } catch (err) {
    alert(err.message || t('auth_callback.failed'));
    router.push('/login');
  }
});
</script>

<template>
  <div class="callback-container">
    <div class="callback-card">
      <div class="loader"></div>
      <p>{{ t('auth_callback.processing') }}</p>
    </div>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
}

.callback-card {
  text-align: center;
  color: #FFFFFF;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

p {
  font-size: 1.2rem;
  color: #E0E0E0;
}
</style>
