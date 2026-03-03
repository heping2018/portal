import apiClient from '../utils/request';

/**
 * Fetches the main information for the R&D Center.
 * @returns {Promise<ApiResponse<RdCenterInfoVO>>} A promise that resolves to the R&D center information.
 */
export const getRdCenterInfo = () => {
  return apiClient.get('/app-api/public/rd/center');
};

/**
 * Fetches the list of innovation achievements.
 * @param {object} params - The query parameters for the request.
 * @param {number} params.page - The page number to retrieve.
 * @param {number} params.pageSize - The number of items per page.
 * @returns {Promise<ApiResponse<PageResult<InnovationVO>>>} A promise that resolves to a paginated list of innovations.
 */
export const getInnovations = (params) => {
  return apiClient.get('/app-api/public/rd/innovations', { params });
};

/**
 * Fetches the details for a specific innovation achievement by its ID.
 * @param {number} id - The ID of the innovation to retrieve.
 * @returns {Promise<ApiResponse<InnovationVO>>} A promise that resolves to the detailed innovation object.
 */
export const getInnovationById = (id) => {
  if (!id) {
    return Promise.reject(new Error('Innovation ID is required.'));
  }
  return apiClient.get(`/app-api/public/rd/innovations/${id}`);
};
