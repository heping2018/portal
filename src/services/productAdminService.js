import request from '../utils/request';

/**
 * Fetches a paginated list of products for the admin area.
 * @param {object} params - The query parameters.
 * @param {number} params.pageNo - The page number.
 * @param {number} params.pageSize - The number of items per page.
 * @param {string} [params.keyword] - The search keyword.
 * @returns {Promise<object>} A promise that resolves to the product data.
 */
export const getProductPage = (params) => {
  return request({
    url: '/products/page', // Corrected endpoint as per api.md
    method: 'get',
    params,
  });
};

/**
 * Creates a new product.
 * @param {object} data - The product data.
 * @returns {Promise<object>} A promise that resolves when the product is created.
 */
export const createProduct = (data) => {
  // Note: The api.md does not specify an admin endpoint for creation.
  // Assuming a standard /admin-api/product/create structure.
  return request({
    url: '/admin-api/product/create',
    method: 'post',
    data,
  });
};

/**
 * Updates an existing product.
 * @param {object} data - The product data.
 * @returns {Promise<object>} A promise that resolves when the product is updated.
 */
export const updateProduct = (data) => {
  // Note: The api.md does not specify an admin endpoint for update.
  // Assuming a standard /admin-api/product/update structure.
  return request({
    url: '/admin-api/product/update',
    method: 'put',
    data,
  });
};

/**
 * Deletes a product.
 * @param {number} id - The ID of the product to delete.
 * @returns {Promise<object>} A promise that resolves when the product is deleted.
 */
export const deleteProduct = (id) => {
  // Note: The api.md does not specify an admin endpoint for deletion.
  // Assuming a standard /admin-api/product/delete structure.
  return request({
    url: `/admin-api/product/delete?id=${id}`,
    method: 'delete',
  });
};
