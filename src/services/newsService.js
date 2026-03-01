const API_BASE_URL = '/api'; // 理想情况下应放在 .env 文件中

/**
 * 获取新闻分页列表
 * @param {object} params - 查询参数，例如 { pageNo, pageSize, title, ... }
 * @returns {Promise<object>} 包含新闻列表和分页信息的响应数据
 */
export const getNewsPage = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  try {
    const response = await fetch(`${API_BASE_URL}/news?${queryString}`);
    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.msg || '获取新闻列表失败');
    }
    return result.data;
  } catch (error) {
    console.error('Failed to get news page:', error);
    throw error;
  }
};

/**
 * 获取单条新闻的详细信息
 * @param {number} id - 新闻的 ID
 * @returns {Promise<object>} 新闻的详细信息
 */
export const getNewsById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${id}`);
    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.msg || '获取新闻详情失败');
    }
    return result.data;
  } catch (error) {
    console.error(`Failed to get news detail for id ${id}:`, error);
    throw error;
  }
};
