import request from '@/utils/request';

/**
 * 获取所有开放的职位列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getJobs = () => {
  return request({
    url: '/app-api/public/jobs',
    method: 'get',
  });
};

/**
 * 获取特定职位的详细信息
 * @param {number} id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getJobDetails = (id) => {
  return request({
    url: `/app-api/public/jobs/${id}`,
    method: 'get',
  });
};

/**
 * 提交职位申请
 * @param {number} id
 * @param {FormData} applicationData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const applyForJob = (id, applicationData) => {
  return request({
    url: `/app-api/public/jobs/${id}/apply`,
    method: 'post',
    data: applicationData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
