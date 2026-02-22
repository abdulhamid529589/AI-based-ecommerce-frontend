import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Camera, Save, LogOut, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { logout, setUser } from '../store/slices/authSlice'
import { getOperationErrorMessage } from '../utils/errorHandler'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const fileInputRef = useRef(null)

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar?.url || '',
  })

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'password'

  // Redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
  }

  // Handle profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Validate profile update
  const validateProfile = () => {
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty')
      return false
    }
    if (!profileData.email.trim()) {
      toast.error('Email cannot be empty')
      return false
    }
    if (!profileData.email.includes('@')) {
      toast.error('Please enter valid email')
      return false
    }
    return true
  }

  // Validate password change
  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error('Please enter current password')
      return false
    }
    if (!passwordData.newPassword) {
      toast.error('Please enter new password')
      return false
    }
    if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16) {
      toast.error('Password must be 8-16 characters')
      return false
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return false
    }
    return true
  }

  // Submit profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!validateProfile()) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', profileData.name)
      formData.append('email', profileData.email)
      if (fileInputRef.current?.files?.[0]) {
        formData.append('avatar', fileInputRef.current.files[0])
      }

      const response = await axiosInstance.put('/auth/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        const updatedUser = response.data.user

        // Update Redux state with new user data
        dispatch(
          setUser({
            user: updatedUser,
            token: localStorage.getItem('token'),
          }),
        )

        // Update local profile data
        setProfileData({
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar?.url || '',
        })

        // Clear avatar preview
        setAvatarPreview(null)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error(getOperationErrorMessage('updateProfile', error))
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePassword()) return

    setLoading(true)

    try {
      const response = await axiosInstance.put('/auth/password/update', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword,
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
      toast.error(getOperationErrorMessage('changePassword', error))
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account information and security
            </p>
          </div>

          <div className="bg-card rounded-lg shadow">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 px-4 font-medium transition ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                <User className="inline mr-2 w-4 h-4" />
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-4 px-4 font-medium transition ${
                  activeTab === 'password'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                <Lock className="inline mr-2 w-4 h-4" />
                Change Password
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6 sm:p-8">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <img
                            src={
                              avatarPreview ||
                              profileData.avatar ||
                              `https://ui-avatars.com/api/?name=${user?.name}`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
                          title="Change avatar"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Profile Picture
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Click the camera icon to upload a new profile picture. JPG, PNG up to 5MB.
                      </p>
                      {avatarPreview && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          New image selected. Click save to apply changes.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your profile information will be updated across the platform.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg transition"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="p-6 sm:p-8">
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password (8-16 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                      Password must:
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                      <li>Be 8-16 characters long</li>
                      <li>Match the confirmation password</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg transition"
                  >
                    <Lock className="w-5 h-5" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Logout Button - Always visible */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                You'll be logged out from all devices
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Account Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-300">Email:</span>{' '}
                {user?.email}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-300">Role:</span>{' '}
                {user?.role || 'User'}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-300">Member Since:</span>{' '}
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
