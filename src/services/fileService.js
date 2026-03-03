import request from '../utils/request';

const API_URL = '/admin-api/infra/file';

export const getFilePage = (params) => {
  return request({
    url: `${API_URL}/page`,
    method: 'get',
    params,
  });
};

export const uploadFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: `${API_URL}/upload`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const deleteFile = (id) => {
  return request({
    url: `${API_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};
