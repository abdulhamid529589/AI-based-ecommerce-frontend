import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Loader, ShoppingCart, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { clearCart } from '../store/slices/cartSlice'
import { getOperationErrorMessage } from '../utils/errorHandler'
import { useSystemSettings } from '../hooks/useSystemSettings'

// Bangladesh Divisions and Districts
const BANGLADESH_DATA = {
  Dhaka: [
    'Dhaka',
    'Faridpur',
    'Gazipur',
    'Gopalganj',
    'Manikganj',
    'Munshiganj',
    'Narayanganj',
    'Shariatpur',
    'Tangail',
  ],
  Chittagong: [
    'Chittagong',
    'Bandarban',
    'Brahmanbaria',
    'Chandpur',
    'Comilla',
    "Cox's Bazar",
    'Feni',
    'Khagrachari',
    'Lakshmipur',
    'Noakhali',
    'Rangamati',
  ],
  Khulna: [
    'Bagerhat',
    'Chuadanga',
    'Jessore',
    'Jhenaidah',
    'Khulna',
    'Magura',
    'Narail',
    'Satkhira',
  ],
  Rajshahi: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Nawalpur', 'Rajshahi'],
  Barishal: ['Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
  Rangpur: [
    'Bogura',
    'Dinajpur',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Rangpur',
    'Thakurgaon',
  ],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
}

const Payment = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod') // bkash, nagad, cod
  const { user } = useSelector((state) => state.auth)
  const cartItems = useSelector((state) => state.cart?.items || [])

  // Get system settings (shipping, tax, pricing, etc.)
  const { settings, loading: settingsLoading } = useSystemSettings()

  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    division: '',
    district: '',
    country: 'Bangladesh',
  })

  // Calculate shipping based on district and settings
  const calculateShipping = () => {
    if (subtotal === 0) return 0

    // Only add shipping if a district is actually selected
    if (!shippingDetails.district || shippingDetails.district.trim() === '') {
      return 0
    }

    // Check if free shipping is enabled and threshold is met
    if (
      settings?.shipping?.freeShippingEnabled &&
      subtotal >= settings.shipping.freeShippingThreshold
    ) {
      return 0 // Free shipping
    }

    // Use standard shipping cost from settings
    return settings?.shipping?.standardShippingCost || 100
  }

  // Calculate totals
  const subtotal = (cartItems || []).reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = calculateShipping()
  const total = subtotal + shipping

  useEffect(() => {
    if (!user) {
      // Store the intended destination and redirect to login
      navigate('/login', { state: { from: { pathname: '/payment' } } })
      return
    }

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [user, cartItems, navigate])

  const handlePayment = async () => {
    if (paymentMethod === 'bkash') {
      toast.info('bKash payment instructions shown below')
      // Handle bKash payment
    } else if (paymentMethod === 'nagad') {
      toast.info('Nagad payment instructions shown below')
      // Handle Nagad payment
    } else if (paymentMethod === 'cod') {
      await handleCODPayment()
    }
  }

  // Validate shipping details
  const validateShippingDetails = () => {
    if (!shippingDetails.fullName.trim()) {
      toast.error('Please enter your full name')
      return false
    }
    if (!shippingDetails.phone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    if (!shippingDetails.address.trim()) {
      toast.error('Please enter your address')
      return false
    }
    if (!shippingDetails.division.trim()) {
      toast.error('Please select your division')
      return false
    }
    if (!shippingDetails.district.trim()) {
      toast.error('Please select your district')
      return false
    }
    return true
  }

  // Handle shipping details input change
  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle Cash on Delivery Payment
  const handleCODPayment = async () => {
    // Validate shipping details first
    if (!validateShippingDetails()) {
      return
    }

    setSubmitting(true)

    try {
      // First, place the order - format items according to backend expectations
      const orderedItems = cartItems.map((item) => ({
        product: {
          id: item.id,
          images: [{ url: item.image }],
        },
        quantity: item.quantity,
      }))

      const orderResponse = await axiosInstance.post('/order/new', {
        full_name: shippingDetails.fullName,
        phone: shippingDetails.phone,
        email: shippingDetails.email,
        address: shippingDetails.address,
        state: shippingDetails.division,
        city: shippingDetails.district,
        country: shippingDetails.country,
        pincode: '0000', // Backend requires this, using placeholder
        orderedItems: orderedItems,
        paymentMethod: 'COD',
      })

      if (orderResponse.data.success) {
        const orderId = orderResponse.data.order.id

        // For COD, order is already created, just proceed to success
        toast.success('Order placed successfully! Payment pending on delivery.')

        // Clear cart
        dispatch(clearCart())

        // Redirect to success page
        setTimeout(() => {
          navigate('/payment/success', {
            state: {
              orderId: orderId,
              paymentMethod: 'cod',
              amount: total,
            },
          })
        }, 1500)
      }
    } catch (error) {
      console.error('COD Payment Error:', error)
      toast.error(getOperationErrorMessage('placeOrder', error))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Loading payment page...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl py-12">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-2">Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart before proceeding to payment
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl py-8">
        {/* Back Button */}
        <Link
          to="/cart"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout & Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            {/* Payment Method Selection */}
            <div className="bg-card rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Select Payment Method</h2>

              <div className="space-y-3">
                {/* bKash Payment */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:border-blue-600 dark:hover:border-blue-400"
                  style={{ borderColor: paymentMethod === 'bkash' ? '#3b82f6' : '#e5e7eb' }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-foreground">bKash</p>
                    <p className="text-sm text-muted-foreground">
                      Bangladesh's leading mobile money service
                    </p>
                  </div>
                </label>

                {/* Nagad Payment */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:border-blue-600 dark:hover:border-blue-400"
                  style={{ borderColor: paymentMethod === 'nagad' ? '#3b82f6' : '#e5e7eb' }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="nagad"
                    checked={paymentMethod === 'nagad'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-foreground">Nagad</p>
                    <p className="text-sm text-muted-foreground">
                      Bangladesh's digital payment platform
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:border-blue-600 dark:hover:border-blue-400"
                  style={{ borderColor: paymentMethod === 'cod' ? '#3b82f6' : '#e5e7eb' }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-foreground">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Mobile Money Payment */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Payment Instructions
                </h2>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {paymentMethod === 'bkash'
                      ? 'Please dial *247# on your bKash registered phone number and follow the steps below:'
                      : 'Please dial *167# on your Nagad registered phone number and follow the steps below:'}
                  </p>

                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>Select "Send Money"</li>
                    <li>Enter our merchant number: 01XXX-XXXXX</li>
                    <li>Enter amount: ৳{total.toFixed(2)}</li>
                    <li>Enter your PIN and confirm</li>
                    <li>You'll receive a confirmation message</li>
                  </ol>
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter your transaction ID (TXN ID)"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={handlePayment}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === 'cod' && (
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Cash on Delivery</h2>

                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Truck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-200 mb-1">
                          Pay on Delivery
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          You can pay the delivery person when your order arrives at your doorstep.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Details Form */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-foreground">Shipping Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={shippingDetails.fullName}
                          onChange={handleShippingChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingDetails.email}
                          onChange={handleShippingChange}
                          placeholder="Enter your email"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Division
                        </label>
                        <select
                          name="division"
                          value={shippingDetails.division}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="">Select Division</option>
                          {Object.keys(BANGLADESH_DATA).map((division) => (
                            <option key={division} value={division}>
                              {division}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          District
                        </label>
                        <select
                          name="district"
                          value={shippingDetails.district}
                          onChange={handleShippingChange}
                          disabled={!shippingDetails.division}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-200 disabled:dark:bg-gray-600 disabled:cursor-not-allowed"
                        >
                          <option value="">Select District</option>
                          {shippingDetails.division &&
                            BANGLADESH_DATA[shippingDetails.division].map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingDetails.phone}
                          onChange={handleShippingChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Street Address
                      </label>
                      <textarea
                        name="address"
                        value={shippingDetails.address}
                        onChange={handleShippingChange}
                        placeholder="Enter your street address, apartment, etc."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={shippingDetails.country}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-600 text-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground">Order Summary</h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    {shippingDetails.district ? (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Shipping:</span>
                        <div className="text-right">
                          <div>{shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}</div>
                          {shipping > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {shippingDetails.district.toLowerCase() === 'chittagong' ||
                              shippingDetails.district.toLowerCase() === 'চট্টগ্রাম'
                                ? '(Chittagong rate: 60 taka)'
                                : '(Standard rate: 100 taka)'}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm text-muted-foreground italic">
                        <span>Shipping:</span>
                        <span>Select district to calculate</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-3 flex justify-between font-bold text-foreground">
                      <span>Total Amount:</span>
                      <span>৳{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
                    <p className="mb-2 font-semibold">How it works:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Place your order - payment method set to Cash on Delivery</li>
                      <li>We'll prepare and ship your order</li>
                      <li>Pay the delivery person in cash when order arrives</li>
                      <li>No online payment required</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleCODPayment}
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Place Order & Proceed
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">× {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {shippingDetails.district ? (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Shipping:</span>
                    <span className={shipping === 0 ? 'text-green-600 dark:text-green-400' : ''}>
                      {shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 italic">
                    <span>Shipping:</span>
                    <span>Select district to calculate</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mb-2">
                  Shipping To
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center mb-4">
                <p>
                  By continuing, you agree to our{' '}
                  <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
