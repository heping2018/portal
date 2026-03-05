import request from '@/utils/request';

export const createJob = (data) => {
  return request({
    url: '/admin-api/admin/recruit/jobs/create',
    method: 'post',
    data,
  });
};

export const updateJob = (data) => {
  return request({
    url: '/admin-api/admin/recruit/jobs/update',
    method: 'put',
    data,
  });
};

export const deleteJob = (id) => {
  return request({
    url: '/admin-api/admin/recruit/jobs/delete',
    method: 'delete',
  });
};

export const publishJob = (id) => {
  return request({
    url: `/admin-api/admin/recruit/jobs/${id}/publish`,
    method: 'put',
  });
};

export const closeJob = (id) => {
  return request({
    url: `/admin-api/admin/recruit/jobs/${id}/close`,
    method: 'put',
  });
};


export const getJobDetail = (id) => {
  return request({
    url: '/admin-api/admin/recruit/jobs/get',
    method: 'get',
  });
};

export const getJobList = () => {
  return request({
    url: '/app-api/public/recruit/jobs',
    method: 'get',
  });
};

export const getApplicationList = () => {
  return request({
    url: '/admin-api/admin/recruit/applications/list',
    method: 'get',
  });
};

export const getApplicationDetail = (id) => {
  return request({
    url: '/admin-api/admin/recruit/applications/get',
    method: 'get',
  });
};

export const getJobApplications = (jobId) => {
  return request({
    url: `/admin-api/admin/recruit/applications/job/${jobId}`,
    method: 'get',
  });
};

export const updateApplicationStatus = (data) => {
  return request({
    url: '/admin-api/admin/recruit/applications/status',
    method: 'put',
    data,
  });
};

export const exportApplications = () => {
  return request({
    url: '/admin-api/admin/recruit/applications/export',
    method: 'get',
    responseType: 'blob',
  });
};
