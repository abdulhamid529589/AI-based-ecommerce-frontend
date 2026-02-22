import { axiosInstance } from '../lib/axios'

/**
 * 🛒 CHECKOUT API THUNKS
 * Redux async thunks for SmartCheckout component integration
 * Handles order creation, payment processing, and order management
 */

// ============================================
// CREATE ORDER FROM CHECKOUT FORM
// ============================================
export const createCheckoutOrder = async (formData) => {
  try {
    // ✅ MEDIUM FIX: Only log in development to avoid exposing customer data
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Creating checkout order with data:', {
        email: formData.email,
        firstName: formData.firstName,
        itemCount: formData.cartItems?.length,
        total: formData.total,
      })
    }

    const response = await axiosInstance.post('/checkout/create-order', {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      paymentMethod: formData.paymentMethod,
      cardDetails: formData.cardDetails,
      cartItems: formData.cartItems,
      subtotal: formData.subtotal,
      shippingCost: formData.shippingCost,
      tax: formData.tax,
      total: formData.total,
      promoCode: formData.promoCode,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Order created successfully:', response.data.data.orderId)
    }
    return response.data
  } catch (error) {
    console.error('❌ Order creation failed:', error.response?.data?.message || error.message)
    throw error
  }
}

// ============================================
// PROCESS PAYMENT
// ============================================
export const processCheckoutPayment = async (paymentData) => {
  try {
    console.log('💳 Processing payment for order:', paymentData.orderId)

    const response = await axiosInstance.post('/checkout/process-payment', {
      orderId: paymentData.orderId,
      paymentMethod: paymentData.paymentMethod,
      cardDetails: paymentData.cardDetails,
      amount: paymentData.amount,
    })

    console.log('✅ Payment processed successfully')
    return response.data
  } catch (error) {
    console.error('❌ Payment processing failed:', error.response?.data || error.message)
    throw error
  }
}

// ============================================
// VALIDATE PROMO CODE
// ============================================
export const validatePromoCode = async (code, subtotal) => {
  try {
    console.log('🏷️ Validating promo code:', code)

    const response = await axiosInstance.get(`/checkout/validate-promo/${code}/${subtotal}`)

    console.log('✅ Promo validation complete:', response.data.valid)
    return response.data
  } catch (error) {
    console.error('❌ Promo validation failed:', error.response?.data || error.message)
    throw error
  }
}

// ============================================
// GET ORDER DETAILS
// ============================================
export const fetchOrderDetails = async (orderId) => {
  try {
    console.log('📋 Fetching order details:', orderId)

    const response = await axiosInstance.get(`/checkout/order/${orderId}`)

    console.log('✅ Order details retrieved')
    return response.data
  } catch (error) {
    console.error('❌ Order fetch failed:', error.response?.data || error.message)
    throw error
  }
}

// ============================================
// GET USER ORDERS
// ============================================
export const fetchUserOrders = async () => {
  try {
    console.log('📦 Fetching user orders')

    const response = await axiosInstance.get('/checkout/orders')

    console.log('✅ User orders retrieved:', response.data.data?.length)
    return response.data
  } catch (error) {
    console.error('❌ User orders fetch failed:', error.response?.data || error.message)
    throw error
  }
}

// ============================================
// TRACK ORDER
// ============================================
export const trackOrder = async (orderId) => {
  try {
    console.log('🚚 Tracking order:', orderId)

    const response = await axiosInstance.get(`/checkout/track/${orderId}`)

    console.log('✅ Order tracking retrieved')
    return response.data
  } catch (error) {
    console.error('❌ Order tracking failed:', error.response?.data || error.message)
    throw error
  }
}

// ============================================
// CANCEL ORDER
// ============================================
export const cancelOrder = async (orderId) => {
  try {
    console.log('🚫 Cancelling order:', orderId)

    const response = await axiosInstance.delete(`/checkout/cancel/${orderId}`)

    console.log('✅ Order cancelled successfully')
    return response.data
  } catch (error) {
    console.error('❌ Order cancellation failed:', error.response?.data || error.message)
    throw error
  }
}

// ============================================
// CALCULATE CHECKOUT TOTALS
// ============================================
export const calculateCheckoutTotals = (cartItems, shippingCost = 0, taxRate = 0.1) => {
  try {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * taxRate
    const total = subtotal + shippingCost + tax

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    }
  } catch (error) {
    console.error('❌ Total calculation error:', error.message)
    throw error
  }
}

// ============================================
// APPLY PROMO CODE DISCOUNT
// ============================================
export const applyPromoDiscount = (totals, discountPercent, discountAmount) => {
  try {
    let discount = 0

    if (discountPercent) {
      discount = (totals.subtotal * discountPercent) / 100
    } else if (discountAmount) {
      discount = discountAmount
    }

    const newTotal = Math.max(0, totals.total - discount)

    return {
      ...totals,
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(newTotal.toFixed(2)),
    }
  } catch (error) {
    console.error('❌ Discount calculation error:', error.message)
    throw error
  }
}

// ============================================
// FORMAT CHECKOUT DATA FOR SUBMISSION
// ============================================
export const formatCheckoutData = (formData, cartItems, totals) => {
  try {
    return {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      paymentMethod: formData.paymentMethod,
      cardDetails:
        formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card'
          ? {
              number: formData.cardNumber?.replace(/\s/g, '') || '',
              holder: formData.cardHolder || '',
              exp: formData.cardExpiry || '',
              cvv: formData.cardCvv || '',
            }
          : null,
      cartItems: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: totals.subtotal,
      shippingCost: totals.shippingCost,
      tax: totals.tax,
      total: totals.total,
      promoCode: formData.promoCode || null,
    }
  } catch (error) {
    console.error('❌ Format checkout data error:', error.message)
    throw error
  }
}

// ============================================
// VALIDATE CHECKOUT FORM DATA
// ============================================
export const validateCheckoutForm = (formData) => {
  const errors = {}

  // Email validation
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Valid email is required'
  }

  // Name validation
  if (!formData.firstName || formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
  }
  if (!formData.lastName || formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
  }

  // Phone validation (simple format)
  if (!formData.phone || !/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
    errors.phone = 'Valid phone number is required'
  }

  // Address validation
  if (!formData.streetAddress || formData.streetAddress.trim().length < 5) {
    errors.streetAddress = 'Street address is required'
  }
  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = 'City is required'
  }
  if (!formData.state || formData.state.trim().length < 2) {
    errors.state = 'State is required'
  }
  if (!formData.zipCode || formData.zipCode.trim().length < 2) {
    errors.zipCode = 'Zip code is required'
  }
  if (!formData.country) {
    errors.country = 'Country is required'
  }

  // Payment method validation
  if (!formData.paymentMethod) {
    errors.paymentMethod = 'Payment method is required'
  }

  // Card details validation for card payments
  if (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') {
    if (!formData.cardNumber || !/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Valid card number is required'
    }
    if (!formData.cardHolder || formData.cardHolder.trim().length < 3) {
      errors.cardHolder = 'Card holder name is required'
    }
    if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      errors.cardExpiry = 'Valid expiry date (MM/YY) is required'
    }
    if (!formData.cardCvv || !/^\d{3,4}$/.test(formData.cardCvv)) {
      errors.cardCvv = 'Valid CVV is required'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
