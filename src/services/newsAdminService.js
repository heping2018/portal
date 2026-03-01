import request from '../utils/request';

/**
 * Fetches a paginated list of news from the backend.
 * @param {object} params - Parameters for pagination and filtering.
 * @returns {Promise<object>} - A promise that resolves to the news list and total count.
 */
export const getNewsPage = (params) => {
  return request({
    url: '/news',
    method: 'get',
    params,
  });
};

/**
 * Creates a new news article.
 * @param {object} newsData - The data for the new news article.
 * @returns {Promise<object>} - A promise that resolves to the newly created news data.
 */
export const createNews = (newsData) => {
  return request({
    url: '/news',
    method: 'post',
    data: newsData,
  });
};

/**
 * Updates an existing news article.
 * @param {object} newsData - The news data to update. Must include the news article's ID.
 * @returns {Promise<object>} - A promise that resolves to the updated news data.
 */
export const updateNews = (newsData) => {
  return request({
    url: `/news/${newsData.id}`,
    method: 'put',
    data: newsData,
  });
};

/**
 * Deletes a news article by its ID.
 * @param {number} id - The ID of the news article to delete.
 * @returns {Promise<object>} - A promise that resolves upon successful deletion.
 */
export const deleteNews = (id) => {
  return request({
    url: `/news/${id}`,
    method: 'delete',
  });
};
