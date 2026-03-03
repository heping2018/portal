import request from '../utils/request';

const API_BASE_URL = 'app-api/public/news';

export const getNewsList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};

export const getNews = (id) => {
  return request({
    url: `${API_BASE_URL}/${id}`, // FIX: Use path parameter instead of query string
    method: 'get',
  });
};
