<template>
  <div class="admin-view">
    <h1>{{ t('admin_recruitment_job.title') }}</h1>
    
    <div class="controls">
        <button class="add-button" @click="openModal()">{{ t('admin_recruitment_job.add') }}</button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_recruitment_job.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin_recruitment_job.table.code') }}</th>
            <th>{{ t('admin_recruitment_job.table.title') }}</th>
            <th>{{ t('admin_recruitment_job.table.department') }}</th>
            <th>{{ t('admin_recruitment_job.table.location') }}</th>
            <th>{{ t('admin_recruitment_job.table.type') }}</th>
            <th>{{ t('admin_recruitment_job.table.status') }}</th>
            <th>{{ t('admin_recruitment_job.table.headcount') }}</th>
            <th>{{ t('admin_recruitment_job.table.publish_date') }}</th>
            <th>{{ t('admin_recruitment_job.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>{{ job.code }}</td>
            <td>{{ getLocalizedField(job, "title") }}</td>
            <td>{{ getLocalizedField(job, "department") }}</td>
            <td>{{ getLocalizedField(job, "location") }}</td>
            <td>{{ getTypeLabel(job.type) }}</td>
            <td>
              <span class="status-badge" :class="job.status">{{ getStatusLabel(job.status) }}</span>
            </td>
            <td>{{ job.headcount }}</td>
            <td>{{ formatDate(job.publishDate) }}</td>
            <td class="action-buttons">
              <button class="view-btn" @click="viewJob(job.id)">{{ t('admin_recruitment_job.actions.view') }}</button>
              <button class="edit-btn" @click="openModal(job)">{{ t('admin_recruitment_job.actions.edit') }}</button>
              <button v-if="job.status === 'draft'" class="publish-btn" @click="publishJob(job.id)">{{ t('admin_recruitment_job.actions.publish') }}</button>
              <button v-if="job.status === 'open'" class="close-btn" @click="closeJob(job.id)">{{ t('admin_recruitment_job.actions.close') }}</button>
              <button class="delete-btn" @click="removeJob(job.id)">{{ t('admin_recruitment_job.actions.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ currentJob.id ? t('admin_recruitment_job.edit_title') : t('admin_recruitment_job.add_title') }}</h2>
        <form @submit.prevent="saveJob">
          <div class="form-section">
            <h3>{{ t('common.basic_info') }}</h3>
            <div class="form-group">
              <label>{{ t('admin_recruitment_job.form.code') }} <span class="required">*</span></label>
              <input v-model="currentJob.code" :disabled="!!currentJob.id" required>
            </div>
            <div class="form-group">
              <label>{{ t('admin_recruitment_job.form.type') }} <span class="required">*</span></label>
              <select v-model="currentJob.type" required>
                <option value="full-time">{{ t('job_type.full_time') }}</option>
                <option value="part-time">{{ t('job_type.part_time') }}</option>
                <option value="internship">{{ t('job_type.internship') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('admin_recruitment_job.form.salary') }}</label>
              <input v-model="currentJob.salaryRange">
            </div>
            <div class="form-group">
              <label>{{ t('admin_recruitment_job.form.headcount') }} <span class="required">*</span></label>
              <input type="number" v-model="currentJob.headcount" required min="1">
            </div>
            <div class="form-group">
              <label>{{ t('admin_recruitment_job.form.deadline') }}</label>
              <input type="date" v-model="currentJob.deadline">
            </div>
            <div class="form-group">
              <label>{{ t('admin_recruitment_job.form.sort_order') }}</label>
              <input type="number" v-model="currentJob.sortOrder" min="0">
            </div>
          </div>

          <div class="form-section">
            <h3>{{ t('common.job_title') }}</h3>
            <div class="form-group">
              <label>{{ t('language.zh') }} <span class="required">*</span></label>
              <input v-model="currentJob.titleZh" required>
            </div>
            <div class="form-group">
              <label>{{ t('language.en') }}</label>
              <input v-model="currentJob.titleEn">
            </div>
            <div class="form-group">
              <label>{{ t('language.pt') }}</label>
              <input v-model="currentJob.titlePt">
            </div>
            <div class="form-group">
              <label>{{ t('language.es') }}</label>
              <input v-model="currentJob.titleEs">
            </div>
          </div>

          <div class="form-section">
            <h3>{{ t('common.department') }}</h3>
            <div class="form-group">
              <label>{{ t('language.zh') }}</label>
              <input v-model="currentJob.departmentZh">
            </div>
            <div class="form-group">
              <label>{{ t('language.en') }}</label>
              <input v-model="currentJob.departmentEn">
            </div>
            <div class="form-group">
              <label>{{ t('language.pt') }}</label>
              <input v-model="currentJob.departmentPt">
            </div>
            <div class="form-group">
              <label>{{ t('language.es') }}</label>
              <input v-model="currentJob.departmentEs">
            </div>
          </div>

          <div class="form-section">
            <h3>{{ t('common.location') }}</h3>
            <div class="form-group">
              <label>{{ t('language.zh') }}</label>
              <input v-model="currentJob.locationZh">
            </div>
            <div class="form-group">
              <label>{{ t('language.en') }}</label>
              <input v-model="currentJob.locationEn">
            </div>
            <div class="form-group">
              <label>{{ t('language.pt') }}</label>
              <input v-model="currentJob.locationPt">
            </div>
            <div class="form-group">
              <label>{{ t('language.es') }}</label>
              <input v-model="currentJob.locationEs">
            </div>
          </div>

          <div class="form-section">
            <h3>{{ t('admin_recruitment_job.form.responsibility') }}</h3>
            <div class="form-group">
              <label>{{ t('language.zh') }} <span class="required">*</span></label>
              <textarea v-model="currentJob.responsibilityZh" required rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('language.en') }}</label>
              <textarea v-model="currentJob.responsibilityEn" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('language.pt') }}</label>
              <textarea v-model="currentJob.responsibilityPt" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('language.es') }}</label>
              <textarea v-model="currentJob.responsibilityEs" rows="5"></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3>{{ t('admin_recruitment_job.form.requirement') }}</h3>
            <div class="form-group">
              <label>{{ t('language.zh') }} <span class="required">*</span></label>
              <textarea v-model="currentJob.requirementZh" required rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('language.en') }}</label>
              <textarea v-model="currentJob.requirementEn" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('language.pt') }}</label>
              <textarea v-model="currentJob.requirementPt" rows="5"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('language.es') }}</label>
              <textarea v-model="currentJob.requirementEs" rows="5"></textarea>
            </div>
          </div>

          <button type="submit" class="save-button">{{ t('admin_recruitment_job.actions.save') }}</button>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal" @click="closeDetailModal">
      <div class="modal-content detail-content" @click.stop>
        <span class="close" @click="closeDetailModal">&times;</span>
        <h2>{{ t('admin_recruitment_job.actions.view') }}</h2>
        <div v-if="jobDetail" class="detail-info">
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.table.code') }}:</label>
            <span>{{ jobDetail.code }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.table.title') }}:</label>
            <span>{{ getLocalizedField(jobDetail, "title") }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('common.department') }}:</label>
            <span>{{ getLocalizedField(jobDetail, "department") }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('common.location') }}:</label>
            <span>{{ getLocalizedField(jobDetail, "location") }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.form.type') }}:</label>
            <span>{{ getTypeLabel(jobDetail.type) }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.form.salary') }}:</label>
            <span>{{ jobDetail.salaryRange }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.form.headcount') }}:</label>
            <span>{{ jobDetail.headcount }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.table.status') }}:</label>
            <span class="status-badge" :class="jobDetail.status">{{ getStatusLabel(jobDetail.status) }}</span>
          </div>
          <div class="detail-row">
            <label>{{ t('admin_recruitment_job.table.publish_date') }}:</label>
            <span>{{ formatDate(jobDetail.publishDate) }}</span>
          </div>
          <div class="detail-row" v-if="jobDetail.deadline">
            <label>{{ t('admin_recruitment_job.form.deadline') }}:</label>
            <span>{{ formatDate(jobDetail.deadline) }}</span>
          </div>
          <div class="detail-section">
            <h4>{{ t('admin_recruitment_job.form.responsibility') }}</h4>
            <div class="detail-text" v-html="getLocalizedField(jobDetail, 'responsibility')"></div>
          </div>
          <div class="detail-section">
            <h4>{{ t('admin_recruitment_job.form.requirement') }}</h4>
            <div class="detail-text" v-html="getLocalizedField(jobDetail, 'requirement')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  createJob,
  updateJob,
  deleteJob,
  publishJob as publishJobApi,
  closeJob as closeJobApi,
  getJobDetail,
  getJobList
} from '../../services/recruitmentAdminService';

const { t, locale } = useI18n();

const jobs = ref([]);
const jobDetail = ref(null);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showDetailModal = ref(false);
const currentJob = ref({});

const defaultJob = {
  code: '',
  titleZh: '',
  titleEn: '',
  titlePt: '',
  titleEs: '',
  departmentZh: '',
  departmentEn: '',
  departmentPt: '',
  departmentEs: '',
  locationZh: '',
  locationEn: '',
  locationPt: '',
  locationEs: '',
  type: 'full-time',
  salaryRange: '',
  headcount: 1,
  deadline: '',
  sortOrder: 0,
  responsibilityZh: '',
  responsibilityEn: '',
  responsibilityPt: '',
  responsibilityEs: '',
  requirementZh: '',
  requirementEn: '',
  requirementPt: '',
  requirementEs: '',
};

const fetchJobs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getJobList();
    jobs.value = response.data || response;
  } catch (err) {
    error.value = t('admin_recruitment_job.fetch_error');
    console.error('Failed to fetch jobs:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (job = null) => {
  if (job) {
    currentJob.value = { ...job };
  } else {
    currentJob.value = { ...defaultJob };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentJob.value = { ...defaultJob };
};

const saveJob = async () => {
  try {
    if (currentJob.value.id) {
      await updateJob(currentJob.value);
    } else {
      await createJob(currentJob.value);
    }
    closeModal();
    fetchJobs();
  } catch (err) {
    error.value = t('admin_recruitment_job.save_error');
    console.error('Failed to save job:', err);
  }
};

const removeJob = async (id) => {
  if (!confirm(t('admin_recruitment_job.confirm_delete'))) return;
  try {
    await deleteJob(id);
    fetchJobs();
  } catch (err) {
    error.value = t('admin_recruitment_job.delete_error');
    console.error('Failed to delete job:', err);
  }
};

const publishJob = async (id) => {
  if (!confirm(t('admin_recruitment_job.confirm_publish'))) return;
  try {
    await publishJobApi(id);
    fetchJobs();
  } catch (err) {
    error.value = t('admin_recruitment_job.publish_error');
    console.error('Failed to publish job:', err);
  }
};

const closeJob = async (id) => {
  if (!confirm(t('admin_recruitment_job.confirm_close'))) return;
  try {
    await closeJobApi(id);
    fetchJobs();
  } catch (err) {
    error.value = t('admin_recruitment_job.close_error');
    console.error('Failed to close job:', err);
  }
};

const viewJob = async (id) => {
  try {
    const response = await getJobDetail(id);
    jobDetail.value = response.data;
    showDetailModal.value = true;
  } catch (err) {
    error.value = t('admin_recruitment_job.fetch_error');
    console.error('Failed to fetch job detail:', err);
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  jobDetail.value = null;
};

const getLocalizedField = (obj, field) => {
  const langMap = {
    'zh': 'Zh',
    'en': 'En',
    'pt': 'Pt',
    'es': 'Es'
  };
  const suffix = langMap[locale.value] || 'Zh';
  const localizedField = field + suffix;
  return obj[localizedField] || obj[field + 'Zh'] || '';
};

const getTypeLabel = (type) => {
  const labels = {
    'full-time': t('job_type.full_time'),
    'part-time': t('job_type.part_time'),
    'internship': t('job_type.internship')
  };
  return labels[type] || type;
};

const getStatusLabel = (status) => {
  const labels = {
    'draft': t('admin_recruitment_job.status.draft'),
    'open': t('admin_recruitment_job.status.open'),
    'closed': t('admin_recruitment_job.status.closed')
  };
  return labels[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
:root {
  --glow-blue: #00BFFF;
  --border-blue: rgba(0, 150, 255, 0.2);
  --text-primary: #E0EFFF;
  --text-secondary: #B0C4DE;
  --bg-dark-transparent: rgba(13, 21, 42, 0.7);
}

.admin-view {
  color: var(--text-primary);
}

h1 {
  color: var(--glow-blue);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 2rem;
}

.controls {
  margin-bottom: 2rem;
  text-align: right;
}

.add-button, .save-button {
  border: 1px solid var(--border-blue);
  background: var(--bg-dark-transparent);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 8px;
  transition: box-shadow 0.3s, color 0.3s, transform 0.3s;
  font-weight: bold;
}

.add-button:hover, .save-button:hover {
  color: var(--glow-blue);
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
  transform: translateY(-2px);
}

.loading-indicator,
.error-indicator {
  text-align: center;
  font-size: 1.2rem;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.error-indicator {
  color: #ff6b6b;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 2rem;
  border: 1px solid var(--border-blue);
  border-radius: 8px;
  background-color: var(--bg-dark-transparent);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-blue);
}

th {
  color: var(--glow-blue);
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color 0.3s;
}

tbody tr:hover {
  background-color: rgba(0, 191, 255, 0.05);
}

td.action-buttons {
  white-space: nowrap;
}

.action-buttons button {
  border: 1px solid var(--border-blue);
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s;
  margin-right: 6px;
  margin-bottom: 6px;
}

.action-buttons button:hover {
  color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.4);
  border-color: var(--glow-blue);
}

.view-btn {
  background: rgba(23, 162, 184, 0.1);
}

.view-btn:hover {
  color: #17a2b8;
  border-color: #17a2b8;
}

.edit-btn {
  background: rgba(255, 193, 7, 0.1);
}

.edit-btn:hover {
  color: #ffc107;
  border-color: #ffc107;
}

.publish-btn {
  background: rgba(40, 167, 69, 0.1);
}

.publish-btn:hover {
  color: #28a745;
  border-color: #28a745;
}

.close-btn {
  background: rgba(253, 126, 20, 0.1);
}

.close-btn:hover {
  color: #fd7e14;
  border-color: #fd7e14;
}

.delete-btn {
  background: rgba(220, 53, 69, 0.1);
}

.delete-btn:hover {
  color: #dc3545;
  border-color: #dc3545;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.draft {
  background: rgba(226, 227, 229, 0.2);
  color: #e2e3e5;
}

.status-badge.open {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.status-badge.closed {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

/* Modal */
.modal {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  background-color: var(--bg-dark-transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid var(--border-blue);
  box-shadow: 0 0 25px rgba(0, 191, 255, 0.2);
}

.detail-content {
  max-width: 600px;
}

.close {
  color: var(--text-secondary);
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

.close:hover, .close:focus {
  color: var(--glow-blue);
}

.modal-content h2 {
  text-align: center;
  color: var(--glow-blue);
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-blue);
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: var(--glow-blue);
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.required {
  color: #ff6b6b;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  background-color: rgba(13, 21, 42, 0.8);
  border: 1px solid var(--border-blue);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.detail-info {
  padding: 1rem 0;
}

.detail-row {
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-blue);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 600;
  width: 140px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.detail-row span {
  flex: 1;
  color: var(--text-primary);
}

.detail-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.detail-section h4 {
  color: var(--glow-blue);
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.detail-text {
  background: rgba(13, 21, 42, 0.5);
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.8;
  color: var(--text-primary);
}
</style>
