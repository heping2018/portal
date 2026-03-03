import request from '../utils/request';

const API_BASE_URL = 'admin-api/system/user';

export const createUser = (data) => {
  return request({
    url: `${API_BASE_URL}/create`,
    method: 'post',
    data,
  });
};

export const updateUser = (data) => {
  return request({
    url: `${API_BASE_URL}/update`,
    method: 'put',
    data,
  });
};

export const deleteUser = (id) => {
  return request({
    url: `${API_BASE_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};

export const updateUserPassword = (data) => {
  return request({
    url: `${API_BASE_URL}/update-password`,
    method: 'put',
    data,
  });
};

export const updateUserStatus = (data) => {
  return request({
    url: `${API_BASE_URL}/update-status`,
    method: 'put',
    data,
  });
};

export const getUserPage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};

export const getUserDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/get`,
    method: 'get',
    params: { id },
  });
};

export const exportUserExcel = (params) => {
  return request({
    url: `${API_BASE_URL}/export-excel`,
    method: 'get',
    params,
    responseType: 'blob',
  });
};

export const getImportTemplate = () => {
  return request({
    url: `${API_BASE_URL}/get-import-template`,
    method: 'get',
    responseType: 'blob',
  });
};

export const importUsers = (file, updateSupport) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return request({
    url: `${API_BASE_URL}/import`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const batchDeleteUsers = (ids) => {
    return request({
        url: `${API_BASE_URL}/batch-delete`,
        method: 'delete',
        params: { ids: ids.join(',') }, // assuming the backend expects a comma-separated string
    });
};
