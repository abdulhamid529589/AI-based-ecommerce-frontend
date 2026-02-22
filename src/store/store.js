import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import popupReducer from './slices/popupSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import notificationReducer from './slices/notificationSlice'
import feedReducer from './slices/feedSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    product: productReducer,
    order: orderReducer,
    notifications: notificationReducer,
    feed: feedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializableCheck in development to avoid performance warnings
      // when state contains large objects (product images, large arrays, etc.)
      // It's enabled in production builds automatically
      serializableCheck: process.env.NODE_ENV === 'production',
    }),
})
