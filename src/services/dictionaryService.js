import request from '../utils/request';

const TYPE_API_URL = '/admin-api/system/dict-type';
const DATA_API_URL = '/admin-api/system/dict-data';

// Dictionary Type APIs
export const getDictTypePage = (params) => {
  return request({
    url: `${TYPE_API_URL}/page`,
    method: 'get',
    params,
  });
};

export const getDictType = (id) => {
  return request({
    url: `${TYPE_API_URL}/get`,
    method: 'get',
    params: { id },
  });
};

export const createDictType = (data) => {
  return request({
    url: `${TYPE_API_URL}/create`,
    method: 'post',
    data,
  });
};

export const updateDictType = (data) => {
  return request({
    url: `${TYPE_API_URL}/update`,
    method: 'put',
    data,
  });
};

export const deleteDictType = (id) => {
  return request({
    url: `${TYPE_API_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};

// Dictionary Data APIs
export const getDictDataPage = (params) => {
  return request({
    url: `${DATA_API_URL}/page`,
    method: 'get',
    params,
  });
};

export const getDictData = (id) => {
  return request({
    url: `${DATA_API_URL}/get`,
    method: 'get',
    params: { id },
  });
};

export const createDictData = (data) => {
  return request({
    url: `${DATA_API_URL}/create`,
    method: 'post',
    data,
  });
};

export const updateDictData = (data) => {
  return request({
    url: `${DATA_API_URL}/update`,
    method: 'put',
    data,
  });
};

export const deleteDictData = (id) => {
  return request({
    url: `${DATA_API_URL}/delete`,
    method: 'delete',
    params: { id },
  });
};

export const getDictDataList = (params) => {
    return request({
        url: `${DATA_API_URL}/list-all-simple`,
        method: 'get',
        params,
    });
};
