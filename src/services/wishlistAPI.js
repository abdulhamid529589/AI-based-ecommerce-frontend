/**
 * Wishlist API Service
 * Handles all wishlist-related API calls with the backend
 */

import { axiosInstance } from '../lib/axios'

const API_PREFIX = '/customer'

/**
 * Get user's wishlist
 */
export const fetchWishlist = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/wishlist`)
    return response.data
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    throw error
  }
}

/**
 * Add item to wishlist
 * @param {string} productId - Product ID
 * @param {object} metadata - Additional product metadata
 */
export const addToWishlistAPI = async (productId, metadata = {}) => {
  try {
    const response = await axiosInstance.post(`${API_PREFIX}/wishlist`, {
      product_id: productId,
      ...metadata,
    })
    return response.data
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

/**
 * Remove item from wishlist
 * @param {string} productId - Product ID
 */
export const removeFromWishlistAPI = async (productId) => {
  try {
    const response = await axiosInstance.delete(`${API_PREFIX}/wishlist/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

/**
 * Get wishlist count
 */
export const getWishlistCount = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/wishlist/count`)
    return response.data
  } catch (error) {
    console.error('Error getting wishlist count:', error)
    throw error
  }
}

/**
 * Check if product is in wishlist
 * @param {string} productId - Product ID
 */
export const isInWishlist = async (productId) => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/wishlist/${productId}/check`)
    return response.data
  } catch (error) {
    console.error('Error checking wishlist:', error)
    throw error
  }
}
