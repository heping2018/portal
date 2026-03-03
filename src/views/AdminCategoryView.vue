<template>
  <div class="admin-view">
    <h1>{{ t('admin_category.title') }}</h1>
    <div class="controls">
      <button class="add-button" @click="openModal()">{{ t('admin_category.add') }}</button>
    </div>
    <div v-if="loading" class="loading-indicator">{{ t('admin_category.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>
    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin_category.table.name') }}</th>
            <th>{{ t('admin_category.table.type') }}</th>
            <th>{{ t('admin_category.table.sort') }}</th>
            <th>{{ t('admin_category.table.status') }}</th>
            <th>{{ t('admin_category.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>{{ category.type }}</td>
            <td>{{ category.sort }}</td>
            <td>
              <span :class="['status-badge', category.status === 1 ? 'active' : 'inactive']">
                {{ category.status === 1 ? t('admin_category.status_active') : t('admin_category.status_inactive') }}
              </span>
            </td>
            <td class="action-buttons">
              <button class="edit-btn" @click="openModal(category)">{{ t('admin_category.actions.edit') }}</button>
              <button class="delete-btn" @click="removeCategory(category.id)">{{ t('admin_category.actions.delete') }}</button>
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
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ currentCategory.id ? t('admin_category.edit_title') : t('admin_category.add_title') }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>{{ t('admin_category.form.name') }}</label>
            <input v-model="currentCategory.name" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_category.form.type') }}</label>
            <input v-model="currentCategory.type" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_category.form.sort') }}</label>
            <input type="number" v-model="currentCategory.sort">
          </div>
          <button type="submit" class="save-button">{{ t('admin_category.actions.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCategoryPage, createCategory, updateCategory, deleteCategory, getCategoryDetail } from '../services/categoryService';

const { t } = useI18n();

const categories = ref([]);
const total = ref(0);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const currentCategory = ref({});

const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const totalPages = computed(() => Math.ceil(total.value / searchParams.pageSize));

const fetchCategories = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getCategoryPage(searchParams);
    categories.value = response.list;
    total.value = response.total;
  } catch (err) {
    error.value = t('admin_category.fetch_error');
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);

const openModal = async (category = null) => {
  if (category) {
    const categoryDetail = await getCategoryDetail(category.id);
    currentCategory.value = { ...categoryDetail };
  } else {
    currentCategory.value = { name: '', type: '', sort: 0 };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentCategory.value = {};
};

const saveCategory = async () => {
  try {
    if (currentCategory.value.id) {
      await updateCategory(currentCategory.value);
    } else {
      await createCategory(currentCategory.value);
    }
    fetchCategories();
    closeModal();
  } catch (err) {
    console.error('Failed to save category:', err);
  }
};

const removeCategory = async (id) => {
  if (confirm(t('admin_category.confirm_delete'))) {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  }
};

const prevPage = () => {
  if (searchParams.pageNo > 1) {
    searchParams.pageNo--;
    fetchCategories();
  }
};

const nextPage = () => {
  if (searchParams.pageNo < totalPages.value) {
    searchParams.pageNo++;
    fetchCategories();
  }
};
</script>

<style scoped>
@import '../assets/admin-view.css';

.edit-btn { background: linear-gradient(45deg, #3b82f6, #60a5fa); }
.delete-btn { background: linear-gradient(45deg, #ef4444, #f87171); }

.action-buttons button:hover {
  filter: brightness(1.2);
}

.save-button {
    width: 100%;
    padding: 0.8rem 1rem;
    background: linear-gradient(45deg, #007BFF, #00C4FF);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.save-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 150, 255, 0.3);
}
</style>
