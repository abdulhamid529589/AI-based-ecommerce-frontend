/**
 * 🎯 ENHANCED BOTTOM NAVIGATION - PHASE 1
 * Features: Gesture controls, animations, haptic feedback, smooth transitions
 */

import React, { useState, useEffect } from 'react'
import { Home, ShoppingBag, Heart, User, Menu, X, ShoppingCart, Search } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useSwipeNavigation } from './GestureController'
import './EnhancedBottomNav.css'

const EnhancedBottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { items: cartItems } = useSelector((state) => state.cart)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('home')
  const [showLabel, setShowLabel] = useState(true)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const navRef = useSwipeNavigation(handleSwipe)

  // Update active tab based on location
  useEffect(() => {
    if (location.pathname === '/') setActiveTab('home')
    else if (location.pathname.includes('/products')) setActiveTab('shop')
    else if (location.pathname === '/wishlist') setActiveTab('wishlist')
    else if (location.pathname.includes('/profile')) setActiveTab('profile')
  }, [location])

  // Hide labels on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowLabel(false) // scrolling down
      } else {
        setShowLabel(true) // scrolling up
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle gesture-based navigation
  function handleSwipe(direction) {
    const tabIds = ['home', 'search', 'shop', 'wishlist', 'profile']
    const currentIndex = tabIds.indexOf(activeTab)

    if (direction === 'left' && currentIndex < tabIds.length - 1) {
      // Swipe left → next tab
      const nextTab = navItems[currentIndex + 1]
      if (nextTab) {
        setActiveTab(nextTab.id)
        navigate(nextTab.path)
        triggerHaptic()
      }
    } else if (direction === 'right' && currentIndex > 0) {
      // Swipe right → previous tab
      const prevTab = navItems[currentIndex - 1]
      if (prevTab) {
        setActiveTab(prevTab.id)
        navigate(prevTab.path)
        triggerHaptic()
      }
    }
  }

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20) // Light haptic feedback
    }
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'search', icon: Search, label: 'Search', path: '/search', badge: 0 },
    { id: 'shop', icon: ShoppingBag, label: 'Shop', path: '/products', badge: 0 },
    {
      id: 'wishlist',
      icon: Heart,
      label: 'Wishlist',
      path: '/wishlist',
      badge: wishlistItems?.length || 0,
    },
    { id: 'profile', icon: User, label: isAuthenticated ? 'Account' : 'Login', path: '/profile' },
  ]

  const cartCount = cartItems?.length || 0

  return (
    <>
      <nav
        ref={navRef}
        className="enhanced-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40"
        data-visible-labels={showLabel}
      >
        {/* Main Navigation Items */}
        <div className="nav-container">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id)
                navigate(item.path)
                triggerHaptic()
                setShowMoreMenu(false)
              }}
              title={item.label}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <div className="nav-icon-wrapper">
                <item.icon size={24} className="nav-icon" />
                {item.badge > 0 && (
                  <span className={`nav-badge ${item.badge > 9 ? 'text-xs' : ''}`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              {showLabel && <span className="nav-label">{item.label}</span>}

              {/* Active indicator */}
              {activeTab === item.id && <div className="nav-active-indicator" />}
            </button>
          ))}

          {/* Cart Floating Button (if items in cart) */}
          {cartCount > 0 && (
            <button
              className="nav-item cart-quick-btn"
              onClick={() => {
                navigate('/cart')
                triggerHaptic()
              }}
              title={`Cart (${cartCount})`}
              aria-label={`Cart with ${cartCount} items`}
            >
              <div className="nav-icon-wrapper">
                <ShoppingCart size={24} className="nav-icon" />
                <span className="nav-badge cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
              </div>
              {showLabel && <span className="nav-label">Cart</span>}
            </button>
          )}

          {/* More Menu Button */}
          <button
            className={`nav-item menu-btn ${showMoreMenu ? 'active' : ''}`}
            onClick={() => {
              setShowMoreMenu(!showMoreMenu)
              triggerHaptic()
            }}
            title="More options"
            aria-label="More options"
          >
            <div className="nav-icon-wrapper">
              <Menu size={24} className="nav-icon" />
            </div>
            {showLabel && <span className="nav-label">More</span>}
          </button>
        </div>

        {/* More Menu Dropdown */}
        {showMoreMenu && (
          <div className="nav-more-menu animated">
            <button
              className="nav-more-item"
              onClick={() => {
                navigate('/orders')
                setShowMoreMenu(false)
                triggerHaptic()
              }}
            >
              <ShoppingBag size={20} />
              <span>My Orders</span>
            </button>
            <button
              className="nav-more-item"
              onClick={() => {
                navigate('/settings')
                setShowMoreMenu(false)
                triggerHaptic()
              }}
            >
              <User size={20} />
              <span>Settings</span>
            </button>
            <button
              className="nav-more-item"
              onClick={() => {
                navigate('/help')
                setShowMoreMenu(false)
                triggerHaptic()
              }}
            >
              <Heart size={20} />
              <span>Help & Support</span>
            </button>
          </div>
        )}
      </nav>

      {/* Backdrop for more menu */}
      {showMoreMenu && (
        <div
          className="nav-menu-backdrop"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* Safe area spacer for bottom nav */}
      <div className="nav-spacer md:hidden" />
    </>
  )
}

export default EnhancedBottomNav

      {/* Background blur effect */}
      <div className="nav-backdrop" />
    </nav>
  )
}

export default EnhancedBottomNav
