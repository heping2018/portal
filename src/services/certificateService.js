import request from '../utils/request';

/**
 * Fetches a list of all public certifications.
 * This is for the public-facing certifications page.
 * @returns {Promise<object>} A promise that resolves to the certification data.
 */
export const getCertificates = () => {
  return request({
    url: '/certificates',
    method: 'get',
  });
};
