import request from '../utils/request';

/**
 * Fetches a paginated list of users from the backend.
 * @param {object} params - Parameters for pagination and filtering.
 * @returns {Promise<object>} - A promise that resolves to the user list and total count.
 */
export const getUserPage = (params) => {
  return request({
    url: '/admin-api/system/user/page', // CORRECTED: Changed to the correct API endpoint
    method: 'get',
    params, // a.k.a. query string for GET requests
  });
};

/**
 * Creates a new user.
 * @param {object} userData - The data for the new user.
 * @returns {Promise<object>} - A promise that resolves to the newly created user data.
 */
export const createUser = (userData) => {
  return request({
    url: '/admin-api/system/user', // CORRECTED: Based on standard REST conventions
    method: 'post',
    data: userData, // The request body
  });
};

/**
 * Updates an existing user.
 * @param {object} userData - The user data to update. Must include the user's ID.
 * @returns {Promise<object>} - A promise that resolves to the updated user data.
 */
export const updateUser = (userData) => {
  return request({
    url: `/admin-api/system/user/${userData.id}`, // CORRECTED: Based on standard REST conventions
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
    url: `/admin-api/system/user/${id}`, // CORRECTED: Based on standard REST conventions
    method: 'delete',
  });
};
