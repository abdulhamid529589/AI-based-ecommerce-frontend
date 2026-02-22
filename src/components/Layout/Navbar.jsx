import {
  Menu,
  User,
  ShoppingCart,
  Sun,
  Moon,
  Search,
  LogOut,
  Heart,
  X,
  Home,
  Heart as Favorites,
  Package,
  Phone,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logout } from '../../store/slices/authSlice'
import SearchAutocomplete from '../Search/SearchAutocomplete'
import useShopSettings from '../../hooks/useShopSettings'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user } = useSelector((state) => state.auth, shallowEqual)
  const items = useSelector((state) => state.cart.items, shallowEqual)
  const { shopInfo } = useShopSettings()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showSearchAutocomplete, setShowSearchAutocomplete] = useState(false)
  const dispatch = useDispatch()

  // Global Cmd+K keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearchAutocomplete(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const cartItemsCount = items?.length || 0

  const handleLogout = () => {
    dispatch(logout())
    setShowProfileMenu(false)
    setShowMobileMenu(false)
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
    setShowMobileSearch(false)
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-soft transition-all duration-300">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo - Enhanced */}
          <Link
            to="/"
            className="flex items-center space-x-2 flex-shrink-0 hover:opacity-80 transition-opacity duration-300 group"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-hover transition-all duration-300">
              <span className="text-white font-bold text-base sm:text-lg md:text-xl">E</span>
            </div>
            <span className="hidden sm:inline text-lg sm:text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {shopInfo.shopName}
            </span>
          </Link>

          {/* Search Bar - Desktop Enhanced */}
          <div className="hidden md:flex flex-1 mx-6 lg:mx-10">
            <div className="w-full relative group">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                onClick={() => setShowSearchAutocomplete(true)}
                onFocus={() => setShowSearchAutocomplete(true)}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-400 dark:group-hover:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base transition-all cursor-pointer shadow-soft hover:shadow-md active:scale-95 group-focus:shadow-md"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all pointer-events-none" />
              <kbd className="hidden xl:inline absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Search Autocomplete */}
          {showSearchAutocomplete && (
            <SearchAutocomplete onClose={() => setShowSearchAutocomplete(false)} />
          )}

          {/* Right Side Menu - Enhanced */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Menu Button - Mobile with Animation */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center group hover-lift"
              aria-label="Toggle menu"
              title="Menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>

            {/* Search - Mobile with Animation */}
            <button
              onClick={() => setShowSearchAutocomplete(true)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center group hover-lift"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300" />
            </button>

            {/* Theme Toggle - Enhanced */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center group hover-lift"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:rotate-180 group-hover:scale-110 transition-all duration-300" />
              ) : (
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:rotate-180 group-hover:scale-110 transition-all duration-300" />
              )}
            </button>

            {/* Wishlist - Hidden on small mobile */}
            <Link
              to="/wishlist"
              className="hidden sm:flex p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all relative active:scale-95 min-h-[44px] min-w-[44px] items-center justify-center group hover-lift"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-gradient-danger text-white text-xs rounded-full flex items-center justify-center font-bold shadow-glow">
                0
              </span>
            </Link>

            {/* Cart - Enhanced */}
            <Link
              to="/cart"
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all relative active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center group hover-lift"
              aria-label="Shopping cart"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-gradient-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-glow animate-pulse-glow">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login - Enhanced */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center group hover-lift"
                aria-label="User profile"
                title="Profile"
              >
                {isAuthenticated && user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="Profile"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-300"
                  />
                ) : isAuthenticated && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-300"
                  />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300" />
                )}
              </button>

              {/* Profile Dropdown Menu - Enhanced with Glass Effect */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-elegant z-50 text-sm animate-scale-in">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover-lift"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover-lift"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        📦 My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 transition-all duration-300 font-medium hover-lift"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover-lift"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        🔐 Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover-lift"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        ✨ Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Secondary Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 h-12 border-t border-gray-200 dark:border-gray-800 overflow-x-auto">
          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            All Products
          </Link>
          <Link
            to="/products?category=electronics"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Electronics
          </Link>
          <Link
            to="/products?category=fashion"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Fashion
          </Link>
          <Link
            to="/products?category=home"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Home & Garden
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap py-3"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu - Enhanced with Premium UX */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md overflow-hidden animate-slide-down max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="px-3 sm:px-4 py-3 space-y-1 animate-stagger">
              {/* Main Navigation Links */}
              <Link
                to="/products"
                className="flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-300 font-medium text-base hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                <Package className="w-5 h-5" />
                All Products
              </Link>

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* Categories */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </div>
              <Link
                to="/products?category=electronics"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                📱 Electronics
              </Link>
              <Link
                to="/products?category=fashion"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                👗 Fashion
              </Link>
              <Link
                to="/products?category=home"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                🏠 Home & Garden
              </Link>

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* Quick Links */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quick Links
              </div>
              <Link
                to="/"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                ℹ️ About Us
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                onClick={closeMobileMenu}
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>

              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

              {/* User Section */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Account
              </div>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                    onClick={closeMobileMenu}
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-6 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 font-medium text-sm active:scale-95 hover-lift"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover-lift"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-6 py-3 text-white bg-gradient-primary hover:shadow-hover rounded-lg transition-all duration-300 font-semibold text-sm active:scale-95 mt-2 hover-lift"
                    onClick={closeMobileMenu}
                  >
                    ✨ Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
