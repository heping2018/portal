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

/**
 * @description Get all product categories
 * @returns {Promise<any>}
 */
export const getProductCategories = () => {
  return request({
    url: '/app-api/categories',
    method: 'get',
  });
};

/**
 * @description Get products by category
 * @param {string} category The category code
 * @returns {Promise<any>}
 */
export const getProductsByCategory = (category) => {
  return request({
    url: `${API_BASE_URL}/category/${category}`,
    method: 'get',
  });
};

/**
 * @description Search for products by keyword
 * @param {string} keyword
 * @returns {Promise<any>}
 */
export const searchProducts = (keyword) => {
  return request({
    url: `${API_BASE_URL}/search`,
    method: 'get',
    params: { keyword },
  });
};
