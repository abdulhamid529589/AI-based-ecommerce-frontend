import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowUp, Zap } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../styles/FloatingActionButton.css'

const FloatingActionButton = () => {
  const navigate = useNavigate()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const cartItems = useSelector((state) => state.cart.items)
  const cartCount = cartItems?.length || 0

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const goToCart = () => {
    navigate('/cart')
    setIsExpanded(false)
  }

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && <div className="fab-backdrop" onClick={() => setIsExpanded(false)} />}

      {/* Floating Action Button Container */}
      <div className={`fab-container ${isExpanded ? 'expanded' : ''}`}>
        {/* Secondary Actions */}
        <div className={`fab-menu ${isExpanded ? 'show' : ''}`}>
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fab-item scroll-to-top"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
              <span className="fab-label">Top</span>
            </button>
          )}

          {/* Quick Checkout Button */}
          <button
            onClick={() => {
              navigate('/payment')
              setIsExpanded(false)
            }}
            className="fab-item quick-checkout"
            title="Quick checkout"
            aria-label="Go to checkout"
          >
            <Zap className="w-5 h-5" />
            <span className="fab-label">Checkout</span>
          </button>
        </div>

        {/* Main FAB - Cart Button */}
        <button
          onClick={() => (cartCount > 0 ? goToCart() : setIsExpanded(!isExpanded))}
          className={`fab-main ${cartCount > 0 ? 'has-items' : ''}`}
          title={cartCount > 0 ? 'Go to cart' : 'Quick actions'}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="fab-badge" aria-label={`${cartCount} items in cart`}>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </div>
    </>
  )
}

export default FloatingActionButton
