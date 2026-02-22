import { Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useMemo, useEffect } from 'react'
import { updateCartQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice'
import {
  fetchCartFromServer,
  removeFromCartOnServer,
  updateCartItemOnServer,
  clearCartOnServer,
} from '../store/thunks/cartThunks'
import { toast } from 'react-toastify'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartState = useSelector((state) => state.cart, shallowEqual)
  const cartItems = useMemo(() => cartState?.items || [], [cartState])
  const isLoading = cartState?.loading || false

  // Fetch cart from server on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(fetchCartFromServer())
    }
  }, [dispatch])

  // Calculate totals
  const subtotal = (cartItems || []).reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Shipping cost will be added after selecting district during payment
  const total = subtotal + shipping

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ id: itemId, quantity: newQuantity }))
      // Sync with backend
      const token = localStorage.getItem('authToken')
      if (token) {
        dispatch(updateCartItemOnServer({ itemId, quantity: newQuantity }))
      }
    }
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId))
    // Sync with backend
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(removeFromCartOnServer(itemId))
    }
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart())
      // Sync with backend
      const token = localStorage.getItem('authToken')
      if (token) {
        dispatch(clearCartOnServer())
      }
      toast.success('Cart cleared')
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty')
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
            <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              Add items to your cart to continue shopping
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition active:scale-95 min-h-[44px]"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8 sm:pb-12">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center gap-3">
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  {cartItems.length} item(s) in cart
                </p>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs sm:text-sm font-semibold transition active:scale-95"
                >
                  Clear
                </button>
              </div>

              {/* Items - Mobile Card Layout on small screens */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {/* Image */}
                    <div className="sm:col-span-1">
                      <Link to={`/product/${item.id}`}>
                        <div className="w-full sm:w-24 h-40 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition"
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Details */}
                    <div className="sm:col-span-2">
                      <Link to={`/product/${item.id}`} className="block group">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 text-sm sm:text-base">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-2">
                        ৳
                        {(item.price * item.quantity).toLocaleString('en-BD', {
                          maximumFractionDigits: 0,
                        })}
                      </p>

                      {/* Mobile: Show quantity here */}
                      <div className="sm:hidden flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Qty:</span>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2 sm:px-3 font-semibold text-gray-900 dark:text-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button - Mobile */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="sm:hidden text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-semibold transition active:scale-95"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Quantity Control - Desktop only */}
                    <div className="hidden sm:flex sm:col-span-1 flex-col items-end gap-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 sm:px-4 font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-semibold transition active:scale-95"
                      >
                        Remove
                      </button>

                      {/* Unit Price */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ৳{item.price.toLocaleString('en-BD', { maximumFractionDigits: 0 })} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary - Sticky on mobile bottom */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow p-4 sm:p-6 sticky bottom-0 lg:top-24 lg:bottom-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ৳{subtotal.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 italic text-xs sm:text-sm">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>৳{total.toLocaleString('en-BD', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition mb-3 active:scale-95 min-h-[48px] text-base sm:text-lg"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block w-full py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 text-center transition active:scale-95 min-h-[48px] flex items-center justify-center text-base sm:text-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
