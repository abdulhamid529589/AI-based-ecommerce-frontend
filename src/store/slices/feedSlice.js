import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'

/**
 * Feed Redux Slice
 * Manages personalized feed, recommendations, and user insights
 */

// Fetch personalized feed
export const fetchPersonalizedFeed = createAsyncThunk(
  'feed/fetchPersonalizedFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/feed')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed')
    }
  },
)

// Fetch product recommendations
export const fetchProductRecommendations = createAsyncThunk(
  'feed/fetchRecommendations',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/feed/recommendations/${productId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations')
    }
  },
)

// Fetch user insights
export const fetchUserInsights = createAsyncThunk(
  'feed/fetchUserInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/feed/insights')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch insights')
    }
  },
)

// Fetch wishlist insights
export const fetchWishlistInsights = createAsyncThunk(
  'feed/fetchWishlistInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/feed/wishlist-insights')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist insights')
    }
  },
)

const initialState = {
  feed: {
    items: [],
    sections: {
      recommended: 0,
      trending: 0,
      flashDeals: 0,
    },
    userPreferences: {
      favoriteCategories: [],
      priceRange: { min: 0, max: 100000 },
    },
  },
  recommendations: {
    products: [],
    frequentlyBoughtTogether: [],
  },
  insights: {
    purchaseStats: {
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      uniqueProducts: 0,
      firstPurchase: null,
      lastPurchase: null,
      memberSince: null,
    },
    favoriteCategories: [],
    spendingTrend: [],
  },
  wishlistInsights: {
    items: [],
    totalValue: 0,
    discountSavings: 0,
    recommendations: [],
  },
  loading: false,
  error: null,
  lastFetch: null,
}

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch personalized feed
    builder
      .addCase(fetchPersonalizedFeed.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPersonalizedFeed.fulfilled, (state, action) => {
        state.loading = false
        state.feed = action.payload || initialState.feed
        state.lastFetch = new Date().toISOString()
      })
      .addCase(fetchPersonalizedFeed.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch recommendations
    builder
      .addCase(fetchProductRecommendations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductRecommendations.fulfilled, (state, action) => {
        state.loading = false
        state.recommendations = action.payload || initialState.recommendations
      })
      .addCase(fetchProductRecommendations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch user insights
    builder
      .addCase(fetchUserInsights.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserInsights.fulfilled, (state, action) => {
        state.loading = false
        state.insights = action.payload || initialState.insights
      })
      .addCase(fetchUserInsights.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch wishlist insights
    builder
      .addCase(fetchWishlistInsights.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlistInsights.fulfilled, (state, action) => {
        state.loading = false
        state.wishlistInsights = action.payload || initialState.wishlistInsights
      })
      .addCase(fetchWishlistInsights.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default feedSlice.reducer
