import request from '../utils/request';

const API_BASE_URL = '/app-api/public/product';

export const getProductList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};

export const getProductDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/${id}`,
    method: 'get',
  });
};
