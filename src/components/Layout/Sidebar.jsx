import { X, Home, Package, Info, HelpCircle, ShoppingCart, List, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth, shallowEqual)

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: List, label: 'Orders', path: '/orders' },
    { icon: Info, label: 'About', path: '/about' },
    { icon: Phone, label: 'Contact', path: '/contact' },
    { icon: HelpCircle, label: 'FAQ', path: '/faq' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Sidebar Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={onClose}
                className="block w-full px-4 py-2.5 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition font-medium text-sm"
              >
                My Profile
              </Link>
              <button className="w-full px-4 py-2.5 text-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-medium text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full px-4 py-2.5 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full px-4 py-2.5 text-center border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-medium text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
