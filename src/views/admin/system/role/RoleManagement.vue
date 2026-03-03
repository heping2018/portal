<template>
  <div class="admin-view-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button
            class="add-button"
            type="primary"
            @click="handleCreate"
            >新增角色</el-button
          >
        </div>
      </template>

      <el-table
        :data="roles"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="primary" link @click="handlePermission(row)"
              >分配权限</el-button
            >
            <el-button type="danger" link @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination-container"
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <RoleForm
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :role="selectedRole"
      @success="handleFormSuccess"
    />

    <PermissionDialog
      v-if="permissionDialogVisible"
      :visible.sync="permissionDialogVisible"
      :role="selectedRole"
      @success="handlePermissionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getRolePage,
  updateRoleStatus,
  deleteRole,
} from '@/services/roleAdminService';
import RoleForm from './RoleForm.vue';
import PermissionDialog from './PermissionDialog.vue';

const roles = ref([]);
const loading = ref(true);
const dialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const selectedRole = ref(null);
const selectedIds = ref([]);

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
});

const fetchRoles = async () => {
  loading.value = true;
  try {
    const { data } = await getRolePage({
      pageNo: pagination.value.page,
      pageSize: pagination.value.limit,
    });
    roles.value = data.list;
    pagination.value.total = data.total;
  } catch (error) {
    ElMessage.error('获取角色列表失败');
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  selectedRole.value = null;
  dialogVisible.value = true;
};

const handleEdit = (role) => {
  selectedRole.value = role;
  dialogVisible.value = true;
};

const handlePermission = (role) => {
  selectedRole.value = role;
  permissionDialogVisible.value = true;
};

const handleDelete = async (role) => {
  await ElMessageBox.confirm(`确认删除角色 "${role.name}"?`, '提示', {
    type: 'warning',
  });
  await deleteRole(role.id);
  ElMessage.success('删除成功');
  fetchRoles();
};

const handleStatusChange = async (role) => {
  try {
    await updateRoleStatus(role.id, role.status);
    ElMessage.success('状态更新成功');
  } catch (error) {
    ElMessage.error('状态更新失败');
    // Revert status on failure
    role.status = role.status === 0 ? 1 : 0;
  }
};

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleSizeChange = (size) => {
  pagination.value.limit = size;
  fetchRoles();
};

const handleCurrentChange = (page) => {
  pagination.value.page = page;
  fetchRoles();
};

const handleFormSuccess = () => {
  dialogVisible.value = false;
  fetchRoles();
};

const handlePermissionSuccess = () => {
  permissionDialogVisible.value = false;
};

onMounted(fetchRoles);
</script>

<style scoped>
@import '@/assets/css/admin-view.css';

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
}
</style>
