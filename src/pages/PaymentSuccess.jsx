import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Loader, Clock, CreditCard } from 'lucide-react'
import { axiosInstance } from '../lib/axios'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const [orderData, setOrderData] = useState(null)

  const paymentID = searchParams.get('paymentID')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (paymentID) {
          const response = await axiosInstance.get(`/payment/status/${paymentID}`)
          setPaymentData(response.data.payment)

          // Fetch order data to get payment method
          if (response.data.payment?.order_id) {
            try {
              const orderResponse = await axiosInstance.get(
                `/order/${response.data.payment.order_id}`,
              )
              setOrderData(orderResponse.data.order)
            } catch (error) {
              console.error('Error fetching order data:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [paymentID])

  // Determine if this is COD (Cash on Delivery) or Online Payment
  const isCOD =
    paymentData?.payment_method === 'Cash on Delivery' ||
    paymentData?.payment_type === 'COD' ||
    orderData?.payment_method === 'Cash on Delivery'
  const isOnlinePayment =
    paymentData?.payment_method === 'Online' ||
    paymentData?.payment_type === 'Online' ||
    orderData?.payment_method === 'Online'

  if (loading) {
    return (
      <div className="payment-status-page">
        <div className="status-container">
          <div className="loading-spinner">
            <Loader className="w-12 h-12 animate-spin text-blue-600" />
          </div>
          <p>Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-status-page">
      <div className={`status-container ${isCOD ? 'pending-container' : 'success-container'}`}>
        {/* Status Icon */}
        <div className={`status-icon ${isCOD ? 'pending-icon' : 'success-icon'}`}>
          {isCOD ? (
            <Clock className="w-16 h-16 text-yellow-500" />
          ) : (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
        </div>

        {/* Title and Message */}
        <h1 className="status-title">{isCOD ? '✓ Order Confirmed!' : '✓ Payment Successful!'}</h1>

        <p className="status-message">
          {isCOD
            ? 'Thank you for your order. Payment will be collected upon delivery.'
            : 'Thank you for your payment. Your order has been confirmed.'}
        </p>

        {/* Order Details Card */}
        {paymentData && (
          <div className="payment-details bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="detail-header border-b border-gray-200 dark:border-gray-700 mb-4 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  📦
                </span>
                Order Summary
              </h2>
            </div>

            {/* Details Grid */}
            <div className="details-grid space-y-3">
              <div className="detail-row">
                <span className="label text-gray-600 dark:text-gray-400">Order ID:</span>
                <span className="value font-semibold text-gray-900 dark:text-white">
                  #{paymentData.order_id?.slice(-8) || paymentData.order_id}
                </span>
              </div>

              <div className="detail-row">
                <span className="label text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="value font-bold text-blue-600 dark:text-blue-400 text-lg">
                  ৳ {paymentData.amount?.toLocaleString() || 0}
                </span>
              </div>

              <div className="detail-row">
                <span className="label text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="value font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {isCOD ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Cash on Delivery (COD)
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-green-500" />
                      Online Payment
                    </>
                  )}
                </span>
              </div>

              {paymentData.transaction_id && (
                <div className="detail-row">
                  <span className="label text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="value font-mono text-sm text-gray-900 dark:text-white">
                    {paymentData.transaction_id}
                  </span>
                </div>
              )}

              <div className="detail-row">
                <span className="label text-gray-600 dark:text-gray-400">Payment Status:</span>
                <span
                  className={`value font-semibold flex items-center gap-2 ${
                    isCOD
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {isCOD ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Pending - Payment on Delivery
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Paid
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status-Specific Information */}
        <div
          className={`status-info p-4 rounded-lg border-l-4 ${
            isCOD
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
              : 'bg-green-50 dark:bg-green-900/20 border-green-500'
          }`}
        >
          <p
            className={`font-semibold ${isCOD ? 'text-yellow-800 dark:text-yellow-200' : 'text-green-800 dark:text-green-200'}`}
          >
            {isCOD ? '💰 Payment Information' : '📧 Confirmation Email'}
          </p>
          <p
            className={`text-sm mt-2 ${isCOD ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'}`}
          >
            {isCOD
              ? 'Please have the exact amount ready when our delivery personnel arrives. You can pay using cash.'
              : 'A confirmation email has been sent to your registered email address. You can track your order from the "My Orders" page.'}
          </p>
        </div>

        {/* Next Steps */}
        <div className="next-steps bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            📍 What happens next?
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
            <li>Your order is being prepared for shipment</li>
            <li>You'll receive a tracking number via email</li>
            <li>Check your order status in "My Orders" page</li>
            {isCOD && <li>Payment will be collected upon delivery</li>}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="status-actions flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
          >
            📦 View My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold flex items-center justify-center gap-2"
          >
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
