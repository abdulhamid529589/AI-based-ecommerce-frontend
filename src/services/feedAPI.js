import { axiosInstance } from '../lib/axios'

const API_PREFIX = '/feed'

/**
 * Fetch personalized feed
 */
export const fetchFeedAPI = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}`)
    return response.data
  } catch (error) {
    console.error('Error fetching feed:', error)
    throw error
  }
}

/**
 * Fetch product recommendations for a specific product
 */
export const fetchProductRecommendationsAPI = async (productId) => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/recommendations/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product recommendations:', error)
    throw error
  }
}

/**
 * Fetch user purchase insights and analytics
 */
export const fetchUserInsightsAPI = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/insights`)
    return response.data
  } catch (error) {
    console.error('Error fetching user insights:', error)
    throw error
  }
}

/**
 * Fetch wishlist insights with recommendations
 */
export const fetchWishlistInsightsAPI = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/wishlist-insights`)
    return response.data
  } catch (error) {
    console.error('Error fetching wishlist insights:', error)
    throw error
  }
}

export default {
  fetchFeedAPI,
  fetchProductRecommendationsAPI,
  fetchUserInsightsAPI,
  fetchWishlistInsightsAPI,
}
