import request from '../utils/request';

/**
 * Fetches a paginated list of products.
 * @param {object} params - The query parameters.
 * @param {number} params.pageNo - The page number.
 * @param {number} params.pageSize - The number of items per page.
 * @param {string} [params.keyword] - The search keyword.
 * @returns {Promise<object>} A promise that resolves to the product data.
 */
export const getProductsPage = (params) => {
  return request({
    url: '/products/page', // Corrected: Use the public endpoint
    method: 'get',
    params,
  });
};

/**
 * Fetches the details of a single product.
 * @param {number} id - The ID of the product.
 * @returns {Promise<object>} A promise that resolves to the product detail data.
 */
export const getProductDetail = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'get',
  });
};
