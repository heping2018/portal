import request from '../utils/request';

const API_BASE_URL = '/app-api/public/certificate';

export const getCertificates = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};
