<template>
  <el-dialog
    title="分配权限"
    :visible.sync="visible"
    @close="handleClose"
    width="600px"
  >
    <el-tree
      v-if="treeData.length > 0"
      ref="treeRef"
      :data="treeData"
      :props="treeProps"
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
    />
    <div v-else v-loading="loading">正在加载菜单...</div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getMenuList } from '@/services/menuAdminService'; // We will create this service later
import {
  updateRolePermission,
  getRoleDetail,
} from '@/services/roleAdminService';

const props = defineProps({
  visible: Boolean,
  role: Object,
});

const emit = defineEmits(['update:visible', 'success']);

const treeRef = ref(null);
const treeData = ref([]);
const loading = ref(false);
const defaultExpandedKeys = ref([]);
const defaultCheckedKeys = ref([]);

const treeProps = {
  label: 'name',
  children: 'children',
};

const fetchMenuData = async () => {
  loading.value = true;
  try {
    // Assuming getMenuList returns a flat list that needs to be converted to a tree
    const { data } = await getMenuList(); 
    treeData.value = buildTree(data);
    // Expand all nodes by default for better UX
    defaultExpandedKeys.value = data.map((item) => item.id);
  } catch (error) {
    ElMessage.error('获取菜单列表失败');
    treeData.value = [];
  }
};

const fetchRolePermissions = async (roleId) => {
  if (!roleId) return;
  try {
    const { data } = await getRoleDetail(roleId);
    defaultCheckedKeys.value = data.menuIds || [];
  } catch (error) {
    ElMessage.error('获取角色权限失败');
    defaultCheckedKeys.value = [];
  }
};

const buildTree = (list, parentId = 0) => {
  return list
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(list, item.id),
    }));
};

watch(
  () => props.role,
  async (newRole) => {
    if (newRole) {
      loading.value = true;
      await fetchMenuData();
      await fetchRolePermissions(newRole.id);
      loading.value = false;
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit('update:visible', false);
};

const handleSubmit = async () => {
  if (!props.role) return;

  const checkedKeys = treeRef.value.getCheckedKeys();
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
  const allKeys = [...checkedKeys, ...halfCheckedKeys];

  try {
    await updateRolePermission(props.role.id, allKeys);
    ElMessage.success('权限更新成功');
    emit('success');
  } catch (error) {
    ElMessage.error('权限更新失败');
  }
};

</script>
