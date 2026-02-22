import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  User,
  MapPin,
  ShoppingBag,
  Lock,
  Bell,
  Heart,
  Camera,
  ChevronRight,
  LogOut,
  Loader,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { axiosInstance } from '../lib/axios'
import { logout } from '../store/slices/authSlice'
import { getOperationErrorMessage } from '../utils/errorHandler'

const UserProfile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    orderUpdates: true,
  })

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    setProfileLoading(true)
    try {
      // Initialize form with user data
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || '',
      })

      // Fetch orders - use correct order endpoint
      try {
        const ordersResponse = await axiosInstance.get('/order/orders/me')
        if (ordersResponse.data?.myOrders) {
          setOrders(ordersResponse.data.myOrders || [])
        } else if (ordersResponse.data?.success) {
          setOrders(ordersResponse.data.orders || [])
        } else if (ordersResponse.data?.data) {
          // Handle different response format
          setOrders(Array.isArray(ordersResponse.data.data) ? ordersResponse.data.data : [])
        }
      } catch (err) {
        console.log('Orders fetch failed:', err.message)
        setOrders([]) // Set empty array on error
      }

      // Fetch addresses from backend
      try {
        const addressesResponse = await axiosInstance.get('/auth/addresses')
        if (addressesResponse.data?.addresses) {
          setAddresses(addressesResponse.data.addresses)
        } else if (addressesResponse.data?.data) {
          setAddresses(
            Array.isArray(addressesResponse.data.data) ? addressesResponse.data.data : [],
          )
        } else {
          setAddresses([])
        }
      } catch (err) {
        console.log('Addresses fetch failed:', err.message)
        setAddresses([])
      }

      // Wishlist is managed by Redux, so we don't need to fetch separately
      // The Redux store is already updated via wishlist actions
      setWishlist([])
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Don't show toast error as we're handling individual endpoint errors gracefully
    } finally {
      setProfileLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const formDataObj = new FormData()
      formDataObj.append('avatar', file)

      try {
        setLoading(true)
        const response = await axiosInstance.post('/user/update-avatar', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            avatar: response.data.avatarUrl,
          }))
          toast.success('Avatar updated successfully!')
        }
      } catch (error) {
        console.error('Avatar upload error:', error)
        toast.error('Failed to upload avatar')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await axiosInstance.put('/user/update-profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      })

      if (response.data.success) {
        toast.success('Profile updated successfully!')
        // Update Redux store would go here
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(getOperationErrorMessage('updateProfile', error))
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      if (response.data.success) {
        toast.success('Password changed successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error(getOperationErrorMessage('changePassword', error))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNotifications = async (preferences) => {
    try {
      setLoading(true)
      const response = await axiosInstance.put('/user/notification-preferences', preferences)

      if (response.data.success) {
        setNotificationPreferences(preferences)
        toast.success('Notification preferences updated!')
      }
    } catch (error) {
      console.error('Notification update error:', error)
      toast.error('Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }

    dispatch(logout())
    navigate('/login')
    toast.success('Logged out successfully!')
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* User Card */}
            <div className="bg-card rounded-lg p-6 mb-4 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={
                    formData.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`
                  }
                  alt={user?.firstName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <label
                  htmlFor="avatar-input"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                )
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Edit Profile
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-400 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, _idx) => (
                      <div
                        key={order._id || order.id || order.orderNumber || _idx}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/order/${order._id}/tracking`)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
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
                              {order.orderStatus
                                ? order.orderStatus.charAt(0).toUpperCase() +
                                  order.orderStatus.slice(1)
                                : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No orders yet. Start shopping!
                  </p>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Saved Addresses
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm">
                    Add New
                  </button>
                </div>

                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address, _idx) => (
                      <div
                        key={address._id || address.id || address.label || _idx}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {address.label}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {address.address}, {address.district}, {address.division}
                            </p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No addresses saved yet.
                  </p>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      key: 'emailNotifications',
                      label: 'Email Notifications',
                      description: 'Receive updates via email',
                    },
                    {
                      key: 'smsNotifications',
                      label: 'SMS Notifications',
                      description: 'Receive updates via SMS',
                    },
                    {
                      key: 'promotionalEmails',
                      label: 'Promotional Emails',
                      description: 'Receive offers and promotions',
                    },
                    {
                      key: 'orderUpdates',
                      label: 'Order Updates',
                      description: 'Get notified about order status',
                    },
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {pref.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pref.description}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={notificationPreferences[pref.key]}
                        onChange={(e) => {
                          const updated = {
                            ...notificationPreferences,
                            [pref.key]: e.target.checked,
                          }
                          setNotificationPreferences(updated)
                          handleUpdateNotifications(updated)
                        }}
                        className="w-5 h-5 text-blue-600 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">My Wishlist</h2>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((item, _idx) => (
                      <div
                        key={item._id || item.id || item.sku || _idx}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          ৳{item.price?.toFixed(2)}
                        </p>

                        <button
                          onClick={() => navigate(`/product/${item._id}`)}
                          className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                        >
                          View Product
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Your wishlist is empty.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
