import React, { useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'
import { Truck, Clock, ShieldCheck } from 'lucide-react'
import { getOperationErrorMessage } from '../../utils/errorHandler'

/**
 * Cash on Delivery Payment Component
 * Handles COD payment method selection and order placement
 */
const CODPayment = ({ orderData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleCODPayment = async () => {
    try {
      if (!agreed) {
        toast.warning('Please agree to the terms and conditions')
        return
      }

      setLoading(true)

      // Create the order first
      const orderResponse = await axiosInstance.post('/order/new', {
        ...orderData,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
      })

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order')
      }

      const orderId = orderResponse.data.data.id

      // Initiate COD payment (just records COD in payments table)
      const paymentResponse = await axiosInstance.post('/payment/cod/initiate', {
        orderId: orderId,
        amount: orderData.totalPrice,
      })

      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.message || 'Failed to process COD')
      }

      toast.success('Order placed successfully! Payment due at delivery.')
      onSuccess(orderResponse.data.data)
    } catch (error) {
      const errorMessage = getOperationErrorMessage('placeOrder', error)
      toast.error(errorMessage)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 border-2 border-amber-200 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Truck className="w-6 h-6 text-amber-600" />
          Cash on Delivery
        </h3>
        <p className="text-gray-600">Pay securely when your order arrives at your doorstep</p>
      </div>

      {/* Benefits */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800">100% Safe & Secure</p>
            <p className="text-sm text-gray-600">No upfront payment required</p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800">Fast Delivery</p>
            <p className="text-sm text-gray-600">Typically delivered within 3-5 business days</p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Truck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800">Easy Returns</p>
            <p className="text-sm text-gray-600">No-questions-asked return policy within 14 days</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded-lg mb-6 border border-amber-100">
        <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>৳{(orderData.subtotal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping:</span>
            <span>৳{(orderData.shippingPrice || 0).toLocaleString()}</span>
          </div>
          {orderData.tax && (
            <div className="flex justify-between text-gray-600">
              <span>Tax:</span>
              <span>৳{orderData.tax.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-amber-700 pt-2 border-t border-gray-200">
            <span>Total Amount:</span>
            <span>৳{(orderData.totalPrice || 0).toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Amount due at delivery. No payment needed now.
          </p>
        </div>
      </div>

      {/* Terms & Conditions */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer hover:bg-white p-3 rounded transition">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-5 h-5 mt-1 accent-amber-600 cursor-pointer"
        />
        <span className="text-sm text-gray-700">
          I agree to the terms and conditions. I understand that I will pay the full amount{' '}
          <strong>৳{(orderData.totalPrice || 0).toLocaleString()}</strong> in <strong>cash</strong>{' '}
          when the order is delivered.
        </span>
      </label>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCODPayment}
          disabled={loading || !agreed}
          className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing Order...
            </>
          ) : (
            <>
              <Truck className="w-5 h-5" />
              Place Order - Pay at Delivery
            </>
          )}
        </button>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p>
            <strong>Next Step:</strong> Our delivery partner will contact you within 24 hours to
            confirm delivery details.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CODPayment
