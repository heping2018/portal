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
        <span><strong>薪资:</strong> {{ job.salaryRange }}</span>
        <span><strong>招聘人数:</strong> {{ job.headcount }}</span>
      </div>
      <div class="job-section">
        <h3>岗位职责</h3>
        <div v-html="job.responsibility"></div>
      </div>
      <div class="job-section">
        <h3>任职要求</h3>
        <div v-html="job.requirement"></div>
      </div>

      <div class="application-form">
        <h2>{{ $t('测试') }}</h2>
        <form @submit.prevent="submitApplication">
          <div class="form-group">
            <label for="applicantName">姓名 <span class="required">*</span></label>
            <input type="text" id="applicantName" v-model="application.applicantName" required>
          </div>
          <div class="form-group">
            <label for="email">邮箱 <span class="required">*</span></label>
            <input type="email" id="email" v-model="application.email" required>
          </div>
          <div class="form-group">
            <label for="phone">手机号 <span class="required">*</span></label>
            <input type="tel" id="phone" v-model="application.phone" required>
          </div>
          <div class="form-group">
            <label for="resume">简历文件 (PDF/DOC/DOCX，最大10MB)</label>
            <input type="file" id="resume" @change="handleFileUpload" accept=".pdf,.doc,.docx">
            <span v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
              上传中... {{ uploadProgress }}%
            </span>
            <span v-if="resumeUrl" class="upload-success">✓ 简历已上传</span>
          </div>
          <div class="form-group">
            <label for="coverLetter">求职信 (最多2000字符)</label>
            <textarea id="coverLetter" v-model="application.coverLetter" rows="4" maxlength="2000"></textarea>
          </div>
          <div class="form-group">
            <label for="education">教育背景 (最多500字符)</label>
            <textarea id="education" v-model="application.education" rows="3" maxlength="500"></textarea>
          </div>
          <div class="form-group">
            <label for="experience">工作经历 (最多2000字符)</label>
            <textarea id="experience" v-model="application.experience" rows="4" maxlength="2000"></textarea>
          </div>
          <div class="form-group">
            <label for="source">申请来源</label>
            <select id="source" v-model="application.source">
              <option value="website">官网</option>
              <option value="referral">推荐</option>
              <option value="other">其他</option>
            </select>
          </div>
          <button type="submit" :disabled="submitting || uploading">
            {{ submitting ? $t('recruitment.form.submitting') : (uploading ? '上传中...' : $t('recruitment.form.submit')) }}
          </button>
        </form>
        <p v-if="submitSuccess" class="success-message">{{ $t('recruitment.form.apply_success') }}</p>
        <p v-if="submitError" class="error-message">{{ submitError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getJobDetails, applyForJob, uploadResume } from '@/services/recruitmentService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const job = ref(null);
const loading = ref(true);
const error = ref(false);
const submitting = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const submitSuccess = ref(false);
const submitError = ref('');
const resumeUrl = ref('');

const application = ref({
  jobId: null,
  applicantName: '',
  email: '',
  phone: '',
  resumeUrl: '',
  coverLetter: '',
  education: '',
  experience: '',
  source: 'website',
});

const fetchJobDetails = async () => {
  try {
    loading.value = true;
    const response = await getJobDetails(route.params.id);
    job.value = response;
    application.value.jobId = route.params.id;
  } catch (err) {
    console.error('Error fetching job details:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    submitError.value = '仅支持 PDF、DOC、DOCX 格式的文件';
    return;
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    submitError.value = '文件大小不能超过 10MB';
    return;
  }

  uploading.value = true;
  uploadProgress.value = 0;
  submitError.value = '';
  resumeUrl.value = '';

  try {
    const response = await uploadResume(file);
    resumeUrl.value = response;
    application.value.resumeUrl = response.data;
    uploadProgress.value = 100;
  } catch (err) {
    console.error('Error uploading resume:', err);
    submitError.value = '简历上传失败，请重试';
  } finally {
    uploading.value = false;
  }
};

const submitApplication = async () => {
  submitting.value = true;
  submitSuccess.value = false;
  submitError.value = '';

  try {
    const response = await applyForJob(application.value);
    submitSuccess.value = true;
    // Reset form
    application.value = {
      jobId: route.params.id,
      applicantName: '',
      email: '',
      phone: '',
      resumeUrl: '',
      coverLetter: '',
      education: '',
      experience: '',
      source: 'website',
    };
    resumeUrl.value = response;
    const fileInput = document.getElementById('resume');
    if (fileInput) fileInput.value = '';
  } catch (err) {
    console.error('Error submitting application:', err);
    submitError.value = err.response?.data?.msg || '提交申请失败，请重试';
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
  max-width: 900px;
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

.back-button:hover {
  color: #0056b3;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.job-meta {
  display: flex;
  gap: 1.5rem;
  color: #555;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.job-meta span {
  font-size: 0.95rem;
}

.job-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.job-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #007bff;
  font-size: 1.3rem;
}

.application-form h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.required {
  color: #dc3545;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="file"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.upload-progress,
.upload-success {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.upload-progress {
  color: #007bff;
}

.upload-success {
  color: #28a745;
  font-weight: 500;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

button[type="submit"]:disabled {
  background-color: #a0c4e4;
  cursor: not-allowed;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
}

.success-message, .error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  font-weight: 500;
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
