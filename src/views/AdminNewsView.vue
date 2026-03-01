<template>
  <div class="admin-view">
    <h1>{{ t('admin_news.title') }}</h1>
    
    <div class="controls">
        <button class="add-button" @click="openModal()">{{ t('admin_news.add') }}</button>
    </div>

    <div v-if="loading" class="loading-indicator">{{ t('admin_news.loading') }}</div>
    <div v-if="error" class="error-indicator">{{ error }}</div>

    <div class="table-container" v-if="!loading && !error">
        <table>
        <thead>
            <tr>
            <th>{{ t('admin_news.table.title') }}</th>
            <th>{{ t('admin_news.table.author') }}</th>
            <th>{{ t('admin_news.table.publish_date') }}</th>
            <th>{{ t('admin_news.table.actions') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="news_item in news" :key="news_item.id">
            <td>{{ news_item.titleEn }}</td>
            <td>{{ news_item.author }}</td>
            <td>{{ formatDate(news_item.publishDate) }}</td>
            <td class="action-buttons">
                <button class="edit-btn" @click="openModal(news_item)">{{ t('admin_news.actions.edit') }}</button>
                <button class="delete-btn" @click="removeNews(news_item.id)">{{ t('admin_news.actions.delete') }}</button>
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
        <h2>{{ currentNews.id ? t('admin_news.edit_title') : t('admin_news.add_title') }}</h2>
        <form @submit.prevent="saveNews">
          <div class="form-group">
            <label>{{ t('admin_news.form.title_en') }}</label>
            <input v-model="currentNews.titleEn" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_news.form.content_en') }}</label>
            <textarea v-model="currentNews.contentEn" required rows="5"></textarea>
          </div>
          <div class="form-group">
            <label>{{ t('admin_news.form.title_zh') }}</label>
            <input v-model="currentNews.titleZh">
          </div>
          <div class="form-group">
            <label>{{ t('admin_news.form.content_zh') }}</label>
            <textarea v-model="currentNews.contentZh" rows="5"></textarea>
          </div>
           <div class="form-group">
            <label>{{ t('admin_news.form.author') }}</label>
            <input v-model="currentNews.author">
          </div>
           <div class="form-group">
            <label>{{ t('admin_news.form.publish_date') }}</label>
            <input type="date" v-model="currentNews.publishDate">
          </div>
          <button type="submit" class="save-button">{{ t('admin_news.actions.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getNewsPage, createNews, updateNews, deleteNews } from '../services/newsAdminService';

const { t } = useI18n();

const news = ref([]);
const total = ref(0);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const currentNews = ref({});

const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const totalPages = computed(() => Math.ceil(total.value / searchParams.pageSize));

const fetchNews = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getNewsPage(searchParams);
    news.value = response.list;
    total.value = response.total;
  } catch (err) {
    error.value = t('admin_news.fetch_error');
    console.error('Failed to fetch news:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (news_item = {}) => {
    if (news_item.id) {
        const date = new Date(news_item.publishDate);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        currentNews.value = { ...news_item, publishDate: `${year}-${month}-${day}` };
    } else {
        currentNews.value = {};
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    currentNews.value = {};
};

const saveNews = async () => {
  try {
    const dataToSend = { ...currentNews.value };
    dataToSend.publishDate = new Date(dataToSend.publishDate).toISOString();

    if (dataToSend.id) {
      await updateNews(dataToSend);
    } else {
      await createNews(dataToSend);
    }
    closeModal();
    fetchNews();
  } catch (err) {
    error.value = t('admin_news.save_error');
    console.error('Failed to save news:', err);
  }
};

const removeNews = async (id) => {
  if (!confirm(t('admin_news.confirm_delete'))) return;
  try {
    await deleteNews(id);
    fetchNews();
  } catch (err) {
    error.value = t('admin_news.delete_error');
    console.error('Failed to delete news:', err);
  }
};

const prevPage = () => {
    if (searchParams.pageNo > 1) {
        searchParams.pageNo--;
        fetchNews();
    }
}

const nextPage = () => {
    if (searchParams.pageNo < totalPages.value) {
        searchParams.pageNo++;
        fetchNews();
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

onMounted(fetchNews);
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

.form-group input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.8) brightness(1.2) sepia(0.5) hue-rotate(180deg);
}
</style>
