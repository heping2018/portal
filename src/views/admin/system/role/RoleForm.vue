<template>
  <el-dialog
    :model-value="visible"
    :title="isEditMode ? t('role.edit_role') : t('role.add_role')"
    width="600px"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form
      ref="roleFormRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item :label="t('role.role_name')" prop="name">
        <el-input v-model="form.name" :placeholder="t('role.role_name_required')" />
      </el-form-item>
      <el-form-item :label="t('role.role_key')" prop="code">
        <el-input v-model="form.code" :placeholder="t('role.role_key_required')" />
      </el-form-item>
      <el-form-item :label="t('role.remarks')" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('common.save') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { createRole, updateRole } from '@/services/roleAdminService';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:visible', 'success']);

const { t } = useI18n();
const roleFormRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  id: null,
  name: '',
  code: '',
  remark: '',
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: t('role.role_name_required'), trigger: 'blur' }],
  code: [{ required: true, message: t('role.role_key_required'), trigger: 'blur' }],
});

const isEditMode = computed(() => !!props.role);

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      if (isEditMode.value) {
        Object.assign(form, props.role);
      } else {
        // Reset form for creation
        form.id = null;
        form.name = '';
        form.code = '';
        form.remark = '';
      }
    } else {
      roleFormRef.value?.resetFields();
    }
  }
);

const handleClose = () => {
  emit('update:visible', false);
};

const handleSubmit = async () => {
  if (!roleFormRef.value) return;
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        if (isEditMode.value) {
          await updateRole(form);
          ElMessage.success(t('role.update_success'));
        } else {
          await createRole(form);
          ElMessage.success(t('role.add_success'));
        }
        emit('success');
        handleClose();
      } catch (error) {
        // Error message is handled by the service/interceptor
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
