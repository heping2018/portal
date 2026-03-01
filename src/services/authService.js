import request from '../utils/request';

/**
 * Logs in a user using username and password.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} A promise that resolves to the login response data, including tokens.
 */
export const login = (username, password) => {
  return request({
    url: '/admin-api/system/auth/login',
    method: 'post',
    data: { username, password },
  });
};

/**
 * Logs out the current user.
 * @returns {Promise<object>} A promise that resolves on successful logout.
 */
export const logout = () => {
  return request({
    url: '/admin-api/system/auth/logout',
    method: 'post',
  });
};

/**
 * Fetches the permission information for the currently logged-in user.
 * @returns {Promise<object>} A promise that resolves to the permission info, including user, roles, and permissions.
 */
export const getPermissionInfo = () => {
  return request({
    url: '/admin-api/system/auth/get-permission-info',
    method: 'get',
  });
};

/**
 * Refreshes the access token using the refresh token.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<object>} A promise that resolves to the new token data.
 */
export const refreshToken = (refreshToken) => {
  return request({
    url: '/admin-api/system/auth/refresh-token',
    method: 'post',
    data: { refreshToken },
  });
};
