import React, { useState, useRef } from 'react'
import { Heart, Share2, ShoppingBag } from 'lucide-react'
import './SwipeableProductCard.css'

const SwipeableProductCard = ({ product, onAddToCart, onAddToWishlist, onQuickView }) => {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - touchStartX.current
    const diffY = currentY - touchStartY.current

    // Only horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setSwipeOffset(Math.max(-100, Math.min(100, diffX)))
    }
  }

  const handleTouchEnd = () => {
    if (swipeOffset < -30) {
      // Swiped left - add to cart
      onAddToCart(product)
      window.showNotification?.('Added to cart!', 'success')
    } else if (swipeOffset > 30) {
      // Swiped right - add to wishlist
      onAddToWishlist(product)
      window.showNotification?.('Added to wishlist!', 'success')
    }
    setSwipeOffset(0)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div
      className="swipeable-card"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left action (wishlist) */}
      <div className="swipe-action-left">
        <Heart size={24} />
        <p className="mt-2 text-xs font-semibold">Wishlist</p>
      </div>

      {/* Right action (cart) */}
      <div className="swipe-action-right">
        <ShoppingBag size={24} />
        <p className="mt-2 text-xs font-semibold">Cart</p>
      </div>

      {/* Card content */}
      <div className="card-content" style={{ transform: `translateX(${swipeOffset}px)` }}>
        {/* Product image */}
        <div className="product-image-wrapper" onClick={() => onQuickView?.(product)}>
          <img
            src={product.images?.[0]?.url || product.image || product.productImage}
            alt={product.name}
            className="product-image"
          />
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {product.stock < 5 && product.stock > 0 && (
            <span className="low-stock-badge">Only {product.stock} left</span>
          )}
          {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
        </div>

        {/* Product info */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          {/* Rating */}
          <div className="product-rating">
            <span className="stars">⭐ {(product.rating || 4.5).toFixed(1)}</span>
            <span className="reviews">({product.reviews || 0})</span>
          </div>

          {/* Pricing */}
          <div className="product-pricing">
            <span className="price">৳{product.price.toLocaleString('bn-BD')}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">
                  ৳{product.originalPrice.toLocaleString('bn-BD')}
                </span>
                {discount > 0 && <span className="discount">{discount}% off</span>}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="product-actions">
            <button
              className="action-btn wishlist-btn"
              onClick={() => {
                onAddToWishlist?.(product)
                window.showNotification?.('Added to wishlist!', 'success')
              }}
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
            <button
              className="action-btn cart-btn"
              onClick={() => {
                onAddToCart?.(product)
                window.showNotification?.('Added to cart!', 'success')
              }}
              aria-label="Add to cart"
              disabled={product.stock === 0}
            >
              <ShoppingBag size={18} />
            </button>
            <button className="action-btn share-btn" aria-label="Share">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwipeableProductCard
