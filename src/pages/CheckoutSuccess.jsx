import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Check, Download, Printer, MessageCircle, ArrowRight } from 'lucide-react'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { getPlaceholderImage } from '../utils/placeholderImage'

const CheckoutSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const { orderId, paymentMethod, amount, shippingDetails } = location.state || {}

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      navigate('/cart')
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/order/${orderId}`)
        if (response.data.success) {
          setOrderDetails(response.data.order)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('Could not load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate])

  const handlePrintInvoice = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    toast.info('Invoice download will be available soon')
  }

  const handleContactSupport = () => {
    toast.info('Opening WhatsApp chat...')
    // In production, link to WhatsApp
    window.open('https://wa.me/8801234567890', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Success Header */}
        <div className="mb-12">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Thank you for your order. We've received your purchase and will process it right away.
            </p>

            {/* Order Number */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 inline-block mb-6">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                {orderId}
              </p>
            </div>

            {/* Confirmation Email */}
            <p className="text-sm text-muted-foreground mb-8">
              A confirmation email has been sent to <strong>{shippingDetails?.email}</strong>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handlePrintInvoice}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print Invoice
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <button
                onClick={handleContactSupport}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Support
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Shipping Address</h2>
              <div className="text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">{shippingDetails?.fullName}</p>
                <p>{shippingDetails?.address}</p>
                <p>
                  {shippingDetails?.district}, {shippingDetails?.state}
                </p>
                <p>{shippingDetails?.country}</p>
                <p className="font-semibold text-foreground mt-3">{shippingDetails?.phone}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ৳{amount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Status:</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {paymentMethod === 'cod' ? 'Pending on Delivery' : 'Processing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {orderDetails && (
              <div className="bg-card rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {orderDetails.orderedItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b dark:border-gray-700 last:border-0"
                    >
                      <img
                        src={item.product.images?.[0]?.url || getPlaceholderImage('Order')}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          ৳{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Confirming Order</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We're verifying your order details
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Processing Payment
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {paymentMethod === 'cod'
                        ? 'Payment will be collected on delivery'
                        : 'Processing your payment'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Shipping</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your order will be packed and shipped soon
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Delivery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive your order at the provided address
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Summary */}
            <div className="bg-card rounded-lg shadow-lg p-6 sticky top-24 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 pb-4 border-b dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>৳{(amount * 0.95 * (100 / 105)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping:</span>
                  <span>৳{(amount * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax (5%):</span>
                  <span>৳{(amount * 0.05 * (100 / 105)).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>৳{amount?.toFixed(2)}</span>
              </div>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-center transition-colors"
              >
                Continue Shopping
              </Link>

              {/* View Orders */}
              <Link
                to="/orders"
                className="block w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold py-3 rounded-lg text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                View All Orders
              </Link>
            </div>

            {/* Support Card */}
            <div className="mt-6 bg-card rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our support team is ready to help you 24/7
              </p>
              <div className="space-y-2">
                <a
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  WhatsApp Support
                </a>
                <a
                  href="mailto:support@example.com"
                  className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none;
          }
          .print\:block {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}

export default CheckoutSuccess
