import request from '../utils/request';

const API_BASE_URL = '/app-api/member/user';

export const getUserPage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};
