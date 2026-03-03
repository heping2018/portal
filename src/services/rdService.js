import request from '../utils/request';

/**
 * @description Get R&D center information
 * @returns {Promise<any>}
 */
export function getRdCenter() {
  return request({
    url: '/app-api/public/rd/center',
    method: 'get'
  });
}

/**
 * @description Get a list of innovation achievements
 * @param {{ page?: number, pageSize?: number }} params
 * @returns {Promise<any>}
 */
export function getRdInnovations(params) {
  return request({
    url: '/app-api/public/rd/innovations',
    method: 'get',
    params
  });
}
