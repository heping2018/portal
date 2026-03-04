import request from '../utils/request';

const API_BASE_URL = '/admin-api/product';

export const getProductPage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};

export const getProductList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};

export const getProductDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/get`,
    method: 'get',
    params: { id },
  });
};

export const createProduct = (data) => {
  return request({
    url: `${API_BASE_URL}/create`,
    method: 'post',
    data,
  });
};

export const updateProduct = (data) => {
  return request({
    url: `${API_BASE_URL}/update`,
    method: 'put',
    data,
  });
};

export const deleteProduct = (id) => {
  return request({
    url: `${API_BASE_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};
