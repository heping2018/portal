<template>
  <div class="job-detail-view">
    <div v-if="loading" class="loading-state">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="error-state">{{ $t('state.data_loading_failed') }}</div>
    <div v-else-if="job" class="job-content">
      <button @click="goBack" class="back-button">← {{ $t('recruitment.back_to_jobs') }}</button>
      <h1>{{ job.title }}</h1>
      <div class="job-meta">
        <span><strong>{{ $t('recruitment.department') }}:</strong> {{ job.department }}</span>
        <span><strong>{{ $t('recruitment.location') }}:</strong> {{ job.location }}</span>
        <span><strong>{{ $t('recruitment.type') }}:</strong> {{ job.type }}</span>
      </div>
      <div class="job-description" v-html="job.description"></div>

      <div class="application-form">
        <h2>{{ $t('recruitment.apply_now') }}</h2>
        <form @submit.prevent="submitApplication">
          <div class="form-group">
            <label for="name">{{ $t('recruitment.form.name') }}</label>
            <input type="text" id="name" v-model="application.name" required>
          </div>
          <div class="form-group">
            <label for="email">{{ $t('recruitment.form.email') }}</label>
            <input type="email" id="email" v-model="application.email" required>
          </div>
          <div class="form-group">
            <label for="phone">{{ $t('recruitment.form.phone') }}</label>
            <input type="tel" id="phone" v-model="application.phone">
          </div>
          <div class="form-group">
            <label for="resume">{{ $t('recruitment.form.resume') }}</label>
            <input type="file" id="resume" @change="handleFileUpload" required>
          </div>
          <button type="submit" :disabled="submitting">{{ submitting ? $t('recruitment.form.submitting') : $t('recruitment.form.submit') }}</button>
        </form>
        <p v-if="submitSuccess" class="success-message">{{ $t('recruitment.form.apply_success') }}</p>
        <p v-if="submitError" class="error-message">{{ $t('recruitment.form.apply_error') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getJobDetails, applyForJob } from '@/services/recruitmentService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const job = ref(null);
const loading = ref(true);
const error = ref(false);
const submitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);

const application = ref({
  name: '',
  email: '',
  phone: '',
  resume: null,
});

const fetchJobDetails = async () => {
  try {
    loading.value = true;
    const response = await getJobDetails(route.params.id);
    job.value = response.data;
  } catch (err) {
    console.error('Error fetching job details:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    application.value.resume = file;
  }
};

const submitApplication = async () => {
  submitting.value = true;
  submitSuccess.value = false;
  submitError.value = false;

  const formData = new FormData();
  formData.append('name', application.value.name);
  formData.append('email', application.value.email);
  formData.append('phone', application.value.phone);
  formData.append('resume', application.value.resume);

  try {
    await applyForJob(route.params.id, formData);
    submitSuccess.value = true;
    // Reset form
    application.value = { name: '', email: '', phone: '', resume: null };
    document.getElementById('resume').value = '';
  } catch (err) {
    console.error('Error submitting application:', err);
    submitError.value = true;
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'Recruitment' });
};

onMounted(() => {
  fetchJobDetails();
});
</script>

<style scoped>
.job-detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.job-meta {
  display: flex;
  gap: 2rem;
  color: #555;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.job-description {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.application-form h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="file"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button[type="submit"]:disabled {
  background-color: #a0c4e4;
  cursor: not-allowed;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
}

.success-message, .error-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}
</style>
