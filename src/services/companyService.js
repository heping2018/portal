import request from '../utils/request';

/**
 * @description 获取“关于”页面的导航菜单
 * @returns {Promise<CommonResult<NavigationItemVO[]>>}
 */
export const getCompanySections = () => {
  return request({
    url: '/app-api/public/company/about/navigation',
    method: 'get',
  });
};

/**
 * @description 获取公司简介信息
 * @returns {Promise<CommonResult<CompanyProfileVO>>}
 */
export const getCompanyProfile = () => {
  return request({
    url: '/app-api/public/company/about/profile',
    method: 'get',
  });
};

/**
 * @description 获取企业文化信息
 * @returns {Promise<CommonResult<CompanyCultureVO>>}
 */
export const getCompanyCulture = () => {
  return request({
    url: '/app-api/public/company/about/culture',
    method: 'get',
  });
};

/**
 * @description 获取发展历程信息
 * @returns {Promise<CommonResult<CompanyHistoryVO[]>>}
 */
export const getCompanyHistory = () => {
  return request({
    url: '/app-api/public/company/about/history',
    method: 'get',
  });
};

/**
 * @description 获取成员公司列表
 * @returns {Promise<CommonResult<CompanyMemberVO[]>>}
 */
export const getCompanyMembers = () => {
  return request({
    url: '/app-api/public/company/about/members',
    method: 'get',
  });
};
