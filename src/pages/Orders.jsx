import React, { useEffect, useState } from 'react'
import {
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  ArrowRight,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const { user } = useSelector((state) => state.auth)

  // Fetch orders on mount
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/order/orders/me')
      setOrders(response.data.myOrders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)

      // Better error handling
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
      } else if (error.response?.status === 400) {
        toast.error('Invalid request. Please try again.')
      } else {
        toast.error('Failed to load orders')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Package className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.order_status?.toLowerCase() === filter.toLowerCase())

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>
          <div className="flex flex-col items-center justify-center text-center py-12 bg-card rounded-lg">
            <Package className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-card text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status}
              {filter === status && <span className="ml-2">({filteredOrders.length})</span>}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No orders found with status "{filter}"
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        #{order.id?.slice(-8) || 'N/A'}
                      </h3>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.order_status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.order_status,
                        )}`}
                      >
                        {order.order_status || 'Processing'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                        Order Date
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Total</p>
                      <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        ৳{parseFloat(order.total_price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                        Payment Status
                      </p>
                      <p
                        className={`font-semibold ${
                          order.payment_status === 'Paid'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {order.payment_status || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Items</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.order_items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {order.order_items.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                          {item.title} × {item.quantity}
                        </p>
                      ))}
                      {order.order_items.length > 2 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          +{order.order_items.length - 2} more item(s)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
