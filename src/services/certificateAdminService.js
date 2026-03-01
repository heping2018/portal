import request from '../utils/request';

// As per api.md, this endpoint returns a simple array of certificates.
export const getCertificatePage = (params) => {
  return request({
    url: '/certificates',
    method: 'get',
    params,
  });
};

// NOTE: The following admin endpoints are not explicitly defined in api.md.
// They are assumed based on the application's existing structure.
export const createCertificate = (data) => {
  return request({
    url: '/admin-api/certificate/create',
    method: 'post',
    data,
  });
};

export const updateCertificate = (data) => {
  return request({
    url: '/admin-api/certificate/update',
    method: 'put',
    data,
  });
};

export const deleteCertificate = (id) => {
  return request({
    url: `/admin-api/certificate/delete?id=${id}`,
    method: 'delete',
  });
};
