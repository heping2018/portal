<template>
  <div class="admin-file-view">
    <div class="file-actions">
      <label class="upload-btn">
        {{ t('admin_file.upload') }}
        <input type="file" @change="handleFileUpload" multiple style="display: none;" />
      </label>
    </div>

    <div v-if="uploading" class="upload-progress">
      <span>{{ t('admin_file.uploading') }}</span>
      <progress :value="uploadProgress" max="100"></progress>
      <span>{{ uploadProgress }}%</span>
    </div>

    <div class="file-grid">
      <div v-for="file in files" :key="file.id" class="file-card">
        <div class="file-preview">
          <img v-if="isImage(file.type)" :src="file.url" :alt="file.name" />
          <div v-else class="file-icon">
            <span>{{ getFileExtension(file.name) }}</span>
          </div>
        </div>
        <div class="file-info">
          <p class="file-name" :title="file.name">{{ file.name }}</p>
          <p class="file-meta">{{ formatBytes(file.size) }} | {{ formatDate(file.createTime) }}</p>
        </div>
        <div class="file-card-actions">
          <button @click="copyUrl(file.url)">{{ t('admin_file.copy_url') }}</button>
          <button class="delete" @click="removeFile(file.id)">{{ t('admin_file.delete') }}</button>
        </div>
      </div>
    </div>

    <div v-if="!files.length && !loading" class="no-files-prompt">
      {{ t('admin_file.no_files') }}
    </div>

    <div class="pagination-container">
      <button @click="changePage(pagination.pageNo - 1)" :disabled="pagination.pageNo <= 1">
        {{ t('pagination.previous') }}
      </button>
      <span>{{ t('pagination.page', { currentPage: pagination.pageNo, totalPages: totalPages }) }}</span>
      <button @click="changePage(pagination.pageNo + 1)" :disabled="pagination.pageNo >= totalPages">
        {{ t('pagination.next') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFilePage, uploadFile, deleteFile } from '../services/fileService';

const { t } = useI18n();

const files = ref([]);
const loading = ref(true);
const uploading = ref(false);
const uploadProgress = ref(0);

const pagination = ref({
  pageNo: 1,
  pageSize: 15,
  total: 0,
});

const totalPages = computed(() => 
  Math.ceil(pagination.value.total / pagination.value.pageSize)
);

const fetchFiles = async () => {
  loading.value = true;
  try {
    const response = await getFilePage({
      pageNo: pagination.value.pageNo,
      pageSize: pagination.value.pageSize,
    });
    files.value = response.list;
    pagination.value.total = response.total;
  } catch (error) {
    console.error("Failed to fetch files:", error);
    alert(t('admin_file.fetch_error'));
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = async (event) => {
  const selectedFiles = event.target.files;
  if (!selectedFiles.length) return;

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // For simplicity, we'll upload one by one and show overall progress.
    // A more advanced implementation might handle parallel uploads.
    for (let i = 0; i < selectedFiles.length; i++) {
      await uploadFile(selectedFiles[i], (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // This progress is for a single file, we can average it for a rough total progress
        uploadProgress.value = Math.round((i / selectedFiles.length) * 100 + percentCompleted / selectedFiles.length);
      });
    }
    alert(t('admin_file.upload_success'));
    await fetchFiles(); // Refresh the list
  } catch (error) {
    console.error("Failed to upload file:", error);
    alert(t('admin_file.upload_error'));
  } finally {
    uploading.value = false;
  }
};

const removeFile = async (id) => {
  if (confirm(t('admin_file.confirm_delete'))) {
    try {
      await deleteFile(id);
      // If the deleted file is the last one on the current page, go back one page
      if (files.value.length === 1 && pagination.value.pageNo > 1) {
        pagination.value.pageNo--;
      }
      await fetchFiles();
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert(t('admin_file.delete_error'));
    }
  }
};

const copyUrl = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    alert(t('admin_file.copy_success'));
  }).catch(err => {
    console.error('Could not copy text: ', err);
    alert(t('admin_file.copy_error'));
  });
};

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    pagination.value.pageNo = page;
    fetchFiles();
  }
};

const isImage = (mimeType) => mimeType && mimeType.startsWith('image/');

const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toUpperCase();
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
}

onMounted(fetchFiles);

</script>

<style scoped>
.admin-file-view {
  padding: 1.5rem;
  height: 100%;
}

.file-actions {
  margin-bottom: 1.5rem;
}

.upload-btn {
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background-color: #4338ca;
}

.upload-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.file-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-preview {
  height: 150px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 2rem;
  font-weight: bold;
  color: #4b5563;
}

.file-info {
  padding: 1rem;
  flex-grow: 1;
}

.file-name {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.file-card-actions {
  padding: 0 1rem 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.file-card-actions button {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  width: 100%;
}

.file-card-actions button.delete {
  border-color: #ef4444;
  color: #ef4444;
}
.file-card-actions button.delete:hover {
  background-color: #fee2e2;
}

.no-files-prompt {
  text-align: center;
  margin-top: 3rem;
  color: #6b7280;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.pagination-container button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.pagination-container button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
