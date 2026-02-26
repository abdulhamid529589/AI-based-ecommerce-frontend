import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, Suspense, lazy } from 'react'
import NotificationCenter from './components/Notifications/NotificationCenter'
import ChatWidget from './components/ChatWidget'

// Security
import { initializeCsrfToken } from './lib/axios'

// Layout Components
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import SearchOverlay from './components/Layout/SearchOverlay'
import CartSidebar from './components/Layout/CartSidebar'
import ProfilePanel from './components/Layout/ProfilePanel'
import LoginModal from './components/Layout/LoginModal'
import FloatingActionButton from './components/Layout/FloatingActionButton'
import Footer from './components/Layout/Footer'

// Mobile Components
import BottomTabNav from './components/Mobile/BottomTabNav'
import FloatingCartButton from './components/Mobile/FloatingCartButton'

// Pages - Lazy loaded for better performance
const Index = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/ProductsAmazonStyle'))
const ProductDetail = lazy(() => import('./pages/ProductDetailAmazonStyle'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const Orders = lazy(() => import('./pages/Orders'))
const Payment = lazy(() => import('./pages/Payment'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'))
const About = lazy(() => import('./pages/About'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
) // Store
import { fetchAllProducts } from './store/slices/productSlice'

const AppContent = () => {
  const dispatch = useDispatch()
  const { items: cartItems } = useSelector((state) => state.cart)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { user } = useSelector((state) => state.auth)
  const isLoggedIn = !!user

  // Initialize CSRF token and fetch products on app mount
  useEffect(() => {
    // 🔒 Initialize CSRF protection
    initializeCsrfToken()
    // Fetch products
    dispatch(fetchAllProducts())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <NotificationCenter />
      <Navbar />
      <Sidebar />
      <SearchOverlay />
      <CartSidebar />
      <ProfilePanel />
      <LoginModal />
      <FloatingActionButton />

      {/* Mobile Components */}
      <FloatingCartButton />
      <BottomTabNav cartCount={cartItems.length} wishlistCount={wishlistItems?.length || 0} />

      {/* Chat Widget - Only visible for logged-in users */}
      <ChatWidget user={user} isLoggedIn={isLoggedIn} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:orderId/tracking" element={<OrderTracking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <>
      <SettingsProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <AppContent />
              <ToastContainer />
            </BrowserRouter>
          </CurrencyProvider>
        </ThemeProvider>
      </SettingsProvider>
    </>
  )
}

export default App
