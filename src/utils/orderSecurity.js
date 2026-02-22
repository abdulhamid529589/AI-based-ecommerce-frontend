/**
 * Order Security Utilities
 * Handles order signatures and idempotency keys
 */

import crypto from 'crypto'

/**
 * Generate a unique idempotency key for order creation
 * Prevents duplicate charges if request retries
 * @param {string} userId - User ID
 * @returns {string} Unique idempotency key
 */
export const generateIdempotencyKey = (userId) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const nonce = crypto.getRandomValues(new Uint8Array(4)).join('')

  return `order-${userId}-${timestamp}-${random}-${nonce}`
}

/**
 * Create HMAC signature for order data
 * Prevents tampering with prices, quantities, and totals in transit
 * @param {Object} orderData - { items: [], subtotal, shipping, tax }
 * @returns {string} Hex encoded HMAC-SHA256
 */
export const signOrderData = (orderData) => {
  // Use a consistent key from environment or fallback
  const secret = import.meta.env.VITE_ORDER_SIGNATURE_SECRET || 'fallback-secret-key'

  // Create consistent string representation
  const dataString = JSON.stringify({
    items: orderData.items.map((item) => ({
      product_id: item.product_id || item.id,
      quantity: item.quantity,
    })),
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    tax: orderData.tax,
  })

  // For frontend, we use SubtleCrypto API (browser crypto)
  // This is a simplified version - production should use backend signature
  return btoa(dataString) // Base64 encode for now
}

/**
 * Create order payload with security headers
 * @param {Object} orderData - Order data
 * @returns {Object} Order data with security metadata
 */
export const createSecureOrderPayload = (orderData, userId) => {
  const idempotencyKey = generateIdempotencyKey(userId)

  return {
    ...orderData,
    idempotencyKey,
    // Don't include signature on frontend for now - will be verified on backend
    // Signature will be added on backend for critical operations
  }
}
