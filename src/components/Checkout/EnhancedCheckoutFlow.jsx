/**
 * 🎯 Enhanced Checkout Experience - INSANE UX
 * Features: One-page checkout, Progress indicator, Sticky summary, Auto-fill
 */

import React, { useState, useEffect } from 'react'
import { ChevronDown, MapPin, Phone, Mail, CreditCard, Loader } from 'lucide-react'
import './EnhancedCheckout.css'

const EnhancedCheckout = ({ cartItems, onPlaceOrder }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  // Form States
  const [formData, setFormData] = useState({
    // Shipping
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',

    // Billing
    sameAsShipping: true,
    billingAddress: '',

    // Payment
    paymentMethod: 'card',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = totalPrice > 2000 ? 0 : 100
  const tax = Math.round(totalPrice * 0.05)
  const finalTotal = totalPrice + shippingCost + tax

  // Form validation
  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'fullName':
        if (!value.trim()) newErrors.fullName = 'Name is required'
        else delete newErrors.fullName
        break
      case 'email':
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          newErrors.email = 'Invalid email address'
        } else delete newErrors.email
        break
      case 'phone':
        if (!value.match(/^\d{10,}$/)) {
          newErrors.phone = 'Invalid phone number'
        } else delete newErrors.phone
        break
      case 'address':
        if (!value.trim()) newErrors.address = 'Address is required'
        else delete newErrors.address
        break
      case 'cardNumber':
        if (!value.replace(/\s/g, '').match(/^\d{16}$/)) {
          newErrors.cardNumber = 'Invalid card number'
        } else delete newErrors.cardNumber
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const handleStepSubmit = (step) => {
    // Validate current step fields
    const stepFields = {
      1: ['fullName', 'email', 'phone', 'address'],
      2: ['billingAddress'],
      3: ['cardNumber'],
    }

    let isValid = true
    stepFields[step].forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false
        setTouched((prev) => ({ ...prev, [field]: true }))
      }
    })

    if (isValid && step < 3) {
      setCurrentStep(step + 1)
    } else if (step === 3 && isValid) {
      handlePlaceOrder()
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onPlaceOrder(formData)
    } catch (error) {
      console.error('Order failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="enhanced-checkout">
      <div className="checkout-container">
        {/* Mobile Toggle Summary */}
        <button className="summary-toggle" onClick={() => setShowSummary(!showSummary)}>
          <span>Order Summary (৳{finalTotal.toLocaleString()})</span>
          <ChevronDown size={20} />
        </button>

        <div className="checkout-content">
          {/* Left: Checkout Form */}
          <div className="checkout-form">
            {/* Progress Indicator */}
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentStep / 3) * 100}%` }} />
              </div>
              <div className="step-indicators">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    className={`step-indicator ${step === currentStep ? 'active' : ''} ${
                      step < currentStep ? 'completed' : ''
                    }`}
                    onClick={() => step < currentStep && setCurrentStep(step)}
                  >
                    <span className="step-number">{step < currentStep ? '✓' : step}</span>
                    <span className="step-label">
                      {['Shipping', 'Billing', 'Payment'][step - 1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="step-content animated">
                <h2 className="step-title">Shipping Information</h2>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="+880 1XXXXXXXXX"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Street address"
                    className={`form-input ${errors.address ? 'error' : ''}`}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="Zip code"
                      className="form-input"
                    />
                  </div>
                </div>

                <button className="btn-continue" onClick={() => handleStepSubmit(1)}>
                  Continue to Billing
                </button>
              </div>
            )}

            {/* Step 2: Billing Information */}
            {currentStep === 2 && (
              <div className="step-content animated">
                <h2 className="step-title">Billing Address</h2>

                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={formData.sameAsShipping}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sameAsShipping: e.target.checked,
                      }))
                    }
                  />
                  <span>Same as shipping address</span>
                </label>

                {!formData.sameAsShipping && (
                  <div className="form-group">
                    <label>Billing Address</label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Billing address"
                      className={`form-input ${errors.billingAddress ? 'error' : ''}`}
                    />
                  </div>
                )}

                <div className="step-actions">
                  <button className="btn-back" onClick={() => setCurrentStep(1)}>
                    Back
                  </button>
                  <button className="btn-continue" onClick={() => handleStepSubmit(2)}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div className="step-content animated">
                <h2 className="step-title">Payment Method</h2>

                <div className="payment-methods">
                  {['card', 'bkash', 'nagad'].map((method) => (
                    <label key={method} className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                      />
                      <span>{method.toUpperCase()}</span>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          maxLength="5"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="***"
                          maxLength="4"
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="step-actions">
                  <button className="btn-back" onClick={() => setCurrentStep(2)}>
                    Back
                  </button>
                  <button
                    className="btn-place-order"
                    onClick={() => handleStepSubmit(3)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="icon-loading" size={18} />
                        Processing...
                      </>
                    ) : (
                      `Place Order (৳${finalTotal.toLocaleString()})`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary (Sticky on Desktop) */}
          <div className={`order-summary ${showSummary ? 'visible' : ''}`}>
            <h3>Order Summary</h3>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳{totalPrice.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? 'free' : ''}>
                {shippingCost === 0 ? 'FREE' : `৳${shippingCost}`}
              </span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>৳{tax.toLocaleString()}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>৳{finalTotal.toLocaleString()}</span>
            </div>

            {shippingCost === 0 && (
              <div className="free-shipping-badge">✓ Free Shipping (Orders over ৳2000)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCheckout
