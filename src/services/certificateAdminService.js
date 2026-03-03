import request from '../utils/request';

const API_BASE_URL = '/admin-api/product/certificate';

export const getCertificatePage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};

export const getCertificateList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};

export const getCertificateDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/get`,
    method: 'get',
    params: { id },
  });
};

export const createCertificate = (data) => {
  return request({
    url: `${API_BASE_URL}/create`,
    method: 'post',
    data,
  });
};

export const updateCertificate = (data) => {
  return request({
    url: `${API_BASE_URL}/update`,
    method: 'put',
    data,
  });
};

export const deleteCertificate = (id) => {
  return request({
    url: `${API_BASE_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};

export const getExpiringCertificates = (days) => {
  return request({
    url: `${API_BASE_URL}/expiring`,
    method: 'get',
    params: { days },
  });
};

export const getExpiredCertificates = () => {
  return request({
    url: `${API_BASE_URL}/expired`,
    method: 'get',
  });
};
