import request from '../utils/request';

const API_BASE_URL = '/app-api/product/solution';

export const getSolutionList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};
