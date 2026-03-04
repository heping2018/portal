import apiClient from '../utils/request';
import request from '@/utils/request';

/**
 * 获取所有案例研究的行业列表
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCaseStudyIndustries = () => {
  return apiClient.get('/app-api/public/cases/industries');
};

/**
 * 获取所有案例研究列表
 * @param {object} params - 查询参数
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCaseStudies = (params) => {
  return apiClient.get('/app-api/public/cases', { params });
};

/**
 * 按行业筛选案例研究
 * @param {string} industry - 行业名称
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCaseStudiesByIndustry = (industry) => {
  return request({
    url: `/app-api/public/cases/by-industry`,
    method: 'get',
    params: { industry: industry }
  });
};

/**
 * 获取案例研究详情
 * @param {number} id - 案例研究ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCaseStudyDetails = (id) => {
  return apiClient.get(`/app-api/public/cases/${id}`);
};
