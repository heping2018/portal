<template>
  <div class="admin-view admin-dictionary-view">
    <div class="dict-type-panel">
      <div class="panel-header">
        <h2>{{ t('admin_dictionary.type_title') }}</h2>
        <button class="add-btn" @click="openTypeModal()">+</button>
      </div>
      <div class="panel-body">
        <ul class="type-list">
          <li 
            v-for="type in dictTypes" 
            :key="type.id"
            :class="{ active: type.type === selectedType?.type }"
            @click="selectType(type)"
          >
            <span>{{ type.name }}</span>
            <small>{{ type.type }}</small>
            <div class="type-actions">
              <button class="action-btn edit" @click.stop="openTypeModal(type)">✎</button>
              <button class="action-btn delete" @click.stop="removeDictType(type.id)">✖</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="dict-data-panel">
      <div class="panel-header">
        <h2>{{ selectedType ? t('admin_dictionary.data_title', { name: selectedType.name }) : t('admin_dictionary.data_title_unselected') }}</h2>
        <button class="add-btn" @click="openDataModal()" :disabled="!selectedType">+</button>
      </div>
      <div class="panel-body data-table-container">
        <table v-if="selectedType">
          <thead>
            <tr>
              <th>{{ t('admin_dictionary.data_table.label') }}</th>
              <th>{{ t('admin_dictionary.data_table.value') }}</th>
              <th>{{ t('admin_dictionary.data_table.sort') }}</th>
              <th>{{ t('admin_dictionary.data_table.status') }}</th>
              <th>{{ t('admin_dictionary.data_table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in dictData" :key="data.id">
              <td>{{ data.label }}</td>
              <td>{{ data.value }}</td>
              <td>{{ data.sort }}</td>
              <td>
                <span :class="['status-badge', data.status === 0 ? 'active' : 'inactive']">
                  {{ data.status === 0 ? t('admin_dictionary.status_active') : t('admin_dictionary.status_inactive') }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="edit-btn" @click="openDataModal(data)">{{ t('admin_dictionary.actions.edit') }}</button>
                <button class="delete-btn" @click="removeDictData(data.id)">{{ t('admin_dictionary.actions.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-selection">
          {{ t('admin_dictionary.select_type_prompt') }}
        </div>
      </div>
    </div>

    <!-- Type Modal -->
    <div v-if="showTypeModal" class="modal">
      <div class="modal-content">
        <h2>{{ currentType.id ? t('admin_dictionary.edit_type_title') : t('admin_dictionary.add_type_title') }}</h2>
        <form @submit.prevent="saveDictType">
          <div class="form-group">
            <label>{{ t('admin_dictionary.type_form.name') }}</label>
            <input v-model="currentType.name" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_dictionary.type_form.type') }}</label>
            <input v-model="currentType.type" required :disabled="!!currentType.id">
          </div>
          <div class="form-group">
            <label>{{ t('admin_dictionary.type_form.remark') }}</label>
            <textarea v-model="currentType.remark"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeTypeModal">{{ t('common.cancel') }}</button>
            <button type="submit">{{ t('common.save') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Data Modal -->
    <div v-if="showDataModal" class="modal">
      <div class="modal-content">
        <h2>{{ currentData.id ? t('admin_dictionary.edit_data_title') : t('admin_dictionary.add_data_title') }}</h2>
        <form @submit.prevent="saveDictData">
          <div class="form-group">
            <label>{{ t('admin_dictionary.data_form.label') }}</label>
            <input v-model="currentData.label" required>
          </div>
           <div class="form-group">
            <label>{{ t('admin_dictionary.data_form.value') }}</label>
            <input v-model="currentData.value" required>
          </div>
          <div class="form-group">
            <label>{{ t('admin_dictionary.data_form.sort') }}</label>
            <input type="number" v-model="currentData.sort">
          </div>
          <div class="form-group">
            <label>{{ t('admin_dictionary.data_form.remark') }}</label>
            <textarea v-model="currentData.remark"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeDataModal">{{ t('common.cancel') }}</button>
            <button type="submit">{{ t('common.save') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  getDictTypePage, createDictType, updateDictType, deleteDictType, getDictType,
  getDictDataPage, createDictData, updateDictData, deleteDictData, getDictData
} from '../services/dictionaryService';

const { t } = useI18n();

const dictTypes = ref([]);
const dictData = ref([]);
const selectedType = ref(null);

const showTypeModal = ref(false);
const currentType = ref({});

const showDataModal = ref(false);
const currentData = ref({});

const fetchDictTypes = async () => {
  try {
    const response = await getDictTypePage({ pageNo: 1, pageSize: 1000 });
    dictTypes.value = response.list;
  } catch (error) {
    console.error("Failed to fetch dictionary types:", error);
  }
};

const selectType = async (type) => {
  selectedType.value = type;
  fetchDictData();
};

const fetchDictData = async () => {
  if (!selectedType.value) return;
  try {
    const response = await getDictDataPage({ dictType: selectedType.value.type, pageNo: 1, pageSize: 1000 });
    dictData.value = response.list;
  } catch (error) {
    console.error("Failed to fetch dictionary data:", error);
    dictData.value = [];
  }
};

onMounted(fetchDictTypes);

// Type Modal Logic
const openTypeModal = async (type = null) => {
  if (type) {
    const response = await getDictType(type.id);
    currentType.value = { ...response };
  } else {
    currentType.value = { name: '', type: '' };
  }
  showTypeModal.value = true;
};

const closeTypeModal = () => {
  showTypeModal.value = false;
  currentType.value = {};
};

const saveDictType = async () => {
  try {
    if (currentType.value.id) {
      await updateDictType(currentType.value);
    } else {
      await createDictType(currentType.value);
    }
    await fetchDictTypes();
    closeTypeModal();
  } catch (error) {
    console.error("Failed to save dictionary type:", error);
  }
};

const removeDictType = async (id) => {
  if (confirm(t('admin_dictionary.confirm_delete_type'))) {
    try {
      await deleteDictType(id);
      await fetchDictTypes();
      if (selectedType.value?.id === id) {
        selectedType.value = null;
        dictData.value = [];
      }
    } catch (error) {
      console.error("Failed to delete dictionary type:", error);
    }
  }
};

// Data Modal Logic
const openDataModal = async (data = null) => {
  if (data) {
    const response = await getDictData(data.id);
    currentData.value = { ...response };
  } else {
    currentData.value = { label: '', value: '', sort: 10, dictType: selectedType.value.type };
  }
  showDataModal.value = true;
};

const closeDataModal = () => {
  showDataModal.value = false;
  currentData.value = {};
};

const saveDictData = async () => {
  try {
    if (currentData.value.id) {
      await updateDictData(currentData.value);
    } else {
      await createDictData(currentData.value);
    }
    await fetchDictData();
    closeDataModal();
  } catch (error) {
    console.error("Failed to save dictionary data:", error);
  }
};

const removeDictData = async (id) => {
  if (confirm(t('admin_dictionary.confirm_delete_data'))) {
    try {
      await deleteDictData(id);
      await fetchDictData();
    } catch (error) {
      console.error("Failed to delete dictionary data:", error);
    }
  }
};
</script>

<style scoped>
@import '../assets/admin-view.css';

.admin-dictionary-view {
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 120px); /* Adjust based on your layout */
}

.dict-type-panel, .dict-data-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
}

.dict-type-panel {
  width: 380px;
  flex-shrink: 0;
}

.dict-data-panel {
  flex-grow: 1;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #FFFFFF;
}

.add-btn {
  background: linear-gradient(45deg, #007BFF, #00C4FF);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}
.add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(0, 196, 255, 0.5);
}
.add-btn:disabled {
  background: #555;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.panel-body {
  padding: 0.8rem;
  overflow-y: auto;
}

.type-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.type-list li {
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 0.4rem;
  display: flex;
  flex-direction: column;
  position: relative;
  color: #E0E0E0;
  transition: background-color 0.3s;
}

.type-list li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.type-list li.active {
  background-color: rgba(0, 150, 255, 0.3);
  color: #FFFFFF;
  font-weight: 600;
}

.type-list li small {
  font-size: 0.85rem;
  color: #aaa;
  margin-top: 3px;
}

.type-list li:hover .type-actions {
  display: flex;
}

.type-actions {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;
}
.action-btn.edit { color: #3b82f6; }
.action-btn.edit:hover { color: #60a5fa; }
.action-btn.delete { color: #ef4444; }
.action-btn.delete:hover { color: #f87171; }

.data-table-container {
  padding: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

thead {
  background: rgba(255, 255, 255, 0.1);
}

th {
  font-size: 0.9rem;
  color: #F0F0F0;
  text-transform: uppercase;
}

.no-selection {
  padding: 4rem;
  text-align: center;
  color: #9ca3af;
  font-size: 1.1rem;
}

.action-buttons button {
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.edit-btn { background: linear-gradient(45deg, #3b82f6, #60a5fa); color: white; }
.delete-btn { background: linear-gradient(45deg, #ef4444, #f87171); color: white; margin-left: 8px; }

.modal-actions {
  display: flex; 
  justify-content: flex-end; 
  gap: 1rem; 
  margin-top: 2rem;
}
.modal-actions button {
  padding: 0.7rem 1.4rem; 
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #E0E0E0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.modal-actions button:hover {
    border-color: rgba(0, 196, 255, 0.8);
}
.modal-actions button[type="submit"] {
  background: linear-gradient(45deg, #007BFF, #00C4FF);
  color: white;
  border: none;
}
.modal-actions button[type="submit"]:hover {
    box-shadow: 0 0 15px rgba(0, 196, 255, 0.4);
}
</style>
