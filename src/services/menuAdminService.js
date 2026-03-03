import request from '../utils/request';

const API_BASE_URL = '/admin-api/system/menu';

/**
 * 获取菜单列表
 * @returns
 */
export const getMenuList = () => {
  return request({
    url: `${API_BASE_URL}/list`,
    method: 'get',
  });
};
