import { axiosInstance } from '../lib/axios'

const API_PREFIX = '/search'

/**
 * AI Search with filters
 */
export const aiSearchAPI = async (query, params = {}) => {
  try {
    const response = await axiosInstance.post(`${API_PREFIX}`, {
      query,
      ...params,
    })
    return response.data
  } catch (error) {
    console.error('Error performing AI search:', error)
    throw error
  }
}

/**
 * Get search suggestions (text, categories, trending)
 */
export const getSearchSuggestionsAPI = async (query) => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/suggestions`, {
      params: { query },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    throw error
  }
}

/**
 * Get trending products
 */
export const getTrendingProductsAPI = async (limit = 12, timeframe = '30') => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/trending`, {
      params: { limit, timeframe },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching trending products:', error)
    throw error
  }
}

/**
 * Get personalized recommendations (not authenticated)
 */
export const getRecommendationsAPI = async (userId, context = 'browsing', limit = 12) => {
  try {
    const response = await axiosInstance.post(`${API_PREFIX}/recommendations`, {
      userId,
      context,
      limit,
    })
    return response.data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    throw error
  }
}

export default {
  aiSearchAPI,
  getSearchSuggestionsAPI,
  getTrendingProductsAPI,
  getRecommendationsAPI,
}
