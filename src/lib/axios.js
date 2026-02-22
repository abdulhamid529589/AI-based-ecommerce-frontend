import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/api/v1'
      : 'https://ai-based-ecommerce-website-backend.onrender.com/api/v1'),
  withCredentials: true,
})

/**
 * Generate unique idempotency key
 * Prevents duplicate operations (especially important for payments)
 */
const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 🔒 CSRF Token handling
let csrfToken = null
let csrfRefreshing = false

/**
 * Initialize CSRF token from server
 * Call this on app startup
 */
export const initializeCsrfToken = async () => {
  try {
    console.log('🔄 Fetching CSRF token...')
    const response = await axiosInstance.get('/csrf-token')
    csrfToken = response.data.csrfToken
    // Add to default headers for all requests
    axiosInstance.defaults.headers.common['X-CSRF-Token'] = csrfToken
    console.log('✅ CSRF token initialized:', csrfToken ? 'SUCCESS' : 'FAILED')
    return csrfToken
  } catch (error) {
    console.error('❌ Failed to fetch CSRF token:', error.message)
    return null
  }
}

/**
 * Refresh CSRF token when needed
 */
export const refreshCsrfToken = async () => {
  if (csrfRefreshing) {
    console.log('⏳ CSRF token already refreshing...')
    return csrfToken
  }

  csrfRefreshing = true
  try {
    console.log('🔄 Refreshing CSRF token...')
    await initializeCsrfToken()
  } finally {
    csrfRefreshing = false
  }
  return csrfToken
}

let isRefreshing = false
let refreshSubscribers = []

// Subscribe to token refresh
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token))
}

// Add request interceptor to attach token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    // Log auth state for reviews endpoint in development
    if (config.url?.includes('reviews') && process.env.NODE_ENV === 'development') {
      console.log(`📤 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        authHeader: config.headers.Authorization ? 'set' : 'missing',
      })
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.url?.includes('reviews')) {
      console.warn('⚠️ No accessToken in localStorage for reviews request')
    }

    // Ensure CSRF token is in headers AND body for state-changing methods
    const isStateChanging = ['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase())
    if (isStateChanging && csrfToken) {
      // Send in header
      config.headers['X-CSRF-Token'] = csrfToken

      // Also send in body as _csrf for fallback
      if (config.data && typeof config.data === 'object') {
        config.data._csrf = csrfToken
      }
    }

    // 🔒 Add idempotency key for state-changing requests to prevent duplicates
    if (isStateChanging) {
      if (!config.headers['X-Idempotency-Key']) {
        config.headers['X-Idempotency-Key'] = generateIdempotencyKey()
      }
    }

    // 🔍 Add request ID for tracking
    config.headers['X-Request-ID'] = uuidv4()

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle token refresh on 401 and CSRF errors on 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Log errors for reviews endpoint
    if (error.config?.url?.includes('reviews')) {
      console.error(
        `❌ [RESPONSE ERROR] ${error.config.method?.toUpperCase()} ${error.config.url}`,
        {
          status: error.response?.status,
          statusText: error.response?.statusText,
          code: error.response?.data?.code,
          message: error.response?.data?.message,
          data: error.response?.data,
        },
      )
    }

    // Handle CSRF token failures (403 with CSRF_FAILED code)
    if (error.response?.status === 403 && error.response?.data?.code === 'CSRF_FAILED') {
      if (!originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true
        console.log('🔄 CSRF token expired, refreshing...')

        // Refresh CSRF token
        await refreshCsrfToken()

        // Retry original request with new token
        return axiosInstance(originalRequest)
      }
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // If token is already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      // Start token refresh
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true },
        )

        if (response.data && response.data.accessToken) {
          const newAccessToken = response.data.accessToken

          // Update stored token
          localStorage.setItem('accessToken', newAccessToken)

          // Update token expiration time (15 minutes from now)
          localStorage.setItem('tokenExpiresAt', new Date(Date.now() + 15 * 60 * 1000).getTime())

          // Update axios default header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

          // Update original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          // Notify all queued requests
          onRefreshed(newAccessToken)
          refreshSubscribers = []

          isRefreshing = false

          // Retry original request
          return axiosInstance(originalRequest)
        }

        // Refresh failed
        isRefreshing = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(error)
      } catch (refreshError) {
        // Token refresh failed, clear storage and redirect to login
        isRefreshing = false
        refreshSubscribers = []
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // If token is expired/invalid and we can't refresh, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
