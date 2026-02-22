/**
 * Cart Redux Async Thunks
 * Async thunks for cart operations with backend synchronization
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import * as cartAPI from '../../services/cartAPI'
import { getSafeErrorMessage } from '../../utils/errorHandler'

/**
 * Fetch cart from server
 */
export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.fetchCart()
      return response.data || response
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Add item to cart on server
 */
export const addToCartOnServer = createAsyncThunk(
  'cart/addToServer',
  async ({ productId, quantity, metadata = {} }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCartAPI(productId, quantity, metadata)
      return response.data || response
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Update cart item quantity on server
 */
export const updateCartItemOnServer = createAsyncThunk(
  'cart/updateOnServer',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItemAPI(itemId, quantity)
      return response.data || response
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Remove item from cart on server
 */
export const removeFromCartOnServer = createAsyncThunk(
  'cart/removeOnServer',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCartAPI(itemId)
      return { itemId, ...response.data } || { itemId }
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)

/**
 * Clear entire cart on server
 */
export const clearCartOnServer = createAsyncThunk(
  'cart/clearOnServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCartAPI()
      return response.data || response
    } catch (error) {
      return rejectWithValue(getSafeErrorMessage(error))
    }
  },
)
