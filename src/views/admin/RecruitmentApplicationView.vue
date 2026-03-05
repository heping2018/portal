<template>
  <div class="admin-view">
    <h1>{{ t('admin_recruitment_application.title') }}</h1>
    
    <div class="controls">
      <button class="export-button" @click="exportData" :disabled="exporting">
        {{ exporting ? t('admin_recruitment_application.exporting') : t('admin_recruitment_application.actions.export') }}
      </button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_recruitment_application.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="filter-section" v-if="!loading && !error">
      <div class="filter-item">
        <label>{{ t('admin_recruitment_application.status_filter') }}:</label>
        <select v-model="filterStatus" @change="fetchApplications">
          <option value="">{{ t('common.all') }}</option>
          <option value="pending">{{ t('admin_recruitment_application.status.pending') }}</option>
          <option value="reviewing">{{ t('admin_recruitment_application.status.reviewing') }}</option>
          <option value="interviewed">{{ t('admin_recruitment_application.status.interviewed') }}</option>
          <option value="rejected">{{ t('admin_recruitment_application.status.rejected') }}</option>
          <option value="hired">{{ t('admin_recruitment_application.status.hired') }}</option>
        </select>
      </div>
    </div>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin_recruitment_application.table.id') }}</th>
            <th>{{ t('admin_recruitment_application.table.job') }}</th>
            <th>{{ t('admin_recruitment_application.table.applicant') }}</th>
            <th>{{ t('admin_recruitment_application.table.email') }}</th>
            <th>{{ t('admin_recruitment_application.table.phone') }}</th>
            <th>{{ t('admin_recruitment_application.table.source') }}</th>
            <th>{{ t('admin_recruitment_application.table.status') }}</th>
            <th>{{ t('admin_recruitment_application.table.apply_date') }}</th>
            <th>{{ t('admin_recruitment_application.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filteredApplications" :key="app.id">
            <td>{{ app.id }}</td>
            <td>{{ app.jobTitle }}</td>
            <td>{{ app.applicantName }}</td>
            <td>{{ app.email }}</td>
            <td>{{ app.phone }}</td>
            <td>{{ getSourceLabel(app.source) }}</td>
            <td>
              <span class="status-badge" :class="app.status">{{ getStatusLabel(app.status) }}</span>
            </td>
            <td>{{ formatDate(app.applyDate) }}</td>
            <td class="action-buttons">
              <button class="view-btn" @click="viewApplication(app.id)">{{ t('admin_recruitment_application.actions.view') }}</button>
              <button class="status-btn" @click="openStatusModal(app)">{{ t('admin_recruitment_application.actions.status') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal" @click="closeDetailModal">
      <div class="modal-content detail-content" @click.stop>
        <span class="close" @click="closeDetailModal">&times;</span>
        <h2>{{ t('admin_recruitment_application.modal.detail') }}</h2>
        <div v-if="applicationDetail" class="detail-info">
          <div class="detail-section">
            <h4>{{ t('admin_recruitment_application.modal.basic_info') }}</h4>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.id') }}:</label>
              <span>{{ applicationDetail.id }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.job') }}:</label>
              <span>{{ applicationDetail.jobTitle }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.applicant') }}:</label>
              <span>{{ applicationDetail.applicantName }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.email') }}:</label>
              <span>{{ applicationDetail.email }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.phone') }}:</label>
              <span>{{ applicationDetail.phone }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.source') }}:</label>
              <span>{{ getSourceLabel(applicationDetail.source) }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.status') }}:</label>
              <span class="status-badge" :class="applicationDetail.status">{{ getStatusLabel(applicationDetail.status) }}</span>
            </div>
            <div class="detail-row">
              <label>{{ t('admin_recruitment_application.table.apply_date') }}:</label>
              <span>{{ formatDate(applicationDetail.applyDate) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>{{ t('admin_recruitment_application.modal.resume') }}</h4>
            <div v-if="applicationDetail.resumeUrl" class="resume-link">
              <a :href="applicationDetail.resumeUrl" target="_blank" class="resume-btn">
                <span>{{ t('admin_recruitment_application.modal.view_resume') }}</span>
              </a>
            </div>
            <div v-else class="no-resume">{{ t('admin_recruitment_application.modal.no_resume') }}</div>
          </div>

          <div class="detail-section" v-if="applicationDetail.coverLetter">
            <h4>{{ t('admin_recruitment_application.modal.cover_letter') }}</h4>
            <div class="detail-text">{{ applicationDetail.coverLetter }}</div>
          </div>

          <div class="detail-section" v-if="applicationDetail.education">
            <h4>{{ t('admin_recruitment_application.modal.education') }}</h4>
            <div class="detail-text">{{ applicationDetail.education }}</div>
          </div>

          <div class="detail-section" v-if="applicationDetail.experience">
            <h4>{{ t('admin_recruitment_application.modal.experience') }}</h4>
            <div class="detail-text">{{ applicationDetail.experience }}</div>
          </div>

          <div class="detail-section">
            <h4>{{ t('admin_recruitment_application.modal.hr_note') }}</h4>
            <div v-if="isEditingNote">
              <textarea v-model="editNote" rows="4" class="note-textarea"></textarea>
              <div class="note-actions">
                <button class="save-note-btn" @click="saveNote">{{ t('common.save') }}</button>
                <button class="cancel-note-btn" @click="cancelEditNote">{{ t('common.cancel') }}</button>
              </div>
            </div>
            <div v-else>
              <div class="detail-text note-text">{{ applicationDetail.note || t('admin_recruitment_application.no_note') }}</div>
              <button class="edit-note-btn" @click="startEditNote">{{ t('admin_recruitment_application.modal.edit_note') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="showStatusModal" class="modal" @click="closeStatusModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeStatusModal">&times;</span>
        <h2>{{ t('admin_recruitment_application.modal.update_status') }}</h2>
        <form @submit.prevent="updateStatus">
          <div class="form-group">
            <label>{{ t('admin_recruitment_application.modal.new_status') }} <span class="required">*</span></label>
            <select v-model="statusForm.status" required>
              <option value="pending">{{ t('admin_recruitment_application.status.pending') }}</option>
              <option value="reviewing">{{ t('admin_recruitment_application.status.reviewing') }}</option>
              <option value="interviewed">{{ t('admin_recruitment_application.status.interviewed') }}</option>
              <option value="rejected">{{ t('admin_recruitment_application.status.rejected') }}</option>
              <option value="hired">{{ t('admin_recruitment_application.status.hired') }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('admin_recruitment_application.modal.note') }}</label>
            <textarea v-model="statusForm.note" rows="4"></textarea>
          </div>
          <button type="submit" class="save-button">{{ t('common.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getApplicationList,
  getApplicationDetail,
  updateApplicationStatus,
  exportApplications
} from '../../services/recruitmentAdminService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const applications = ref([]);
const applicationDetail = ref(null);
const loading = ref(true);
const error = ref(null);
const exporting = ref(false);
const filterStatus = ref('');
const showDetailModal = ref(false);
const showStatusModal = ref(false);
const isEditingNote = ref(false);
const editNote = ref('');
const statusForm = ref({
  id: null,
  status: '',
  note: ''
});

const filteredApplications = computed(() => {
  if (!filterStatus.value) {
    return applications.value;
  }
  return applications.value.filter(app => app.status === filterStatus.value);
});

const fetchApplications = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getApplicationList();
    applications.value = response;
  } catch (err) {
    error.value = t('admin_recruitment_application.fetch_error');
    console.error('Failed to fetch applications:', err);
  } finally {
    loading.value = false;
  }
};

const viewApplication = async (id) => {
  try {
    const response = await getApplicationDetail(id);
    applicationDetail.value = response;
    showDetailModal.value = true;
    isEditingNote.value = false;
  } catch (err) {
    error.value = t('admin_recruitment_application.fetch_error');
    console.error('Failed to fetch application detail:', err);
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  applicationDetail.value = null;
  isEditingNote.value = false;
  editNote.value = '';
};

const openStatusModal = (app) => {
  statusForm.value = {
    id: app.id,
    status: app.status,
    note: app.note
  };
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  statusForm.value = {
    id: null,
    status: '',
    note: ''
  };
};

const updateStatus = async () => {
  try {
    await updateApplicationStatus(statusForm.value);
    closeStatusModal();
    fetchApplications();
    if (applicationDetail.value && applicationDetail.value.id === statusForm.value.id) {
      await getApplicationDetail(applicationDetail.value.id);
    }
  } catch (err) {
    error.value = t('admin_recruitment_application.save_error');
    console.error('Failed to update status:', err);
  }
};

const startEditNote = () => {
  editNote.value = applicationDetail.value.note || '';
  isEditingNote.value = true;
};

const cancelEditNote = () => {
  editNote.value = '';
  isEditingNote.value = false;
};

const saveNote = async () => {
  try {
    await updateApplicationStatus({
      id: applicationDetail.value.id,
      status: applicationDetail.value.status,
      note: editNote.value
    });
    applicationDetail.value.note = editNote.value;
    isEditingNote.value = false;
    fetchApplications();
  } catch (err) {
    error.value = t('admin_recruitment_application.save_error');
    console.error('Failed to save note:', err);
  }
};

const exportData = async () => {
  exporting.value = true;
  try {
    const response = await exportApplications();
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recruit_applications_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    error.value = t('admin_recruitment_application.export_error');
    console.error('Failed to export applications:', err);
  } finally {
    exporting.value = false;
  }
};

const getSourceLabel = (source) => {
  const labels = {
    'website': t('admin_recruitment_application.source.website'),
    'referral': t('admin_recruitment_application.source.referral'),
    'other': t('admin_recruitment_application.source.other')
  };
  return labels[source] || source;
};

const getStatusLabel = (status) => {
  const labels = {
    'pending': t('admin_recruitment_application.status.pending'),
    'reviewing': t('admin_recruitment_application.status.reviewing'),
    'interviewed': t('admin_recruitment_application.status.interviewed'),
    'rejected': t('admin_recruitment_application.status.rejected'),
    'hired': t('admin_recruitment_application.status.hired')
  };
  return labels[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN');
};

onMounted(() => {
  fetchApplications();
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

.export-button, .save-button {
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

.export-button:hover:not(:disabled), .save-button:hover {
  color: var(--glow-blue);
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
  transform: translateY(-2px);
}

.export-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.filter-section {
  background: var(--bg-dark-transparent);
  padding: 1rem 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-blue);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-item label {
  font-weight: 600;
  color: var(--text-secondary);
}

.filter-item select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-blue);
  border-radius: 4px;
  font-size: 1rem;
  background: rgba(13, 21, 42, 0.8);
  color: var(--text-primary);
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

.status-btn {
  background: rgba(255, 193, 7, 0.1);
}

.status-btn:hover {
  color: #ffc107;
  border-color: #ffc107;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(226, 227, 229, 0.2);
  color: #e2e3e5;
}

.status-badge.reviewing {
  background: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
}

.status-badge.interviewed {
  background: rgba(23, 78, 216, 0.2);
  color: #174edc;
}

.status-badge.rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.status-badge.hired {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
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
  max-width: 700px;
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

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.detail-info {
  padding: 1rem 0;
}

.detail-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-blue);
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h4 {
  color: var(--glow-blue);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.detail-row {
  display: flex;
  margin-bottom: 0.75rem;
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

.detail-text {
  background: rgba(13, 21, 42, 0.5);
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.8;
  color: var(--text-primary);
}

.note-text {
  min-height: 80px;
}

.resume-link {
  text-align: center;
}

.resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 191, 255, 0.1);
  color: var(--glow-blue);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
  border: 1px solid var(--border-blue);
}

.resume-btn:hover {
  background: rgba(0, 191, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.4);
}

.no-resume {
  text-align: center;
  color: var(--text-secondary);
  padding: 1rem;
}

.note-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-note-btn,
.cancel-note-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-blue);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  background: var(--bg-dark-transparent);
  color: var(--text-secondary);
}

.save-note-btn:hover {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border-color: #28a745;
}

.cancel-note-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border-color: #dc3545;
}

.note-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-blue);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  background-color: rgba(13, 21, 42, 0.8);
  color: var(--text-primary);
}

.note-textarea:focus {
  outline: none;
  border-color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.edit-note-btn {
  background: rgba(0, 191, 255, 0.1);
  color: var(--glow-blue);
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-blue);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.edit-note-btn:hover {
  background: rgba(0, 191, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.4);
}
</style>
