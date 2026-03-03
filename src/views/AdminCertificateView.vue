<template>
  <div class="admin-view">
    <h1>{{ t('admin_certificate.title') }}</h1>

    <div class="controls">
      <button class="add-button" @click="openModal()">{{ t('admin_certificate.add') }}</button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_certificate.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin_certificate.table.name') }}</th>
            <th>{{ t('admin_certificate.table.issuing_org') }}</th>
            <th>{{ t('admin_certificate.table.issue_date') }}</th>
            <th>{{ t('admin_certificate.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="certificate in certificates" :key="certificate.id">
            <td>{{ certificate.nameEn }}</td>
            <td>{{ certificate.issuingAuthority }}</td>
            <td>{{ formatDate(certificate.issueDate) }}</td>
            <td class="action-buttons">
              <button class="edit-btn" @click="openModal(certificate)">{{ t('admin_certificate.actions.edit') }}</button>
              <!-- <button class="delete-btn" @click="removeCertificate(certificate.id)">{{ t('admin_certificate.actions.delete') }}</button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ currentCertificate.id ? t('admin_certificate.edit_title') : t('admin_certificate.add_title') }}</h2>
        <form @submit.prevent="saveCertificate">
          <div class="form-group">
            <label>{{ t('admin_certificate.form.name_en') }}</label>
            <input v-model="currentCertificate.nameEn" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_certificate.form.name_zh') }}</label>
            <input v-model="currentCertificate.nameZh">
          </div>
           <div class="form-group">
            <label>{{ t('admin_certificate.form.issuing_org') }}</label>
            <input v-model="currentCertificate.issuingAuthority">
          </div>
           <div class="form-group">
            <label>{{ t('admin_certificate.form.issue_date') }}</label>
            <input type="date" v-model="currentCertificate.issueDate">
          </div>
          <button type="submit" class="save-button">{{ t('admin_certificate.actions.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCertificatePage, createCertificate, updateCertificate } from '../services/certificateAdminService';

const { t } = useI18n();

const certificates = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const currentCertificate = ref({});

const fetchCertificates = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getCertificatePage();
    certificates.value = response.list;
  } catch (err) {
    error.value = t('admin_certificate.fetch_error');
    console.error('Failed to fetch certificates:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (certificate = {}) => {
    if (certificate.id) {
        const date = new Date(certificate.issueDate);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        currentCertificate.value = { ...certificate, issueDate: `${year}-${month}-${day}` };
    } else {
        currentCertificate.value = {};
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    currentCertificate.value = {};
};

const saveCertificate = async () => {
  try {
    const dataToSend = { ...currentCertificate.value };
    dataToSend.issueDate = new Date(dataToSend.issueDate).toISOString();

    if (dataToSend.id) {
      await updateCertificate(dataToSend);
    } else {
      await createCertificate(dataToSend);
    }
    closeModal();
    fetchCertificates();
  } catch (err) {
    error.value = t('admin_certificate.save_error');
    console.error('Failed to save certificate:', err);
  }
};

/*
const removeCertificate = async (id) => {
  if (!confirm(t('admin_certificate.confirm_delete'))) return;
  try {
    await deleteCertificate(id);
    fetchCertificates();
  } catch (err) {
    error.value = t('admin_certificate.delete_error');
    console.error('Failed to delete certificate:', err);
  }
};
*/

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

onMounted(fetchCertificates);
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

.loading-indicator, .error-indicator {
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

thead th {
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
}

.action-buttons button:hover {
  color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.4);
  border-color: var(--glow-blue);
}

.edit-btn {
  margin-right: 8px;
}

.delete-btn:hover {
    color: #ff6b6b;
    border-color: #ff6b6b;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.4);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.pagination button {
  border: 1px solid var(--border-blue);
  background: transparent;
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: rgba(0, 191, 255, 0.1);
  color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal { 
  position: fixed; 
  z-index: 100; 
  left: 0; top: 0; 
  width: 100%; height: 100%; 
  overflow: auto; 
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 90%;
  max-width: 600px;
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
  margin-bottom: .5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 10px;
  background-color: rgba(13, 21, 42, 0.8);
  border: 1px solid var(--border-blue);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.form-group input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.8) brightness(1.2) sepia(0.5) hue-rotate(180deg);
}
</style>
