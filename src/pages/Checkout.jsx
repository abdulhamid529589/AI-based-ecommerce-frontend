import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Loader, ShoppingCart, Truck, MapPin, CreditCard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../lib/axios'
import { useSystemSettings } from '../hooks/useSystemSettings'
import { toast } from 'react-toastify'
import { clearCart } from '../store/slices/cartSlice'
import { getOperationErrorMessage } from '../utils/errorHandler'
import { getShippingCostForDistrict, formatZoneDisplay } from '../utils/districtZoneMapping'

// Bangladesh Divisions and Districts (Complete list with all 64 districts)
// Reference: Bangladesh national administrative divisions
const BANGLADESH_DATA = {
  Dhaka: [
    'Dhaka',
    'Faridpur',
    'Gazipur',
    'Gopalganj',
    'Kishoreganj',
    'Madaripur',
    'Manikganj',
    'Munshiganj',
    'Narayanganj',
    'Narsingdi',
    'Rajbari',
    'Shariatpur',
    'Tangail',
  ],
  Chattogram: [
    'Chattogram',
    'Bandarban',
    'Brahmanbaria',
    'Chandpur',
    'Comilla',
    "Cox's Bazar",
    'Feni',
    'Khagrachhari',
    'Lakshmipur',
    'Noakhali',
    'Rangamati',
  ],
  Khulna: [
    'Bagerhat',
    'Chuadanga',
    'Jashore',
    'Jhenaidah',
    'Khulna',
    'Kushtia',
    'Magura',
    'Meherpur',
    'Narail',
    'Satkhira',
  ],
  Rajshahi: [
    'Bogura',
    'Joypurhat',
    'Naogaon',
    'Natore',
    'Chapai Nawabganj',
    'Pabna',
    'Rajshahi',
    'Sirajganj',
  ],
  Rangpur: [
    'Dinajpur',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Rangpur',
    'Thakurgaon',
  ],
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Sylhet: ['Habiganj', 'Maulvibazar', 'Sunamganj', 'Sylhet'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
}

const PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    icon: '💵',
    description: 'Pay when product arrives',
  },
  { id: 'bkash', name: 'bKash', icon: '📱', description: 'Mobile payment' },
  { id: 'nagad', name: 'Nagad', icon: '📱', description: 'Mobile payment' },
  { id: 'rocket', name: 'Rocket', icon: '🚀', description: 'Mobile payment' },
]

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { settings } = useSystemSettings()

  // State
  const [currentStep, setCurrentStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // User
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const cartItems = useSelector((state) => state.cart?.items || [])

  // Shipping form state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    division: '',
    district: '',
    country: 'Bangladesh',
  })

  // Track selected shipping zone
  const [selectedShippingZone, setSelectedShippingZone] = useState(null)

  // Validation errors
  const [errors, setErrors] = useState({})

  // Calculate shipping - Dynamic from settings with zone support
  const calculateShipping = () => {
    if (subtotal === 0) return 0
    if (!shippingDetails.district || shippingDetails.district.trim() === '') return 0

    // Check free shipping threshold from settings
    if (
      settings?.shipping?.freeShippingEnabled &&
      subtotal >= settings.shipping.freeShippingThreshold
    ) {
      return 0 // Free shipping
    }

    // Get zone-based shipping cost
    const zoneInfo = getShippingCostForDistrict(
      shippingDetails.district,
      settings?.shipping?.shippingZones || [],
    )

    if (zoneInfo.cost > 0) {
      console.log(
        `✅ [Checkout] Zone-based shipping for ${shippingDetails.district}: ৳${zoneInfo.cost} (${zoneInfo.zone?.name})`,
      )
      return zoneInfo.cost
    }

    // Fallback to standard shipping cost if zone not found
    console.log(`⚠️ [Checkout] No zone found for ${shippingDetails.district}, using standard cost`)
    return settings?.shipping?.standardShippingCost || 100
  }

  // Calculate totals
  const subtotal = (cartItems || []).reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = calculateShipping()

  // Dynamic tax rate from settings (defaults to 0 if not configured)
  const taxRate = settings?.pricing?.taxRate ?? 0
  const tax = Math.round(subtotal * (taxRate / 100))
  const total = subtotal + shipping + tax

  // Redirect if not authenticated or cart empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    setLoading(false)
  }, [isAuthenticated, cartItems, navigate])

  // Handle shipping details change
  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))

    // If district changes, update the selected shipping zone
    if (name === 'district' && value) {
      const zoneInfo = getShippingCostForDistrict(value, settings?.shipping?.shippingZones || [])
      setSelectedShippingZone(zoneInfo.zone || null)
      console.log(`📍 [Checkout] District changed to "${value}":`, {
        zoneName: zoneInfo.zone?.name,
        zoneCost: zoneInfo.zone?.cost,
        deliveryDays: zoneInfo.zone?.deliveryDays,
      })
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // Validate shipping details
  const validateShipping = () => {
    const newErrors = {}

    if (!shippingDetails.fullName.trim()) {
      newErrors.fullName = '👤 Please enter your full name'
    }
    if (!shippingDetails.phone.trim()) {
      newErrors.phone = '📱 Please enter your phone number'
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(shippingDetails.phone.replace(/\s/g, ''))) {
      newErrors.phone = '📱 Phone number should be at least 10 digits'
    }
    if (!shippingDetails.address.trim()) {
      newErrors.address = '🏠 Please enter your address'
    }
    if (!shippingDetails.division) {
      newErrors.division = '📍 Please select your division/state'
    }
    if (!shippingDetails.district) {
      newErrors.district = '📍 Please select your district/city'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShipping()) {
        setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (currentStep === 2) {
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle back step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Place order
  const handlePlaceOrder = async () => {
    // Validate all required information before processing
    if (!validateShipping()) {
      toast.error('⚠️ Please fill in all required shipping information before placing your order.')
      setSubmitting(false)
      return
    }

    if (cartItems.length === 0) {
      toast.error('❌ Your cart is empty. Please add items before placing an order.')
      setSubmitting(false)
      return
    }

    if (!paymentMethod) {
      toast.error('⚠️ Please select a payment method before placing your order.')
      setSubmitting(false)
      return
    }

    setSubmitting(true)

    try {
      console.log('🔹 [Checkout] Starting order placement...')
      console.log('🔹 [Checkout] User ID:', user?.id)
      console.log('🔹 [Checkout] Cart Items:', cartItems.length)
      console.log('🔹 [Checkout] Total:', total)

      // 🔒 Generate idempotency key to prevent duplicate charges
      const idempotencyKey = `order-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      console.log('🔹 [Checkout] Generated Idempotency Key:', idempotencyKey)

      // Format items
      const orderedItems = cartItems.map((item) => ({
        product: {
          id: item.id,
          images: [{ url: item.image }],
        },
        quantity: item.quantity,
      }))
      console.log('🔹 [Checkout] Formatted Items:', orderedItems)

      // Prepare order payload
      const orderPayload = {
        full_name: shippingDetails.fullName,
        phone: shippingDetails.phone,
        email: shippingDetails.email,
        address: shippingDetails.address,
        state: shippingDetails.division,
        city: shippingDetails.district,
        country: shippingDetails.country,
        pincode: '0000',
        orderedItems: orderedItems,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: 'pending',
        total_price: total,
        // Include shipping zone information for order tracking and customer service
        shippingZone: selectedShippingZone
          ? {
              name: selectedShippingZone.name,
              cost: selectedShippingZone.cost,
              deliveryDays: selectedShippingZone.deliveryDays,
            }
          : null,
        shippingCost: shipping,
        taxAmount: tax,
      }
      console.log('🔹 [Checkout] Order Payload:', JSON.stringify(orderPayload, null, 2))

      console.log('🔹 [Checkout] Sending POST to /order/new...')
      console.log('🔹 [Checkout] API Base URL:', axiosInstance.defaults.baseURL)

      // Create order (axios interceptor will add X-Idempotency-Key automatically)
      const orderResponse = await axiosInstance.post('/order/new', orderPayload)

      console.log('🔹 [Checkout] Response Status:', orderResponse.status)
      console.log('🔹 [Checkout] Response Data:', orderResponse.data)

      if (orderResponse.data.success) {
        const orderId = orderResponse.data.order?.id

        // Check if this was a cached response (duplicate)
        if (orderResponse.data.cached) {
          toast.info(
            '✓ Order confirmed - we found your previous order and processed it again. No duplicate charges will occur.',
          )
        } else {
          toast.success(
            '🎉 Order placed successfully! You will be redirected to order confirmation.',
          )
        }

        dispatch(clearCart())

        // Route based on payment method
        // Go to success page for all payment methods
        setTimeout(() => {
          navigate('/checkout/success', {
            state: {
              orderId: orderId,
              paymentMethod: paymentMethod,
              amount: total,
              shippingDetails,
            },
          })
        }, 1000)
      } else {
        console.error('🔹 [Checkout] Order failed:', orderResponse.data.message)
        const failureMessage =
          orderResponse.data.message || 'We were unable to process your order. Please try again.'
        toast.error('❌ ' + failureMessage)
      }
    } catch (error) {
      console.error('❌ [Checkout Error] Full Error Object:', error)
      console.error('❌ [Checkout Error] Error Message:', error.message)
      console.error('❌ [Checkout Error] Error Code:', error.code)
      console.error('❌ [Checkout Error] Error Status:', error.response?.status)
      console.error('❌ [Checkout Error] Error Data:', error.response?.data)
      console.error('❌ [Checkout Error] Error Response:', error.response)
      console.error('❌ [Checkout Error] Error Request:', error.request)

      // Determine user-friendly error message
      let errorMessage = 'Unable to place order. Please try again.'

      if (!error.response) {
        // Network error
        errorMessage = 'Connection failed. Please check your internet and try again.'
        console.error('❌ [Checkout Error] Network error - backend may be down')
      } else if (error.response.status === 401) {
        // Unauthorized
        errorMessage = 'Your session has expired. Please login again.'
      } else if (error.response.status === 403) {
        // Forbidden
        errorMessage =
          error.response.data?.message || 'You do not have permission to place this order.'
      } else if (error.response.status === 400) {
        // Bad request
        errorMessage =
          error.response.data?.message ||
          'Invalid order information. Please check your details and try again.'
      } else if (error.response.status === 500) {
        // Server error
        errorMessage = 'Server error. Please try again in a few moments.'
      } else if (error.response?.data?.message) {
        // Server provided message
        console.error('❌ [Checkout Error] Server Message:', error.response.data.message)
        errorMessage = error.response.data.message
      }

      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase in 3 simple steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-0">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step < currentStep ? <Check className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span>Payment</span>
            <span>Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* STEP 1: SHIPPING */}
            {currentStep === 1 && (
              <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-foreground">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingDetails.fullName}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="+880 1234567890"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleShippingChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.address
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your street address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Division */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Division *
                    </label>
                    <select
                      name="division"
                      value={shippingDetails.division}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.division
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Select Division</option>
                      {Object.keys(BANGLADESH_DATA).map((division) => (
                        <option key={division} value={division}>
                          {division}
                        </option>
                      ))}
                    </select>
                    {errors.division && (
                      <p className="text-red-500 text-xs mt-1">{errors.division}</p>
                    )}
                  </div>

                  {/* District */}
                  {shippingDetails.division && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        District *
                      </label>
                      <select
                        name="district"
                        value={shippingDetails.district}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 ${
                          errors.district
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      >
                        <option value="">Select District</option>
                        {BANGLADESH_DATA[shippingDetails.division]?.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                      )}
                      {/* Show selected shipping zone */}
                      {selectedShippingZone && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">📍 Shipping Zone:</span>{' '}
                            {selectedShippingZone.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-semibold">🚚 Shipping Cost:</span> ৳
                            {selectedShippingZone.cost}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-semibold">⏱️ Delivery:</span>{' '}
                            {selectedShippingZone.deliveryDays}
                          </p>
                        </div>
                      )}{' '}
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD */}
            {currentStep === 2 && (
              <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Dynamic Payment Methods from Settings */}
                  {(settings?.paymentMethods || PAYMENT_METHODS)
                    .filter((method) => method.enabled !== false)
                    .map((method) => {
                      // Map IDs to icon if not provided
                      const iconMap = {
                        cod: '💵',
                        bkash: '📱',
                        nagad: '📱',
                        rocket: '🚀',
                      }
                      const icon = method.icon || iconMap[method.id] || '💳'
                      const description =
                        method.description ||
                        {
                          cod: 'Pay when product arrives',
                          bkash: 'Mobile payment',
                          nagad: 'Mobile payment',
                          rocket: 'Mobile payment',
                        }[method.id] ||
                        ''

                      return (
                        <label
                          key={method.id}
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={paymentMethod === method.id}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-4 h-4 text-blue-600 cursor-pointer"
                            />
                            <span className="text-2xl ml-3">{icon}</span>
                            <div className="ml-4">
                              <p className="font-semibold text-foreground">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                </div>

                {/* Payment Info */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Selected Method:</strong>{' '}
                    {(settings?.paymentMethods || PAYMENT_METHODS).find(
                      (m) => m.id === paymentMethod,
                    )?.name || 'N/A'}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW ORDER */}
            {currentStep === 3 && (
              <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Check className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-foreground">Review Your Order</h2>
                </div>

                {/* Shipping Summary */}
                <div className="mb-6 pb-6 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
                  <p className="text-muted-foreground text-sm">
                    {shippingDetails.fullName}
                    <br />
                    {shippingDetails.address}
                    <br />
                    {shippingDetails.district}, {shippingDetails.division}
                    <br />
                    Bangladesh
                    <br />
                    {shippingDetails.phone}
                  </p>
                </div>

                {/* Payment Method Summary */}
                <div className="mb-6 pb-6 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
                  <p className="text-muted-foreground text-sm">
                    {settings?.paymentMethods?.find((m) => m.id === paymentMethod)?.name ||
                      PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name}
                  </p>
                </div>

                {/* Items Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-muted-foreground"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>

              {/* Items */}
              <div className="mb-4 pb-4 border-b dark:border-gray-700 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between mb-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Shipping:
                    {shipping === 0 && settings?.shipping?.freeShippingEnabled && (
                      <span className="ml-1 text-green-600 font-semibold">(Free)</span>
                    )}
                  </span>
                  <span>৳{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({taxRate}%):</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t dark:border-gray-700">
                  <span>Total:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-600" />
                  Secure checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-600" />
                  30-day returns
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-600" />
                  Free support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
