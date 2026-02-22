import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Loader,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { axiosInstance } from '../lib/axios'

const OrderTracking = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(`/order/${orderId}`)

      if (response.data.success) {
        setOrder(response.data.order)
      } else {
        setError('Order not found')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err.response?.data?.message || 'Failed to load order details')
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusSteps = () => {
    const steps = [
      {
        status: 'placed',
        label: 'Order Placed',
        icon: Package,
        description: 'Your order has been received',
      },
      {
        status: 'confirmed',
        label: 'Confirmed',
        icon: CheckCircle2,
        description: 'Order confirmed by seller',
      },
      { status: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
      {
        status: 'delivered',
        label: 'Delivered',
        icon: CheckCircle2,
        description: 'Order delivered successfully',
      },
    ]
    return steps
  }

  const getStatusIndex = (status) => {
    const statuses = ['placed', 'confirmed', 'shipped', 'delivered']
    return statuses.indexOf(status)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="bg-card rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  const steps = getStatusSteps()
  const currentStatusIndex = getStatusIndex(order.orderStatus || 'placed')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Order Header */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{order.totalAmount?.toFixed(2)}
              </p>
              <p
                className={`text-sm font-semibold ${
                  order.orderStatus === 'delivered'
                    ? 'text-green-600'
                    : order.orderStatus === 'shipped'
                      ? 'text-blue-600'
                      : 'text-yellow-600'
                }`}
              >
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex

                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    {/* Timeline Connector */}
                    {index > 0 && (
                      <div
                        className={`absolute top-6 -left-1/2 w-1/2 h-1 ${
                          index <= currentStatusIndex
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{ left: `${(index - 0.5) * (100 / (steps.length - 1))}%` }}
                      />
                    )}

                    {/* Step Circle */}
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-2 z-10 transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Step Label */}
                    <div className="text-center">
                      <p
                        className={`text-sm font-semibold ${
                          isCompleted
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status Update */}
          {order.statusUpdates && order.statusUpdates.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Latest Update:</strong> {order.statusUpdates[0]?.message}
              </p>
              {order.statusUpdates[0]?.timestamp && (
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {new Date(order.statusUpdates[0].timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p className="font-semibold">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.district}, {order.shippingAddress?.division}
              </p>
              <p>Bangladesh {order.shippingAddress?.postalCode}</p>
              {order.shippingAddress?.phone && (
                <p className="flex items-center gap-2 mt-3">
                  <Phone className="w-4 h-4" />
                  {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Delivery Information
            </h3>
            <div className="space-y-3 text-sm">
              {order.trackingNumber && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tracking Number</p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-white">
                    {order.trackingNumber}
                  </p>
                </div>
              )}

              {order.carrier && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Courier</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.carrier}</p>
                </div>
              )}

              {order.estimatedDeliveryDate && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Estimated Delivery
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {order.shippingMethod && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Shipping Method</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {order.shippingMethod}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>

          <div className="space-y-4">
            {order.items &&
              order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                    {item.variant && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Variant:{' '}
                        {Object.entries(item.variant)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ৳{item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Order Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-900 dark:text-white">
                ৳{(order.totalAmount - (order.shippingCost || 0) - (order.tax || 0)).toFixed(2)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount</span>
                <span>-৳{order.discount.toFixed(2)}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>৳{order.tax.toFixed(2)}</span>
              </div>
            )}
            {order.shippingCost > 0 && (
              <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>৳{order.shippingCost.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                ৳{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Payment Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Payment Method</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : order.paymentMethod === 'bkash'
                    ? 'bKash'
                    : order.paymentMethod === 'nagad'
                      ? 'Nagad'
                      : order.paymentMethod === 'rocket'
                        ? 'Rocket'
                        : order.paymentMethod}
              </p>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-400">Payment Status</p>
              <p
                className={`font-semibold ${
                  order.paymentStatus === 'paid'
                    ? 'text-green-600'
                    : order.paymentStatus === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center sm:justify-start">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Print Order
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
