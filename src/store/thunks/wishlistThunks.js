/**
 * Wishlist Redux Async Thunks
 * Async thunks for wishlist operations with backend synchronization
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import * as wishlistAPI from '../../services/wishlistAPI'
import { getSafeErrorMessage } from '../../utils/errorHandler'

/**
 * Fetch wishlist from server
 */
export const fetchWishlistFromServer = createAsyncThunk(
  'wishlist/fetchFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.fetchWishlist()
      return response.data || response
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Add item to wishlist on server
 */
export const addToWishlistOnServer = createAsyncThunk(
  'wishlist/addToServer',
  async ({ productId, metadata = {} }, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.addToWishlistAPI(productId, metadata)
      return response.data || response
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Remove item from wishlist on server
 */
export const removeFromWishlistOnServer = createAsyncThunk(
  'wishlist/removeOnServer',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.removeFromWishlistAPI(productId)
      return { productId, ...response.data } || { productId }
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Get wishlist count from server
 */
export const getWishlistCountFromServer = createAsyncThunk(
  'wishlist/getCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlistCount()
      return response.data?.count || 0
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Check if product is in wishlist on server
 */
export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkStatus',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.isInWishlist(productId)
      return { productId, isInWishlist: response.data?.isInWishlist || false }
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)
