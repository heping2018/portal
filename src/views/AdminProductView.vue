<template>
  <div class="admin-view">
    <h1>{{ t('admin_product.title') }}</h1>
    
    <div class="controls">
        <button class="add-button" @click="openModal()">{{ t('admin_product.add') }}</button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_product.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>{{ t('admin_product.table.name') }}</th>
            <th>{{ t('admin_product.table.description') }}</th>
            <th>{{ t('admin_product.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.titleEn }}</td>
            <td>{{ truncate(product.descriptionEn) }}</td>
            <td class="action-buttons">
              <button class="edit-btn" @click="openModal(product)">{{ t('admin_product.actions.edit') }}</button>
              <button class="delete-btn" @click="removeProduct(product.id)">{{ t('admin_product.actions.delete') }}</button>
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
        <h2>{{ currentProduct.id ? t('admin_product.edit_title') : t('admin_product.add_title') }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>{{ t('admin_product.form.name_en') }}</label>
            <input v-model="currentProduct.titleEn" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_product.form.description_en') }}</label>
            <textarea v-model="currentProduct.descriptionEn" required rows="5"></textarea>
          </div>
           <div class="form-group">
            <label>{{ t('admin_product.form.name_zh') }}</label>
            <input v-model="currentProduct.titleZh">
          </div>
          <div class="form-group">
            <label>{{ t('admin_product.form.description_zh') }}</label>
            <textarea v-model="currentProduct.descriptionZh" rows="5"></textarea>
          </div>
          <button type="submit" class="save-button">{{ t('admin_product.actions.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getProductPage, createProduct, updateProduct, deleteProduct } from '../services/productAdminService';

const { t } = useI18n();

const products = ref([]);
const total = ref(0);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const currentProduct = ref({});

const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const totalPages = computed(() => Math.ceil(total.value / searchParams.pageSize));

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getProductPage(searchParams);
    products.value = response.list;
    total.value = response.total;
  } catch (err) {
    error.value = t('admin_product.fetch_error');
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (product = {}) => {
  currentProduct.value = { ...product };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentProduct.value = {};
};

const saveProduct = async () => {
  try {
    if (currentProduct.value.id) {
      await updateProduct(currentProduct.value);
    } else {
      await createProduct(currentProduct.value);
    }
    closeModal();
    fetchProducts();
  } catch (err) {
    error.value = t('admin_product.save_error');
    console.error('Failed to save product:', err);
  }
};

const removeProduct = async (id) => {
  if (!confirm(t('admin_product.confirm_delete'))) return;
  try {
    await deleteProduct(id);
    fetchProducts();
  } catch (err) {
    error.value = t('admin_product.delete_error');
    console.error('Failed to delete product:', err);
  }
};

const prevPage = () => {
    if (searchParams.pageNo > 1) {
        searchParams.pageNo--;
        fetchProducts();
    }
}

const nextPage = () => {
    if (searchParams.pageNo < totalPages.value) {
        searchParams.pageNo++;
        fetchProducts();
    }
}

const truncate = (text, length = 50) => {
  if (text && text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

onMounted(fetchProducts);
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
  max-width: 700px;
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

.form-group input, .form-group textarea {
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

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--glow-blue);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}
</style>
