<script setup>
import { ref, onMounted } from 'vue';
import { 
  getAuthConfig, 
  updateAuthConfig, 
  switchAuthType, 
  toggleSSO 
} from '../services/authConfigService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const config = ref({
  authType: 'JWT',
  singleDeviceLogin: false,
  sessionTimeout: 3600,
  jwtSecret: '',
  jwtExpiration: 86400000,
  oauth2Provider: '',
  oauth2ClientId: '',
  oauth2ClientSecret: '',
  oauth2RedirectUri: ''
});

const isLoading = ref(false);
const isSaving = ref(false);
const error = ref('');
const message = ref('');

onMounted(async () => {
  await loadConfig();
});

const loadConfig = async () => {
  isLoading.value = true;
  try {
    const response = await getAuthConfig();
    if (response.code === 0) {
      config.value = response.data;
    } else {
      error.value = response.msg || t('auth_config.load_failed');
    }
  } catch (err) {
    error.value = err.message || t('auth_config.load_failed');
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  error.value = '';
  message.value = '';

  try {
    const response = await updateAuthConfig(config.value);
    if (response.code === 0) {
      message.value = t('auth_config.save_success');
    } else {
      error.value = response.msg || t('auth_config.save_failed');
    }
  } catch (err) {
    error.value = err.message || t('auth_config.save_failed');
  } finally {
    isSaving.value = false;
  }
};

const handleSwitchAuthType = async (authType) => {
  try {
    const response = await switchAuthType(authType);
    if (response.code === 0) {
      config.value.authType = authType;
      message.value = t('auth_config.switch_success');
    } else {
      error.value = response.msg || t('auth_config.switch_failed');
    }
  } catch (err) {
    error.value = err.message || t('auth_config.switch_failed');
  }
};

const handleToggleSSO = async () => {
  try {
    const response = await toggleSSO(!config.value.singleDeviceLogin);
    if (response.code === 0) {
      config.value.singleDeviceLogin = !config.value.singleDeviceLogin;
      message.value = t('auth_config.toggle_sso_success');
    } else {
      error.value = response.msg || t('auth_config.toggle_sso_failed');
    }
  } catch (err) {
    error.value = err.message || t('auth_config.toggle_sso_failed');
  }
};
</script>

<template>
  <div class="auth-config-container">
    <h1>{{ t('auth_config.title') }}</h1>

    <div v-if="isLoading" class="loading">{{ t('common.loading') }}</div>

    <div v-else class="config-form">
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="message" class="success-message">{{ message }}</div>

      <div class="config-section">
        <h2>{{ t('auth_config.auth_type_section') }}</h2>
        <div class="auth-type-buttons">
          <button 
            @click="handleSwitchAuthType('JWT')"
            :class="{ active: config.authType === 'JWT' }"
            class="auth-type-btn"
          >
            JWT
          </button>
          <button 
            @click="handleSwitchAuthType('OAUTH2')"
            :class="{ active: config.authType === 'OAUTH2' }"
            class="auth-type-btn"
          >
            OAuth2
          </button>
        </div>
      </div>

      <div class="config-section">
        <h2>{{ t('auth_config.general_section') }}</h2>
        
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="config.singleDeviceLogin" @change="handleToggleSSO" />
            {{ t('auth_config.single_device_login') }}
          </label>
        </div>

        <div class="form-group">
          <label>{{ t('auth_config.session_timeout') }} ({{ t('common.seconds') }})</label>
          <input type="number" v-model="config.sessionTimeout" />
        </div>
      </div>

      <div v-if="config.authType === 'JWT'" class="config-section">
        <h2>{{ t('auth_config.jwt_section') }}</h2>
        
        <div class="form-group">
          <label>{{ t('auth_config.jwt_secret') }}</label>
          <input type="password" v-model="config.jwtSecret" />
        </div>

        <div class="form-group">
          <label>{{ t('auth_config.jwt_expiration') }} ({{ t('common.milliseconds') }})</label>
          <input type="number" v-model="config.jwtExpiration" />
        </div>
      </div>

      <div v-if="config.authType === 'OAUTH2'" class="config-section">
        <h2>{{ t('auth_config.oauth2_section') }}</h2>
        
        <div class="form-group">
          <label>{{ t('auth_config.oauth2_provider') }}</label>
          <input type="text" v-model="config.oauth2Provider" />
        </div>

        <div class="form-group">
          <label>{{ t('auth_config.oauth2_client_id') }}</label>
          <input type="text" v-model="config.oauth2ClientId" />
        </div>

        <div class="form-group">
          <label>{{ t('auth_config.oauth2_client_secret') }}</label>
          <input type="password" v-model="config.oauth2ClientSecret" />
        </div>

        <div class="form-group">
          <label>{{ t('auth_config.oauth2_redirect_uri') }}</label>
          <input type="text" v-model="config.oauth2RedirectUri" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="handleSave" :disabled="isSaving" class="save-button">
          {{ t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-config-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.config-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.config-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.config-section:last-of-type {
  border-bottom: none;
}

.auth-type-buttons {
  display: flex;
  gap: 1rem;
}

.auth-type-btn {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border: 2px solid #007BFF;
  background: white;
  color: #007BFF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-type-btn.active {
  background: #007BFF;
  color: white;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  background-color: #efe;
  color: #3c3;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-actions {
  text-align: right;
}

.save-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(45deg, #007BFF, #00C4FF);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-button:disabled {
  background: #a0c3e6;
  cursor: not-allowed;
}
</style>
