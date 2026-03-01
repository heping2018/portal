
const API_BASE_URL = '/api'; // Ideally, this should be in an .env file

/**
 * Fetches a paginated list of users.
 * @param {object} params - The query parameters.
 * @param {number} params.pageNo - The page number to fetch.
 * @param {number} params.pageSize - The number of users per page.
 * @returns {Promise<object>} The response data containing the list of users and total count.
 */
export const getUserPage = async (params) => {
  const accessToken = localStorage.getItem('accessToken');
  const query = new URLSearchParams(params).toString();
  try {
    const response = await fetch(`${API_BASE_URL}/admin-api/system/user/page?${query}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'tenant-id': '0',
      },
    });

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.msg || 'Failed to fetch users');
    }
    return result.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};
