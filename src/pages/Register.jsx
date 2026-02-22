import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { getOperationErrorMessage } from '../utils/errorHandler'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })
  const [useEmail, setUseEmail] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    let { name, value } = e.target

    // For mobile number, just clean up and format for display
    if (name === 'mobile') {
      // Allow user to type freely with these characters: digits, +, space, -, (, )
      const cleaned = value.replace(/[^\d\s\+\-()]/g, '')

      // Additional validation: limit to reasonable length
      if (cleaned.replace(/\D/g, '').length > 12) {
        return // Max 12 digits for BD numbers
      }

      value = cleaned
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('👤 Please enter your full name')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('🔐 Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('🔐 Password must be at least 8 characters long')
      return
    }

    if (useEmail && !formData.email) {
      toast.error('📧 Please provide an email address')
      return
    }

    if (!useEmail && !formData.mobile) {
      toast.error('📱 Please provide a mobile number')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/register', {
        name: formData.name,
        email: useEmail ? formData.email : '',
        mobile: !useEmail ? formData.mobile : '',
        password: formData.password,
      })

      if (response.data.success) {
        toast.success('✅ Account created successfully! Redirecting...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    } catch (error) {
      // Determine user-friendly error message
      let errorMessage = 'Unable to create account. Please try again.'

      if (!error.response) {
        // Network error
        errorMessage = '🌐 Connection failed. Please check your internet and try again.'
      } else if (error.response.status === 400) {
        // Bad request - validation error
        errorMessage =
          error.response.data?.message || '⚠️ Please check your information and try again.'
      } else if (error.response.status === 409) {
        // Conflict - email or mobile already exists
        if (error.response.data?.message?.includes('email')) {
          errorMessage =
            '📧 This email is already registered. Please log in or use a different email.'
        } else if (error.response.data?.message?.includes('mobile')) {
          errorMessage =
            '📱 This mobile number is already registered. Please log in or use a different number.'
        } else {
          errorMessage =
            error.response.data?.message || '⚠️ This account already exists. Please log in.'
        }
      } else if (error.response.status === 500) {
        // Server error
        errorMessage = '⚠️ Server error. Please try again in a few moments.'
      } else if (error.response?.data?.message) {
        // Server provided message
        errorMessage = error.response.data.message
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-block w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg sm:text-xl">E</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Join us today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base transition min-h-[44px]"
                  required
                />
              </div>
            </div>

            {/* Toggle Between Email and Mobile */}
            <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setUseEmail(true)}
                className={`flex-1 py-2 px-3 rounded text-xs sm:text-sm font-medium transition ${
                  useEmail
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setUseEmail(false)}
                className={`flex-1 py-2 px-3 rounded text-xs sm:text-sm font-medium transition ${
                  !useEmail
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Phone className="inline w-4 h-4 mr-1" />
                Mobile
              </button>
            </div>

            {/* Email Input */}
            {useEmail && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base transition min-h-[44px]"
                    required={useEmail}
                  />
                </div>
              </div>
            )}

            {/* Mobile Input */}
            {!useEmail && (
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
                >
                  Mobile Number (Bangladesh)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX or 01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base transition min-h-[44px]"
                    required={!useEmail}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  📱 Accept both: +880XXXXXXXXX or 01XXXXXXXXX
                </p>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 sm:py-3.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base transition min-h-[44px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                🔐 Password must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 sm:py-3.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base transition min-h-[44px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 sm:py-4 rounded-lg transition text-base sm:text-lg active:scale-95 min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 sm:py-4 rounded-lg transition text-center text-base sm:text-lg active:scale-95 min-h-[48px] flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
