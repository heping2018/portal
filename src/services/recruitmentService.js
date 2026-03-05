import request from '@/utils/request';

/**
 * 获取所有开放的职位列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getJobs = () => {
  return request({
    url: '/app-api/public/recruit/jobs',
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
    url: `/app-api/public/recruit/jobs/${id}`,
    method: 'get',
  });
};

/**
 * 上传简历文件
 * @param {File} file - 简历文件（支持 PDF、DOC、DOCX，最大 10MB）
 * @returns {Promise<AxiosResponse<string>>} - 返回文件访问路径
 */
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/app-api/public/recruit/upload/resume',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 提交求职申请
 * @param {Object} applicationData - 申请数据
 * @param {number} applicationData.jobId - 职位 ID
 * @param {string} applicationData.applicantName - 申请人姓名
 * @param {string} applicationData.email - 申请人邮箱
 * @param {string} applicationData.phone - 申请人电话
 * @param {string} [applicationData.resumeUrl] - 简历文件 URL
 * @param {string} [applicationData.coverLetter] - 求职信
 * @param {string} [applicationData.education] - 教育背景
 * @param {string} [applicationData.experience] - 工作经历
 * @param {string} [applicationData.source] - 申请来源
 * @returns {Promise<AxiosResponse<number>>} - 返回新创建的申请 ID
 */
export const applyForJob = (applicationData) => {
  return request({
    url: '/app-api/public/recruit/jobs/apply',
    method: 'post',
    data: applicationData,
  });
};

/**
 * 获取招聘文化信息
 * @returns {Promise<AxiosResponse<{title: string, description: string}>>}
 */
export const getRecruitCulture = () => {
  return request({
    url: '/app-api/public/recruit/culture',
    method: 'get',
  });
};

/**
 * 获取团队信息
 * @returns {Promise<AxiosResponse<{title: string, description: string}>>}
 */
export const getRecruitTeam = () => {
  return request({
    url: '/app-api/public/recruit/team',
    method: 'get',
  });
};
