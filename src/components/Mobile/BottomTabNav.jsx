import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import './BottomTabNav.css'

const BottomTabNav = ({ cartCount, wishlistCount }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, path: '/cart', badge: cartCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlistCount },
    { id: 'account', label: 'Account', icon: User, path: '/profile' },
  ]

  const isActive = (path) => location.pathname === path

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <nav className="bottom-tab-nav md:hidden fixed bottom-0 left-0 right-0 z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(tab.path)

        return (
          <button
            key={tab.id}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => handleNavigate(tab.path)}
            aria-label={tab.label}
          >
            <div className="tab-icon-wrapper relative">
              <Icon size={24} className="tab-icon" />
              {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
            </div>
            <span className="tab-label text-xs font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomTabNav
