import { createSlice } from '@reduxjs/toolkit'
import {
  fetchWishlistFromServer,
  addToWishlistOnServer,
  removeFromWishlistOnServer,
  getWishlistCountFromServer,
} from '../thunks/wishlistThunks'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [],
    count: 0,
    loading: false,
    error: null,
    synced: false,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((wishlistItem) => wishlistItem.id === item.id)

      if (!existingItem) {
        state.items.push({
          ...item,
          addedAt: new Date().toISOString(),
        })
      }
      // Persist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      // Persist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      // Persist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist from server
    builder
      .addCase(fetchWishlistFromServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlistFromServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.synced = true
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      })
      .addCase(fetchWishlistFromServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Add to wishlist on server
    builder
      .addCase(addToWishlistOnServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToWishlistOnServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || state.items
        state.synced = true
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      })
      .addCase(addToWishlistOnServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Remove from wishlist on server
    builder
      .addCase(removeFromWishlistOnServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromWishlistOnServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || state.items
        state.synced = true
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      })
      .addCase(removeFromWishlistOnServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Get wishlist count from server
    builder
      .addCase(getWishlistCountFromServer.pending, (state) => {
        state.loading = true
      })
      .addCase(getWishlistCountFromServer.fulfilled, (state, action) => {
        state.loading = false
        state.count = action.payload
      })
      .addCase(getWishlistCountFromServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
