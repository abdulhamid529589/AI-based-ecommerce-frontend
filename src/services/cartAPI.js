/**
 * Cart API Service
 * Handles all cart-related API calls with the backend
 */

import { axiosInstance } from '../lib/axios'

const API_PREFIX = '/customer'

/**
 * Get user's cart
 */
export const fetchCart = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/cart`)
    return response.data
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {object} metadata - Additional product metadata
 */
export const addToCartAPI = async (productId, quantity, metadata = {}) => {
  try {
    const response = await axiosInstance.post(`${API_PREFIX}/cart`, {
      product_id: productId,
      quantity,
      ...metadata,
    })
    return response.data
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 */
export const updateCartItemAPI = async (itemId, quantity) => {
  try {
    const response = await axiosInstance.put(`${API_PREFIX}/cart/${itemId}`, {
      quantity,
    })
    return response.data
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 */
export const removeFromCartAPI = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`${API_PREFIX}/cart/${itemId}`)
    return response.data
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

/**
 * Clear entire cart
 */
export const clearCartAPI = async () => {
  try {
    const response = await axiosInstance.delete(`${API_PREFIX}/cart`)
    return response.data
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

/**
 * Get cart count
 */
export const getCartCount = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/cart/count`)
    return response.data
  } catch (error) {
    console.error('Error getting cart count:', error)
    throw error
  }
}
