import request from '../utils/request';

const API_BASE_URL = '/admin-api/system/user';

export const getUserPage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};
