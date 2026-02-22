import React, { useState } from 'react'
import './SmartCheckout.css'
import {
  createCheckoutOrder,
  processCheckoutPayment,
  validatePromoCode,
  calculateCheckoutTotals,
  formatCheckoutData,
  validateCheckoutForm,
} from '../../services/checkoutAPI.js'

/**
 * Smart Checkout Component - Phase 4
 * Features: One-page checkout, address autocomplete, multiple payment methods
 * Integrates with checkout backend API
 */
const SmartCheckout = ({ cartItems = [], onCheckout }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvv: '',
    promoCode: '',
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  // Calculate totals
  const totals = calculateCheckoutTotals(cartItems, 0, 0.1)
  const shipping = totals.subtotal > 50 ? 0 : 9.99
  const finalTotals = {
    ...totals,
    shippingCost: shipping,
    total: totals.subtotal + shipping + totals.tax - promoDiscount,
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // Apply promo code
  const handleApplyPromo = async () => {
    if (!formData.promoCode) return

    try {
      const result = await validatePromoCode(formData.promoCode, totals.subtotal)
      if (result.valid) {
        const discount = result.data.calculatedDiscount
        setPromoDiscount(discount)
        alert(`✅ Promo code applied! You saved $${discount.toFixed(2)}`)
      } else {
        alert(`❌ ${result.message}`)
      }
    } catch (error) {
      alert('Failed to validate promo code')
    }
  }

  // Validate current step
  const validateStep = () => {
    const validation = validateCheckoutForm(formData)

    if (currentStep === 1) {
      // Validate only step 1 fields
      const step1Errors = {
        email: validation.errors.email,
        firstName: validation.errors.firstName,
        lastName: validation.errors.lastName,
        phone: validation.errors.phone,
      }
      setErrors(step1Errors)
      return (
        !step1Errors.email && !step1Errors.firstName && !step1Errors.lastName && !step1Errors.phone
      )
    }

    if (currentStep === 2) {
      // Validate only step 2 fields
      const step2Errors = {
        streetAddress: validation.errors.streetAddress,
        city: validation.errors.city,
        state: validation.errors.state,
        zipCode: validation.errors.zipCode,
        country: validation.errors.country,
      }
      setErrors(step2Errors)
      return (
        !step2Errors.streetAddress &&
        !step2Errors.city &&
        !step2Errors.state &&
        !step2Errors.zipCode &&
        !step2Errors.country
      )
    }

    if (currentStep === 3) {
      // Validate only step 3 fields
      const step3Errors = {
        paymentMethod: validation.errors.paymentMethod,
        cardNumber: validation.errors.cardNumber,
        cardHolder: validation.errors.cardHolder,
        cardExpiry: validation.errors.cardExpiry,
        cardCvv: validation.errors.cardCvv,
      }
      setErrors(step3Errors)
      const hasErrors = Object.values(step3Errors).some((err) => err)
      return !hasErrors
    }

    return true
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Handle place order with API integration
  const handlePlaceOrder = async () => {
    if (!validateStep()) return

    setIsProcessing(true)
    try {
      console.log('🛒 Starting checkout process...')

      // Step 1: Create order
      const formattedData = formatCheckoutData(formData, cartItems, finalTotals)
      const orderResponse = await createCheckoutOrder(formattedData)

      if (!orderResponse.success) {
        throw new Error(orderResponse.message)
      }

      const orderId = orderResponse.data.orderId
      console.log('✅ Order created:', orderId)

      // Step 2: Process payment
      const paymentResponse = await processCheckoutPayment({
        orderId,
        paymentMethod: formData.paymentMethod,
        cardDetails: {
          number: formData.cardNumber,
          holder: formData.cardHolder,
          exp: formData.cardExpiry,
          cvv: formData.cardCvv,
        },
        amount: finalTotals.total,
      })

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message)
      }

      console.log('✅ Payment processed successfully')

      // Callback to parent component
      onCheckout?.({
        ...formData,
        orderId,
        paymentStatus: paymentResponse.data.paymentStatus,
      })

      alert('✅ Order placed successfully! Your order ID: ' + orderId)
    } catch (error) {
      console.error('❌ Checkout error:', error.message)
      alert('❌ Checkout failed: ' + error.message)
      setErrors({ submit: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="smart-checkout">
      <div className="checkout-container">
        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 ? 'Shipping' : step === 2 ? 'Address' : 'Payment'}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="checkout-content">
          {/* Step 1: Shipping Info */}
          {currentStep === 1 && (
            <div className="step-content">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="step-content">
              <h2>Delivery Address</h2>
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={errors.streetAddress ? 'error' : ''}
                />
                {errors.streetAddress && <span className="error-text">{errors.streetAddress}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="00000"
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={formData.country} onChange={handleInputChange}>
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="MX">Mexico</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="step-content">
              <h2>Payment Method</h2>

              {/* Payment Method Selector */}
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleInputChange}
                  />
                  <span>💳 Credit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debit_card"
                    checked={formData.paymentMethod === 'debit_card'}
                    onChange={handleInputChange}
                  />
                  <span>💳 Debit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  <span>🅿️ PayPal</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple_pay"
                    checked={formData.paymentMethod === 'apple_pay'}
                    onChange={handleInputChange}
                  />
                  <span>🍎 Apple Pay</span>
                </label>
              </div>

              {/* Card Details */}
              {(formData.paymentMethod === 'credit_card' ||
                formData.paymentMethod === 'debit_card') && (
                <>
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>Card Holder Name *</label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={errors.cardHolder ? 'error' : ''}
                    />
                    {errors.cardHolder && <span className="error-text">{errors.cardHolder}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.cardExpiry ? 'error' : ''}
                      />
                      {errors.cardExpiry && <span className="error-text">{errors.cardExpiry}</span>}
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className={errors.cardCvv ? 'error' : ''}
                      />
                      {errors.cardCvv && <span className="error-text">{errors.cardCvv}</span>}
                    </div>
                  </div>
                </>
              )}

              {/* Promo Code */}
              <div className="form-group">
                <label>Promo Code (Optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    placeholder="Enter promo code"
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleApplyPromo}
                    style={{ padding: '8px 16px' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="checkout-buttons">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={handlePrevStep}>
                ← Back
              </button>
            )}
            {currentStep < 3 ? (
              <button className="btn-primary" onClick={handleNextStep}>
                Next →
              </button>
            ) : (
              <button className="btn-primary" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          {/* Cart Items */}
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          {/* Totals */}
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${finalTotals.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {finalTotals.shippingCost === 0
                  ? 'FREE'
                  : `$${finalTotals.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${finalTotals.tax.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-${promoDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>${finalTotals.total.toFixed(2)}</span>
          </div>

          {/* Trust Badges */}
          <div className="trust-section">
            <div className="trust-badge">🔒 Secure Checkout</div>
            <div className="trust-badge">✓ Money-back Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartCheckout
