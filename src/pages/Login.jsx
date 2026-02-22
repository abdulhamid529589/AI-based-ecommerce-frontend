import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { setUser } from '../store/slices/authSlice'
import { getOperationErrorMessage } from '../utils/errorHandler'

const Login = () => {
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [useEmail, setUseEmail] = useState(true)
  const [loading, setLoading] = useState(false)

  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const formatMobileNumber = (value) => {
    // Allow user to type freely with these characters: digits, +, space, -, (, )
    const cleaned = value.replace(/[^\d\s\+\-()]/g, '')

    // Additional validation: limit to reasonable length
    if (cleaned.replace(/\D/g, '').length > 12) {
      return value // Don't update if exceeds max digits, return original
    }

    return cleaned
  }

  const handleMobileChange = (e) => {
    setMobile(formatMobileNumber(e.target.value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: useEmail ? email : '',
        mobile: !useEmail ? mobile : '',
        password,
      })

      if (response.data.success) {
        // Store user and token in Redux and localStorage
        dispatch(
          setUser({
            user: response.data.user,
            token: response.data.accessToken,
          }),
        )

        // Store refresh token separately
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
          // Set token expiration (15 minutes from now)
          localStorage.setItem('tokenExpiresAt', new Date(Date.now() + 15 * 60 * 1000).getTime())
        }

        toast.success('✅ Logged in successfully!')

        // Redirect to previous page or payment if coming from buy now
        const from = location.state?.from?.pathname
        if (from && from === '/payment') {
          navigate('/payment')
        } else {
          navigate('/')
        }
      }
    } catch (error) {
      // Determine user-friendly error message
      let errorMessage = 'Unable to log in. Please try again.'

      if (!error.response) {
        // Network error
        errorMessage = '🌐 Connection failed. Please check your internet and try again.'
      } else if (error.response.status === 401) {
        // Unauthorized - wrong credentials
        errorMessage = '❌ Invalid email/mobile or password. Please try again.'
      } else if (error.response.status === 403) {
        // Account locked/disabled
        errorMessage =
          error.response.data?.message || '🔒 Your account has been locked. Please contact support.'
      } else if (error.response.status === 429) {
        // Too many attempts
        errorMessage = '⏱️ Too many login attempts. Please try again in 15 minutes.'
      } else if (error.response.status === 400) {
        // Bad request
        errorMessage = error.response.data?.message || '⚠️ Please check your input and try again.'
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
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="+880 1XXXXXXXXX or 01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base transition min-h-[44px]"
                    required={!useEmail}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/password/forgot"
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition active:scale-95 inline-block"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 sm:py-4 rounded-lg transition duration-200 text-base sm:text-lg active:scale-95 min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
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
                New to our store?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/register"
            className="block w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 sm:py-4 rounded-lg transition text-center text-base sm:text-lg active:scale-95 min-h-[48px] flex items-center justify-center"
          >
            Create Account
          </Link>

          {/* Demo Credentials */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
              📝 Demo Account
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              <span className="font-medium">Email:</span> demo@example.com
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              <span className="font-medium">Password:</span> demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
