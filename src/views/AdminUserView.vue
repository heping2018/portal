<template>
  <div class="admin-view">
    <h1>{{ t('admin_user.title') }}</h1>

    <div class="controls">
      <button class="add-button" @click="openModal()">{{ t('admin_user.add') }}</button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_user.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin_user.table.username') }}</th>
            <th>{{ t('admin_user.table.email') }}</th>
            <th>{{ t('admin_user.table.role') }}</th>
            <th>{{ t('admin_user.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td class="action-buttons">
              <button class="edit-btn" @click="openModal(user)">{{ t('admin_user.actions.edit') }}</button>
              <button class="delete-btn" @click="removeUser(user.id)">{{ t('admin_user.actions.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="!loading && !error && totalPages > 1">
      <button @click="prevPage" :disabled="searchParams.pageNo === 1">{{ t('pagination.previous') }}</button>
      <span>{{ t('pagination.page', { currentPage: searchParams.pageNo, totalPages: totalPages }) }}</span>
      <button @click="nextPage" :disabled="searchParams.pageNo >= totalPages">{{ t('pagination.next') }}</button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ currentUser.id ? t('admin_user.edit_title') : t('admin_user.add_title') }}</h2>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>{{ t('admin_user.form.username') }}</label>
            <input v-model="currentUser.username" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_user.form.email') }}</label>
            <input type="email" v-model="currentUser.email" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_user.form.role') }}</label>
            <input v-model="currentUser.role">
          </div>
          <div class="form-group">
            <label>{{ t('admin_user.form.password') }}</label>
            <input type="password" v-model="currentUser.password" :placeholder="currentUser.id ? 'Leave blank to keep current password' : ''" :required="!currentUser.id">
          </div>
          <button type="submit" class="save-button">{{ t('admin_user.actions.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getUserPage, createUser, updateUser, deleteUser } from '../services/userAdminService';

const { t } = useI18n();

const users = ref([]);
const total = ref(0);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const currentUser = ref({});

const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const totalPages = computed(() => Math.ceil(total.value / searchParams.pageSize));

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getUserPage(searchParams);
    users.value = response.list;
    total.value = response.total;
  } catch (err) {
    error.value = t('admin_user.fetch_error');
    console.error('Failed to fetch users:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (user = {}) => {
  currentUser.value = { ...user };
  // Clear password for security when editing
  if (currentUser.value.id) {
    currentUser.value.password = '';
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentUser.value = {};
}

const saveUser = async () => {
  try {
    const userData = { ...currentUser.value };
    // Do not send the password if it is empty during an update
    if (userData.id && !userData.password) {
      delete userData.password;
    }

    if (userData.id) {
      await updateUser(userData);
    } else {
      await createUser(userData);
    }
    closeModal();
    fetchUsers(); // Refresh list
  } catch (err) {
    error.value = t('admin_user.save_error');
    console.error('Failed to save user:', err);
  }
};

const removeUser = async (id) => {
  if (!confirm(t('admin_user.confirm_delete'))) return;
  try {
    await deleteUser(id);
    fetchUsers(); // Refresh list
  } catch (err) {
    error.value = t('admin_user.delete_error');
    console.error('Failed to delete user:', err);
  }
};

const prevPage = () => {
  if (searchParams.pageNo > 1) {
    searchParams.pageNo--;
    fetchUsers();
  }
}

const nextPage = () => {
  if (searchParams.pageNo < totalPages.value) {
    searchParams.pageNo++;
    fetchUsers();
  }
}

onMounted(fetchUsers);
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
  max-width: 500px;
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
</style>
