/**
 * Advanced Review API Service
 * Handles all review-related API calls with best practices
 */

import { axiosInstance } from '../lib/axios'

/**
 * Get reviews for a product with advanced filtering
 * @param {string} productId - Product ID
 * @param {object} params - Query parameters (page, limit, sort, filter, verified_only, search)
 */
export const fetchProductReviews = async (productId, params = {}) => {
  try {
    console.log(`🔍 [API] Fetching reviews from /product/${productId}/reviews`, { params })
    const response = await axiosInstance.get(`/product/${productId}/reviews`, {
      params,
    })
    console.log(`✅ [API] Reviews response:`, {
      status: response.status,
      data: response.data,
    })
    return response.data
  } catch (error) {
    console.error(`❌ [API] Error fetching reviews for product ${productId}:`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      error,
    })
    throw error
  }
}

/**
 * Get review statistics
 * @param {string} productId - Product ID
 */
export const fetchReviewStatistics = async (productId) => {
  try {
    const response = await axiosInstance.get(`/product/${productId}/review-stats`)
    return response.data
  } catch (error) {
    console.error('Error fetching review stats:', error)
    throw error
  }
}

/**
 * Create a new review
 * @param {string} productId - Product ID
 * @param {object} reviewData - Review data (rating, title, content)
 */
export const createReview = async (productId, reviewData) => {
  try {
    console.log(`📝 [API] Creating review for product ${productId}:`, reviewData)
    const response = await axiosInstance.post(`/product/${productId}/reviews`, reviewData)
    console.log(`✅ [API] Review created successfully:`, {
      status: response.status,
      data: response.data,
    })
    return response.data
  } catch (error) {
    console.error(`❌ [API] Error creating review:`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      error,
    })
    throw error
  }
}

/**
 * Update a review
 * @param {string} reviewId - Review ID
 * @param {object} updateData - Data to update (rating, title, content)
 */
export const updateReview = async (reviewId, updateData) => {
  try {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, updateData)
    return response.data
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

/**
 * Vote on review (helpful/unhelpful)
 * @param {string} reviewId - Review ID
 * @param {string} voteType - 'helpful' or 'unhelpful'
 */
export const voteReview = async (reviewId, voteType) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/vote`, { vote_type: voteType })
    return response.data
  } catch (error) {
    console.error('Error voting on review:', error)
    throw error
  }
}

/**
 * Flag/report a review
 * @param {string} reviewId - Review ID
 * @param {string} reason - Reason for flagging
 * @param {string} description - Detailed description
 */
export const flagReview = async (reviewId, reason, description = '') => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/flag`, {
      reason,
      description,
    })
    return response.data
  } catch (error) {
    console.error('Error flagging review:', error)
    throw error
  }
}

/**
 * Reply to a review (for vendors/admins)
 * @param {string} reviewId - Review ID
 * @param {string} content - Reply content
 */
export const replyToReview = async (reviewId, content) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/reply`, { content })
    return response.data
  } catch (error) {
    console.error('Error replying to review:', error)
    throw error
  }
}

/**
 * Get review statistics for a product
 * @param {string} productId - Product ID
 */
export const getReviewStats = async (productId) => {
  try {
    const response = await axiosInstance.get(`/product/${productId}/review-stats`)
    return response.data
  } catch (error) {
    console.error('Error getting review stats:', error)
    throw error
  }
}
