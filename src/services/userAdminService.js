import request from '../utils/request';

/**
 * Fetches a paginated list of users from the backend.
 * @param {object} params - Parameters for pagination and filtering.
 * @returns {Promise<object>} - A promise that resolves to the user list and total count.
 */
export const getUserPage = (params) => {
  return request({
    url: '/admin-api/system/user/page',
    method: 'get',
    params,
  });
};

/**
 * Gets user details by ID.
 * @param {number} id - The user ID.
 * @returns {Promise<object>} - A promise that resolves to the user detail data.
 */
export const getUserDetail = (id) => {
  return request({
    url: '/admin-api/system/user/get',
    method: 'get',
    params: { id },
  });
};

/**
 * Gets a simple list of all users (for dropdowns, etc.).
 * @returns {Promise<object>} - A promise that resolves to the simplified user list.
 */
export const getUserSimpleList = () => {
  return request({
    url: '/admin-api/system/user/list-all-simple',
    method: 'get',
  });
};

/**
 * Creates a new user.
 * @param {object} userData - The data for the new user.
 * @returns {Promise<object>} - A promise that resolves to the newly created user data.
 */
export const createUser = (userData) => {
  return request({
    url: '/admin-api/system/user/create',
    method: 'post',
    data: userData,
  });
};

/**
 * Updates an existing user.
 * @param {object} userData - The user data to update. Must include the user's ID.
 * @returns {Promise<object>} - A promise that resolves to the updated user data.
 */
export const updateUser = (userData) => {
  return request({
    url: '/admin-api/system/user/update',
    method: 'put',
    data: userData,
  });
};

/**
 * Deletes a user by their ID.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<object>} - A promise that resolves upon successful deletion.
 */
export const deleteUser = (id) => {
  return request({
    url: '/admin-api/system/user/delete',
    method: 'delete',
    params: { id },
  });
};

/**
 * Batch deletes users by their IDs.
 * @param {number[]} ids - The array of user IDs to delete.
 * @returns {Promise<object>} - A promise that resolves upon successful deletion.
 */
export const batchDeleteUsers = (ids) => {
  return request({
    url: '/admin-api/system/user/delete-list',
    method: 'delete',
    params: { ids },
  });
};

/**
 * Updates a user's password.
 * @param {number} id - The user ID.
 * @param {string} password - The new password.
 * @returns {Promise<object>} - A promise that resolves upon successful update.
 */
export const updateUserPassword = (id, password) => {
  return request({
    url: '/admin-api/system/user/update-password',
    method: 'put',
    data: { id, password },
  });
};

/**
 * Updates a user's status (enable/disable).
 * @param {number} id - The user ID.
 * @param {number} status - The status (0-disabled, 1-enabled).
 * @returns {Promise<object>} - A promise that resolves upon successful update.
 */
export const updateUserStatus = (id, status) => {
  return request({
    url: '/admin-api/system/user/update-status',
    method: 'put',
    data: { id, status },
  });
};

/**
 * Exports users to Excel file.
 * @param {object} params - Filter parameters for export.
 * @returns {Promise<object>} - A promise that resolves with the file download.
 */
export const exportUserExcel = (params) => {
  return request({
    url: '/admin-api/system/user/export-excel',
    method: 'get',
    params,
    responseType: 'blob',
  });
};

/**
 * Gets the import template for users.
 * @returns {Promise<object>} - A promise that resolves with the template file download.
 */
export const getImportTemplate = () => {
  return request({
    url: '/admin-api/system/user/get-import-template',
    method: 'get',
    responseType: 'blob',
  });
};

/**
 * Imports users from an Excel file.
 * @param {File} file - The Excel file to import.
 * @param {boolean} updateSupport - Whether to support updating existing users.
 * @returns {Promise<object>} - A promise that resolves with the import result.
 */
export const importUsers = (file, updateSupport = false) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  
  return request({
    url: '/admin-api/system/user/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
