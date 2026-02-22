import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'

/**
 * Enhanced error logging utility
 */
const logProductError = (operation, error, context = {}) => {
  console.error(`❌ Product Error [${operation}]:`, {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    context,
    timestamp: new Date().toISOString(),
  })
}

// Async thunk to fetch all products
export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  // params: { page, limit, search, category, subcategory, price, ratings }
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams()
      if (params.page) query.set('page', params.page)
      if (params.limit) query.set('limit', params.limit)
      if (params.search) query.set('search', params.search)
      if (params.category) query.set('category', params.category)
      if (params.subcategory) query.set('subcategory', params.subcategory)
      if (params.price) query.set('price', params.price)
      if (params.ratings) query.set('ratings', params.ratings)

      const url = `/product/?${query.toString()}`
      console.log(`📦 Fetching products from: ${url}`)

      const response = await axiosInstance.get(url)

      // Handle both response structures: { data: {...} } and { products: [...] }
      const responseData = response.data.data || response.data

      console.log('✅ Products fetched successfully:', {
        count: responseData.products?.length || 0,
        total: responseData.totalProducts || 0,
      })

      return {
        products: responseData.products || [],
        totalProducts: responseData.totalProducts || 0,
        newProducts: responseData.newProducts || [],
        topRatedProducts: responseData.topRatedProducts || [],
      }
    } catch (error) {
      logProductError('FETCH_ALL_PRODUCTS', error, { params })

      // Provide structured error response
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch products'
      const errorCode = error.response?.status || 'UNKNOWN'

      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        details: error.response?.data,
      })
    }
  },
)

// Async thunk to fetch single product
export const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingleProduct',
  async (productId, { rejectWithValue }) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required')
      }

      const url = `/product/singleProduct/${productId}`
      console.log(`📖 Fetching single product: ${url}`)

      const response = await axiosInstance.get(url)

      // Handle both response structures
      const responseData = response.data.data || response.data

      console.log('✅ Single product fetched successfully:', {
        id: responseData.id,
        name: responseData.name,
        reviews: responseData.reviews?.length || 0,
      })

      return responseData
    } catch (error) {
      logProductError('FETCH_SINGLE_PRODUCT', error, { productId })

      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch product details'
      const errorCode = error.response?.status || 'UNKNOWN'

      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        productId,
        details: error.response?.data,
      })
    }
  },
)

// Async thunk to post review
export const postProductReview = createAsyncThunk(
  'product/postProductReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      if (!productId || !rating) {
        throw new Error('Product ID and rating are required')
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }

      const url = `/product/post-new/review/${productId}`
      console.log(`⭐ Posting review for product ${productId}:`, { rating, comment })

      const response = await axiosInstance.put(url, {
        rating,
        comment,
      })

      console.log('✅ Review posted successfully')

      return response.data
    } catch (error) {
      logProductError('POST_REVIEW', error, { productId, rating })

      const errorMessage = error.response?.data?.message || error.message || 'Failed to post review'
      const errorCode = error.response?.status || 'UNKNOWN'

      // Show user-friendly toast notification
      toast.error(errorMessage)

      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        productId,
        details: error.response?.data,
      })
    }
  },
)

// Async thunk to delete review
export const deleteReview = createAsyncThunk(
  'product/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      if (!reviewId) {
        throw new Error('Review ID is required')
      }

      const url = `/product/delete/review/${reviewId}`
      console.log(`🗑️ Deleting review: ${url}`)

      const response = await axiosInstance.delete(url)

      console.log('✅ Review deleted successfully')

      return response.data
    } catch (error) {
      logProductError('DELETE_REVIEW', error, { reviewId })

      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete review'
      const errorCode = error.response?.status || 'UNKNOWN'

      toast.error(errorMessage)

      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        reviewId,
        details: error.response?.data,
      })
    }
  },
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    products: [],
    productDetails: null,
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
    error: null,
    errorCode: null,
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
        state.errorCode = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.products = action.payload.products || []
        state.totalProducts = action.payload.totalProducts || state.products.length
        state.topRatedProducts = action.payload.topRatedProducts || []
        state.newProducts = action.payload.newProducts || []
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false
        const payload = action.payload
        state.error =
          typeof payload === 'string' ? payload : payload?.message || 'Failed to fetch products'
        state.errorCode = payload?.code || 'UNKNOWN'
        state.products = []
        state.totalProducts = 0
        console.error('❌ Failed to fetch products:', state.error)
      })

    // Fetch single product
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true
        state.error = null
        state.errorCode = null
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.productDetails = action.payload
        state.productReviews = action.payload.reviews || []
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false
        const payload = action.payload
        state.error =
          typeof payload === 'string' ? payload : payload?.message || 'Failed to fetch product'
        state.errorCode = payload?.code || 'UNKNOWN'
        console.error('❌ Failed to fetch product:', state.error)
      })

    // Post review
    builder
      .addCase(postProductReview.pending, (state) => {
        state.isPostingReview = true
        state.error = null
      })
      .addCase(postProductReview.fulfilled, (state, action) => {
        state.isPostingReview = false
        state.error = null
        // Update product details and reviews after posting
        if (action.payload.product) {
          state.productDetails = {
            ...state.productDetails,
            ...action.payload.product,
            reviews: action.payload.reviews || [],
          }
        }
        state.productReviews = action.payload.reviews || []
        toast.success('Review posted successfully!')
      })
      .addCase(postProductReview.rejected, (state, action) => {
        state.isPostingReview = false
        const payload = action.payload
        state.error =
          typeof payload === 'string' ? payload : payload?.message || 'Failed to post review'
        console.error('❌ Failed to post review:', state.error)
      })

    // Delete review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true
        state.error = null
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false
        state.error = null
        // Update product details and reviews after deleting
        if (action.payload.product) {
          state.productDetails = {
            ...state.productDetails,
            ...action.payload.product,
            reviews: action.payload.reviews || [],
          }
        }
        state.productReviews = action.payload.reviews || []
        toast.success('Review deleted successfully!')
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isReviewDeleting = false
        const payload = action.payload
        state.error =
          typeof payload === 'string' ? payload : payload?.message || 'Failed to delete review'
        console.error('❌ Failed to delete review:', state.error)
        state.isReviewDeleting = false
      })
  },
})

export default productSlice.reducer
