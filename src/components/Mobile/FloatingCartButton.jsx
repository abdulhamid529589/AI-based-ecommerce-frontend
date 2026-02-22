import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShoppingBag, X } from 'lucide-react'
import './FloatingCartButton.css'

const FloatingCartButton = () => {
  const navigate = useNavigate()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const [showMini, setShowMini] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Trigger animation when cart items change
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 600)
    return () => clearTimeout(timer)
  }, [items.length])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const displayPrice =
    totalPrice || items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleViewCart = () => {
    setShowMini(false)
    navigate('/cart')
  }

  return (
    <>
      {/* Mini Cart Preview */}
      {showMini && (
        <div className="mini-cart-preview fixed md:hidden">
          <div className="mini-cart-header">
            <h4 className="m-0 text-base font-semibold">Your Cart</h4>
            <button
              onClick={() => setShowMini(false)}
              className="bg-none border-none cursor-pointer p-0"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mini-cart-items">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="mini-cart-item">
                <img src={item.image || item.productImage} alt={item.name} />
                <div className="flex-1">
                  <p className="item-name m-0">{item.name}</p>
                  <p className="item-qty m-1 text-xs text-gray-500">
                    {item.quantity}x ৳{item.price.toLocaleString('bn-BD')}
                  </p>
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <p className="more-items text-center py-3 text-sm text-blue-600 font-semibold">
                +{items.length - 3} more items
              </p>
            )}
          </div>
          <div className="mini-cart-footer">
            <p className="total m-0 mb-3 text-sm text-right">
              Total: <strong>৳{displayPrice.toLocaleString('bn-BD')}</strong>
            </p>
            <button className="view-cart-btn w-full" onClick={handleViewCart}>
              View Full Cart
            </button>
          </div>
        </div>
      )}

      {/* Floating Button - Only show on mobile */}
      {items.length > 0 && (
        <button
          className={`floating-cart-button md:hidden ${animate ? 'animate' : ''}`}
          onClick={() => setShowMini(!showMini)}
          aria-label="Cart"
        >
          <ShoppingBag size={24} />
          <span className="cart-badge">{totalItems}</span>
          <span className="cart-price">৳{(displayPrice / 1000).toFixed(0)}K</span>
        </button>
      )}
    </>
  )
}

export default FloatingCartButton
