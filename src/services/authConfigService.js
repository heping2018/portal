import request from '../utils/request';

/**
 * Gets the authentication configuration.
 * @returns {Promise<object>} A promise that resolves to the auth config data.
 */
export const getAuthConfig = () => {
  return request({
    url: '/admin-api/system/auth-config/get',
    method: 'get',
  });
};

/**
 * Updates the authentication configuration.
 * @param {object} configData - The auth config data to update.
 * @param {string} configData.authType - The authentication type (JWT or OAUTH2).
 * @param {boolean} configData.singleDeviceLogin - Whether to enable single sign-on.
 * @param {number} configData.sessionTimeout - Session timeout in seconds.
 * @param {string} [configData.jwtSecret] - JWT secret (optional).
 * @param {number} [configData.jwtExpiration] - JWT expiration time in milliseconds (optional).
 * @param {string} [configData.oauth2Provider] - OAuth2 provider (optional).
 * @param {string} [configData.oauth2ClientId] - OAuth2 client ID (optional).
 * @param {string} [configData.oauth2ClientSecret] - OAuth2 client secret (optional).
 * @param {string} [configData.oauth2RedirectUri] - OAuth2 redirect URI (optional).
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful.
 */
export const updateAuthConfig = (configData) => {
  return request({
    url: '/admin-api/system/auth-config/update',
    method: 'put',
    data: configData,
  });
};

/**
 * Switches the authentication type.
 * @param {string} authType - The authentication type to switch to (JWT or OAUTH2).
 * @returns {Promise<boolean>} A promise that resolves to true if the switch was successful.
 */
export const switchAuthType = (authType) => {
  return request({
    url: '/admin-api/system/auth-config/switch-auth-type',
    method: 'post',
    params: { authType },
  });
};

/**
 * Enables or disables single sign-on.
 * @param {boolean} enabled - Whether to enable SSO.
 * @returns {Promise<boolean>} A promise that resolves to true if the operation was successful.
 */
export const toggleSSO = (enabled) => {
  return request({
    url: '/admin-api/system/auth-config/toggle-sso',
    method: 'post',
    params: { enabled },
  });
};
