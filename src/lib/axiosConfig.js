/**
 * Axios Configuration with Interceptors
 * Handles authentication, error handling, and retry logic
 */

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { handleAPIError } from '../utils/errorHandler'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * REQUEST INTERCEPTOR
 * - Adds authentication token to headers
 * - Adds CSRF token for state-changing requests
 * - Adds idempotency key for payment operations
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add CSRF token for state-changing requests
    const csrfToken = localStorage.getItem('csrfToken')
    if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method.toUpperCase())) {
      config.headers['X-CSRF-Token'] = csrfToken
    }

    // Add idempotency key for sensitive operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method.toUpperCase())) {
      if (!config.headers['X-Idempotency-Key']) {
        config.headers['X-Idempotency-Key'] = generateIdempotencyKey()
      }
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = uuidv4()

    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`)
      console.log('   Headers:', {
        Authorization: config.headers.Authorization ? '✅ Present' : '❌ Missing',
        'X-CSRF-Token': config.headers['X-CSRF-Token'] ? '✅ Present' : '❌ Missing',
        'X-Idempotency-Key': config.headers['X-Idempotency-Key'] ? '✅ Present' : '❌ Missing',
        'X-Request-ID': config.headers['X-Request-ID'] ? '✅ Present' : '❌ Missing',
      })
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  },
)

/**
 * RESPONSE INTERCEPTOR
 * - Handles token expiration and refresh
 * - Logs responses in development
 * - Standardizes error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 ${response.status} ${response.config.url}`)
      console.log('   Response:', response.data)
    }
    return response
  },
  async (error) => {
    console.error('❌ [Axios Interceptor] Error intercepted')
    console.error('   URL:', error.config?.url)
    console.error('   Method:', error.config?.method)
    console.error('   Message:', error.message)
    console.error('   Code:', error.code)
    console.error('   Status:', error.response?.status)
    console.error('   Headers Sent:', error.config?.headers)
    console.error('   Response Headers:', error.response?.headers)
    console.error('   Response Body:', error.response?.data)

    const originalRequest = error.config

    // Handle network errors (CORS, connection refused, etc)
    if (!error.response) {
      console.error('❌ [Axios] Network error - No response from server')
      console.error('   This could be: CORS issue, server down, timeout, or network blocked')
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Refreshing auth token...')
        }

        const response = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, {
          refreshToken,
        })

        const { token, refreshToken: newRefreshToken } = response.data.data

        localStorage.setItem('authToken', token)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Token refreshed successfully')
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // Clear tokens and redirect to login
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data)
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      console.warn('Rate limited. Please try again later.')
    }

    // Handle validation errors (422)
    if (error.response?.status === 422) {
      console.warn('Validation error:', error.response.data.fields)
    }

    const errorData = handleAPIError(error)
    return Promise.reject(errorData)
  },
)

/**
 * Generate unique idempotency key
 * Prevents duplicate operations (especially important for payments)
 * @returns {string} Unique idempotency key
 */
function generateIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export default axiosInstance
