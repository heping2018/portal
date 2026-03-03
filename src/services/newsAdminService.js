import request from '../utils/request';

const API_BASE_URL = '/admin-api/product/news';

export const getNewsPage = (params) => {
  return request({
    url: `${API_BASE_URL}/page`,
    method: 'get',
    params,
  });
};

export const getNewsList = (params) => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
    params,
  });
};

export const getNewsDetail = (id) => {
  return request({
    url: `${API_BASE_URL}/get`,
    method: 'get',
    params: { id },
  });
};

export const createNews = (data) => {
  return request({
    url: `${API_BASE_URL}/create`,
    method: 'post',
    data,
  });
};

export const updateNews = (data) => {
  return request({
    url: `${API_BASE_URL}/update`,
    method: 'put',
    data,
  });
};

export const deleteNews = (id) => {
  return request({
    url: `${API_BASE_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};
