<template>
  <div class="admin-view">
    <h1>{{ t('admin_user.title') }}</h1>

    <div class="controls">
      <button class="add-button" @click="openModal()">{{ t('admin_user.add') }}</button>
      <button class="export-button" @click="handleExport">{{ t('admin_user.export') }}</button>
      <button class="import-button" @click="showImportModal = true">{{ t('admin_user.import') }}</button>
      <button 
        class="batch-delete-button" 
        @click="handleBatchDelete"
        :disabled="selectedUsers.length === 0"
      >
        {{ t('admin_user.batch_delete') }} ({{ selectedUsers.length }})
      </button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_user.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                @change="toggleSelectAll"
                :checked="isAllSelected"
              >
            </th>
            <th>{{ t('admin_user.table.username') }}</th>
            <th>{{ t('admin_user.table.email') }}</th>
            <th>{{ t('admin_user.table.role') }}</th>
            <th>{{ t('admin_user.table.status') }}</th>
            <th>{{ t('admin_user.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <input 
                type="checkbox" 
                v-model="selectedUsers"
                :value="user.id"
              >
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span :class="['status-badge', user.status === 1 ? 'active' : 'inactive']">
                {{ user.status === 1 ? t('admin_user.status_active') : t('admin_user.status_inactive') }}
              </span>
            </td>
            <td class="action-buttons">
              <button class="edit-btn" @click="openModal(user)">{{ t('admin_user.actions.edit') }}</button>
              <button class="password-btn" @click="openPasswordModal(user)">{{ t('admin_user.actions.change_password') }}</button>
              <button 
                :class="['status-btn', user.status === 1 ? 'disable-btn' : 'enable-btn']"
                @click="handleToggleStatus(user)"
              >
                {{ user.status === 1 ? t('admin_user.actions.disable') : t('admin_user.actions.enable') }}
              </button>
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
            <input 
              type="password" 
              v-model="currentUser.password" 
              :placeholder="currentUser.id ? t('admin_user.password_placeholder_edit') : ''"
              :required="!currentUser.id"
            >
          </div>
          <button type="submit" class="save-button">{{ t('admin_user.actions.save') }}</button>
        </form>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closePasswordModal">&times;</span>
        <h2>{{ t('admin_user.change_password_title') }}</h2>
        <form @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label>{{ t('admin_user.form.username') }}</label>
            <input :value="passwordUser.username" disabled>
          </div>
          <div class="form-group">
            <label>{{ t('admin_user.form.new_password') }}</label>
            <input type="password" v-model="newPassword" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_user.form.confirm_password') }}</label>
            <input type="password" v-model="confirmPassword" required>
          </div>
          <button type="submit" class="save-button">{{ t('admin_user.actions.save') }}</button>
        </form>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="modal" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <span class="close" @click="showImportModal = false">&times;</span>
        <h2>{{ t('admin_user.import_title') }}</h2>
        <div class="import-section">
          <button class="template-button" @click="handleDownloadTemplate">
            {{ t('admin_user.download_template') }}
          </button>
          <div class="form-group">
            <label>{{ t('admin_user.select_file') }}</label>
            <input type="file" @change="handleFileSelect" accept=".xlsx,.xls">
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="importUpdateSupport">
              {{ t('admin_user.update_support') }}
            </label>
          </div>
          <button 
            class="import-button" 
            @click="handleImport"
            :disabled="!importFile"
          >
            {{ t('admin_user.import') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  getUserPage, 
  createUser, 
  updateUser, 
  deleteUser,
  batchDeleteUsers,
  getUserDetail,
  updateUserPassword,
  updateUserStatus,
  exportUserExcel,
  getImportTemplate,
  importUsers
} from '../services/userAdminService';

const { t } = useI18n();

const users = ref([]);
const total = ref(0);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const currentUser = ref({});
const selectedUsers = ref([]);

const showPasswordModal = ref(false);
const passwordUser = ref({});
const newPassword = ref('');
const confirmPassword = ref('');

const showImportModal = ref(false);
const importFile = ref(null);
const importUpdateSupport = ref(false);

const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const totalPages = computed(() => Math.ceil(total.value / searchParams.pageSize));

const isAllSelected = computed(() => {
  return users.value.length > 0 && selectedUsers.value.length === users.value.length;
});

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
  } fina
