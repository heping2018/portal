import request from '@/utils/request';

const processParam = (str) => {
  // 正则表达式：判断是否包含中文字符
  const hasChinese = /[\u4e00-\u9fa5]/.test(str);

  if (hasChinese) {
    // 如果有中文，进行编码
    return encodeURIComponent(str);
  } else {
    // 如果是纯英文/数字，直接返回（或者处理掉空格）
    return str;
  }
};

/**
 * 获取解决方案列表（分页）
 * @param {Object} params - 查询参数
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSolutionList = (params) => {
  return request({
    url: '/app-api/public/solutions',
    method: 'get',
    params: params
  });
};

/**
 * 获取所有解决方案的行业列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSolutionIndustries = () => {
  return request({
    url: '/app-api/public/solutions/industries',
    method: 'get',
  });
};

/**
 * 按行业筛选解决方案
 * @param {string} industry
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSolutionsByIndustry = (industry) => {
  return request({
    url: `/app-api/public/solutions/by-industry`,
    method: 'get',
    params: { industry: industry }
  });
};

/**
 * 获取解决方案详情
 * @param {number} id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSolutionDetails = (id) => {
  return request({
    url: `/app-api/public/solutions/${id}`,
    method: 'get',
  });
};

/**
 * 获取解决方案关联的案例研究
 * @param {number} id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSolutionCases = (id) => {
  return request({
    url: `/app-api/public/solutions/${id}/cases`,
    method: 'get',
  });
};
