import { createSlice } from '@reduxjs/toolkit'
import {
  fetchCartFromServer,
  addToCartOnServer,
  updateCartItemOnServer,
  removeFromCartOnServer,
  clearCartOnServer,
} from '../thunks/cartThunks'

// Initialize cart from localStorage
const storedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: storedCart,
    loading: false,
    error: null,
    synced: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
        })
      }
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateCartQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    setCart: (state, action) => {
      state.items = action.payload
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
  },
  extraReducers: (builder) => {
    // Fetch cart from server
    builder
      .addCase(fetchCartFromServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.synced = true
        localStorage.setItem('cart', JSON.stringify(state.items))
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Add to cart on server
    builder
      .addCase(addToCartOnServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCartOnServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || state.items
        state.synced = true
        localStorage.setItem('cart', JSON.stringify(state.items))
      })
      .addCase(addToCartOnServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update cart item on server
    builder
      .addCase(updateCartItemOnServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItemOnServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || state.items
        state.synced = true
        localStorage.setItem('cart', JSON.stringify(state.items))
      })
      .addCase(updateCartItemOnServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Remove from cart on server
    builder
      .addCase(removeFromCartOnServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCartOnServer.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || state.items
        state.synced = true
        localStorage.setItem('cart', JSON.stringify(state.items))
      })
      .addCase(removeFromCartOnServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Clear cart on server
    builder
      .addCase(clearCartOnServer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(clearCartOnServer.fulfilled, (state) => {
        state.loading = false
        state.items = []
        state.synced = true
        localStorage.setItem('cart', JSON.stringify(state.items))
      })
      .addCase(clearCartOnServer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, setCart } =
  cartSlice.actions

export default cartSlice.reducer
