import request from '../utils/request';

const API_BASE_URL = '/admin-api/system/auth';

export const login = (username, password) => {
  return request({
    url: `${API_BASE_URL}/login`,
    method: 'post',
    data: { username, password, grant_type: 'password' },
  });
};

export const smsLogin = (mobile, code) => {
  return request({
    url: `${API_BASE_URL}/sms-login`,
    method: 'post',
    data: { mobile, code },
  });
};

export const socialLogin = (type, code, state) => {
  return request({
    url: `${API_BASE_URL}/social-login`,
    method: 'post',
    data: { type, code, state },
  });
};

export const register = (username, password) => {
  return request({
    url: `${API_BASE_URL}/register`,
    method: 'post',
    data: { username, password },
  });
};

export const sendSmsCode = (mobile, scene) => {
  return request({
    url: `${API_BASE_URL}/send-sms-code`,
    method: 'post',
    data: { mobile, scene },
  });
};

export const resetPassword = (mobile, code, password) => {
  return request({
    url: `${API_BASE_URL}/reset-password`,
    method: 'post',
    data: { mobile, code, password },
  });
};

export const refreshToken = (refreshToken) => {
  return request({
    url: `${API_BASE_URL}/refresh-token`,
    method: 'post',
    data: { refreshToken, grant_type: 'refresh_token' },
  });
};

export const logout = () => {
  return request({
    url: `${API_BASE_URL}/logout`,
    method: 'post',
  });
};

export const getPermissionInfo = () => {
  return request({
    url: 'admin-api/system/auth/get-permission-info',
    method: 'get',
  });
};

export const listSocialAuths = (type) => {
  return request({
    url: `${API_BASE_URL}/social-auth-redirect`,
    method: 'get',
    params: { type },
  });
};
