import request from '../utils/request';

const API_BASE_URL = '/admin-api/system/role';

/**
 * 获取角色分页列表
 * @param {object} params 查询参数
 */
export const getRolePage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};

/**
 * 获取所有角色的精简列表
 */
export const getSimpleRoleList = () => {
  return request({
    url: `${API_BASE_URL}/list-all-simple`,
    method: 'get',
  });
};

/**
 * 获取角色详情
 * @param {number} id 角色ID
 */
export const getRoleDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/get`,
    method: 'get',
    params: { id },
  });
};

/**
 * 创建新角色
 * @param {object} data 角色信息
 */
export const createRole = (data) => {
  return request({
    url: `${API_BASE_URL}/create`,
    method: 'post',
    data,
  });
};

/**
 * 更新角色信息
 * @param {object} data 角色信息
 */
export const updateRole = (data) => {
  return request({
    url: `${API_BASE_URL}/update`,
    method: 'put',
    data,
  });
};

/**
 * 删除角色
 * @param {number} id 角色ID
 */
export const deleteRole = (id) => {
  return request({
    url: `${API_BASE_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};

/**
 * 更新角色状态
 * @param {number} id 角色ID
 * @param {number} status 状态
 */
export const updateRoleStatus = (id, status) => {
  return request({
    url: `${API_BASE_URL}/update-status`,
    method: 'put',
    data: {
      id,
      status,
    },
  });
};

/**
 * 为角色分配菜单权限
 * @param {number} roleId 角色ID
 * @param {Array<number>} menuIds 菜单ID列表
 */
export const updateRolePermission = (roleId, menuIds) => {
  return request({
    url: `${API_BASE_URL}/update-permission`,
    method: 'put',
    data: {
      roleId,
      menuIds,
    },
  });
};

/**
 * 导出角色数据为 Excel
 */
export const exportRoleExcel = (params) => {
  return request({
    url: `${API_BASE_URL}/export-excel`,
    method: 'get',
    params,
    responseType: 'blob',
  });
};
