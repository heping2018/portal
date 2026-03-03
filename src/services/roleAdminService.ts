import apiClient from './apiClient';

export const getRolePage = (params) => {
  return apiClient.get('/system/role/page', { params });
};

export const getRoleList = () => {
  return apiClient.get('/system/role/list-all-simple');
};

export const getRole = (id) => {
  return apiClient.get(`/system/role/get?id=${id}`);
};

export const createRole = (data) => {
  return apiClient.post('/system/role/create', data);
};

export const updateRole = (data) => {
  return apiClient.put('/system/role/update', data);
};

export const updateRoleStatus = (id, status) => {
  return apiClient.put('/system/role/update-status', { id, status });
};

export const deleteRole = (id) => {
  return apiClient.delete(`/system/role/delete?id=${id}`);
};

export const getRolePermission = (roleId) => {
  return apiClient.get(`/system/permission/list-role-resources?roleId=${roleId}`);
};

export const assignRolePermission = (data) => {
  return apiClient.post('/system/permission/assign-role-menu', data);
};
