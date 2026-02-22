import React, { useState, useEffect } from 'react'
import { ChevronRight, MapPin, Phone, Mail, CreditCard, Truck, Lock } from 'lucide-react'
import './EnhancedCheckout.css'

const EnhancedCheckout = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Form validation
  const validateStep = (stepNum) => {
    const newErrors = {}

    if (stepNum === 1) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Valid email required'
      }
      if (!formData.phone || !/^[0-9]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Valid phone number required'
      }
    }

    if (stepNum === 2) {
      if (!formData.address) newErrors.address = 'Address required'
      if (!formData.city) newErrors.city = 'City required'
      if (!formData.zipCode) newErrors.zipCode = 'Zip code required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsLoading(true)
      try {
        // API call would go here
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Redirect to success page
      } catch (error) {
        console.error('Checkout error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const steps = [
    { num: 1, title: 'Contact', icon: Mail },
    { num: 2, title: 'Address', icon: MapPin },
    { num: 3, title: 'Payment', icon: CreditCard },
  ]

  return (
    <div className="enhanced-checkout">
      {/* Progress Bar */}
      <div className="checkout-progress">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        <div className="progress-steps">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`progress-step ${step >= s.num ? 'active' : ''} ${step === s.num ? 'current' : ''}`}
              onClick={() => {
                if (s.num < step) setStep(s.num)
              }}
            >
              <div className="step-number">{s.num}</div>
              <span className="step-title">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-container">
        {/* Main Content */}
        <div className="checkout-content">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="checkout-step active">
              <h2>Contact Information</h2>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+880 1234567890"
                  className={errors.phone ? 'error' : ''}
                  required
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Shipping Address */}
          {step === 2 && (
            <div className="checkout-step active">
              <h2>Shipping Address</h2>

              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={errors.address ? 'error' : ''}
                  required
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dhaka"
                    className={errors.city ? 'error' : ''}
                    required
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="1205"
                    className={errors.zipCode ? 'error' : ''}
                    required
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="checkout-step active">
              <h2>Payment Method</h2>

              <div className="payment-methods">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'bkash', label: 'bKash', icon: Phone },
                  { id: 'nagad', label: 'Nagad', icon: Phone },
                  { id: 'rocket', label: 'Rocket', icon: Phone },
                ].map((method) => (
                  <label key={method.id} className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option-content">
                      <method.icon size={20} />
                      <span>{method.label}</span>
                    </div>
                    {formData.paymentMethod === method.id && <span className="checkmark">✓</span>}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary (Sticky) */}
        <aside className="order-summary-sticky">
          <h3>Order Summary</h3>
          <div className="summary-items">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳ 5,200</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>৳ 100</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>৳ 520</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>৳ 5,820</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Action Buttons */}
      <div className="checkout-actions">
        {step > 1 && (
          <button className="btn-secondary" onClick={handlePrevStep}>
            ← Back
          </button>
        )}

        {step < 3 ? (
          <button className="btn-primary" onClick={handleNextStep}>
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" /> Processing...
              </>
            ) : (
              <>
                <Lock size={18} /> Complete Purchase
              </>
            )}
          </button>
        )}
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="badge">
          <Lock size={16} />
          <span>Secure Payment</span>
        </div>
        <div className="badge">
          <Truck size={16} />
          <span>Fast Shipping</span>
        </div>
        <div className="badge">
          <span>✓</span>
          <span>Money Back Guarantee</span>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCheckout
