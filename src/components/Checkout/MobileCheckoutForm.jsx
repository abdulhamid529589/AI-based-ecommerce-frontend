import React, { useState } from 'react'
import { ChevronDown, Check, AlertCircle } from 'lucide-react'

/**
 * Mobile-optimized Checkout Form Component
 * Features:
 * - 16px minimum font size (prevents iOS auto-zoom)
 * - 44x44px minimum touch targets
 * - Single column layout on mobile
 * - Clear error messages with icons
 * - Responsive input groups
 */

const MobileCheckoutForm = ({
  shippingDetails,
  errors,
  handleShippingChange,
  divisions,
  getDistrictsByDivision,
  currentStep,
  onNextStep,
  onPrevStep,
}) => {
  const [expandedFields, setExpandedFields] = useState({})

  const toggleFieldExpand = (field) => {
    setExpandedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Get available districts for selected division
  const availableDistricts = shippingDetails.division
    ? getDistrictsByDivision(shippingDetails.division)
    : []

  return (
    <div className="w-full">
      {/* Step 1: Shipping Details */}
      {currentStep === 1 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Shipping Address
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Where should we deliver your order?
            </p>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={shippingDetails.fullName}
              onChange={handleShippingChange}
              placeholder="Enter your full name"
              className={`form-input ${errors.fullName ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {errors.fullName && (
              <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={shippingDetails.email}
              onChange={handleShippingChange}
              placeholder="your.email@example.com"
              className={`form-input ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
              readOnly
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={shippingDetails.phone}
              onChange={handleShippingChange}
              placeholder="+880 1XXXXXXXXX"
              inputMode="tel"
              className={`form-input ${errors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {errors.phone && (
              <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <textarea
              name="address"
              value={shippingDetails.address}
              onChange={handleShippingChange}
              placeholder="House number, street name, etc."
              rows="3"
              className={`form-textarea ${errors.address ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {errors.address && (
              <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.address}</span>
              </div>
            )}
          </div>

          {/* Division / State */}
          <div className="form-group">
            <label className="form-label">Division / State *</label>
            <div className="relative">
              <select
                name="division"
                value={shippingDetails.division}
                onChange={handleShippingChange}
                className={`form-select appearance-none pr-10 cursor-pointer ${
                  errors.division ? 'border-red-500 dark:border-red-500' : ''
                }`}
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
            </div>
            {errors.division && (
              <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.division}</span>
              </div>
            )}
          </div>

          {/* District / City */}
          {shippingDetails.division && (
            <div className="form-group">
              <label className="form-label">District / City *</label>
              <div className="relative">
                <select
                  name="district"
                  value={shippingDetails.district}
                  onChange={handleShippingChange}
                  className={`form-select appearance-none pr-10 cursor-pointer ${
                    errors.district ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
              </div>
              {errors.district && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.district}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onPrevStep}
              disabled
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-semibold rounded-lg min-h-[48px] cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={onNextStep}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg min-h-[48px] transition active:scale-95 flex items-center justify-center gap-2"
            >
              Continue
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method Selection */}
      {currentStep === 2 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Select Payment Method
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose how you want to pay for your order
            </p>
          </div>

          {/* This component receives payment methods as prop and handles selection */}
          <div className="space-y-3">{/* Payment methods will be injected here via props */}</div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onPrevStep}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg min-h-[48px] transition active:scale-95"
            >
              Back
            </button>
            <button
              onClick={onNextStep}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg min-h-[48px] transition active:scale-95 flex items-center justify-center gap-2"
            >
              Continue
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Review Your Order
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please verify all information before placing your order
            </p>
          </div>

          {/* Summary will be injected here */}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onPrevStep}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg min-h-[48px] transition active:scale-95"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg min-h-[48px] transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileCheckoutForm
