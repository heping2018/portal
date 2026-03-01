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

/**
 * Registers a new user.
 * @param {object} userData - The user registration data.
 * @param {string} userData.username - The username.
 * @param {string} userData.password - The password.
 * @param {string} userData.nickname - The nickname.
 * @param {string} [userData.email] - The email (optional).
 * @param {string} [userData.mobile] - The mobile number (optional).
 * @returns {Promise<object>} A promise that resolves to the login response data, including tokens.
 */
export const register = (userData) => {
  return request({
    url: '/admin-api/system/auth/register',
    method: 'post',
    data: userData,
  });
};

/**
 * Logs in a user using SMS verification code.
 * @param {string} mobile - The mobile number.
 * @param {string} code - The SMS verification code.
 * @returns {Promise<object>} A promise that resolves to the login response data, including tokens.
 */
export const smsLogin = (mobile, code) => {
  return request({
    url: '/admin-api/system/auth/sms-login',
    method: 'post',
    data: { mobile, code },
  });
};

/**
 * Sends an SMS verification code.
 * @param {string} mobile - The mobile number.
 * @param {number} [scene] - The scene for sending the SMS (optional).
 * @returns {Promise<boolean>} A promise that resolves to true if the SMS was sent successfully.
 */
export const sendSmsCode = (mobile, scene) => {
  return request({
    url: '/admin-api/system/auth/send-sms-code',
    method: 'post',
    data: { mobile, scene },
  });
};

/**
 * Resets the user's password using SMS verification.
 * @param {string} mobile - The mobile number.
 * @param {string} code - The SMS verification code.
 * @param {string} password - The new password.
 * @returns {Promise<boolean>} A promise that resolves to true if the password was reset successfully.
 */
export const resetPassword = (mobile, code, password) => {
  return request({
    url: '/admin-api/system/auth/reset-password',
    method: 'post',
    data: { mobile, code, password },
  });
};

/**
 * Gets the social authentication redirect URL.
 * @param {number} type - The social platform type.
 * @param {string} [redirectUri] - The callback URI (optional).
 * @returns {Promise<string>} A promise that resolves to the authorization URL.
 */
export const socialAuthRedirect = (type, redirectUri) => {
  return request({
    url: '/admin-api/system/auth/social-auth-redirect',
    method: 'get',
    params: { type, redirectUri },
  });
};

/**
 * Performs a social login.
 * @param {number} type - The social platform type.
 * @param {string} code - The authorization code.
 * @param {string} state - The authorization state.
 * @returns {Promise<object>} A promise that resolves to the login response data, including tokens.
 */
export const socialLogin = (type, code, state) => {
  return request({
    url: '/admin-api/system/auth/social-login',
    method: 'post',
    data: { type, code, state },
  });
};
