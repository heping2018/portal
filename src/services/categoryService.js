import request from '../utils/request';

const API_BASE_URL = '/admin-api/product/certificate-category';

export const getCategoryPage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params
  });
};

export const getCategoryList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params
  });
};

export const getCategoryDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/get`,
    method: 'get',
    params: { id }
  });
};

export const createCategory = (data) => {
  return request({
    url: `${API_BASE_URL}/create`,
    method: 'post',
    data
  });
};

export const updateCategory = (data) => {
  return request({
    url: `${API_BASE_URL}/update`,
    method: 'put',
    data
  });
};

export const deleteCategory = (id) => {
  return request({
    url: `${API_BASE_URL}/delete`,
    method: 'delete',
    params: { id }
  });
};
