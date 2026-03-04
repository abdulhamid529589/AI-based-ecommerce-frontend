import React, { useState } from 'react'
import { Heart, Eye, ShoppingCart, Star, TrendingUp, Zap } from 'lucide-react'
import './EnhancedProductCard.css'

/**
 * INSANE-LEVEL PRODUCT CARD
 * Premium design with hover effects, badges, real-time interactions
 */

export const EnhancedProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  sold,
  stock,
  badge,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  trending = false,
  flashSale = false,
  freeShipping = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleWishlist = (e) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(id)
  }

  return (
    <div
      className="enhanced-product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div
        className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900
        shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-square">
          {/* Image */}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500
              group-hover:scale-110"
          />

          {/* Image Overlay Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {flashSale && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-red-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm"
              >
                <Zap size={12} className="fill-current" />
                Flash Sale
              </div>
            )}

            {trending && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-orange-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm"
              >
                <TrendingUp size={12} />
                Trending
              </div>
            )}

            {freeShipping && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-green-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm"
              >
                <span>🚚 Free Ship</span>
              </div>
            )}

            {badge && (
              <div
                className="px-3 py-1.5 rounded-full bg-blue-500 text-white
                text-xs font-bold shadow-lg backdrop-blur-sm"
              >
                {badge}
              </div>
            )}

            {discount > 0 && !flashSale && (
              <div
                className="px-3 py-1.5 rounded-full bg-orange-500 text-white
                text-xs font-bold shadow-lg backdrop-blur-sm"
              >
                -{discount}%
              </div>
            )}
          </div>

          {/* Stock Level Indicator */}
          <div className="absolute bottom-3 left-3 text-xs text-white/90 font-medium">
            {stock > 0 ? (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${stock > 10 ? 'bg-green-400' : 'bg-orange-400'}`}
                />
                <span>{stock} left in stock</span>
              </div>
            ) : (
              <span className="text-red-300">Out of Stock</span>
            )}
          </div>

          {/* Action Buttons Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center gap-3
            transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <button
              onClick={() => onQuickView?.(id)}
              className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white
                text-gray-900 shadow-lg transition-all duration-300 hover:scale-110
                active:scale-95"
              title="Quick View"
            >
              <Eye size={20} />
            </button>

            <button
              onClick={() => onAddToCart?.(id)}
              className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600
                text-white font-semibold shadow-lg transition-all duration-300
                hover:shadow-blue-500/50 active:scale-95 flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className={`p-3 rounded-full backdrop-blur-sm shadow-lg
                transition-all duration-300 hover:scale-110 active:scale-95
                ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-900'
                }`}
              title="Add to Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Category/Brand */}
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
            Featured Product
          </p>

          {/* Product Name */}
          <h3
            className="text-sm font-semibold text-gray-900 dark:text-white mt-1
            line-clamp-2 group-hover:text-blue-500 transition-colors"
          >
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {rating} ({reviews})
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">{sold} sold</span>
          </div>

          {/* Price Section */}
          <div className="mt-4 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ৳{price.toLocaleString()}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {originalPrice && originalPrice > price && (
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                Save ৳{(originalPrice - price).toLocaleString()}
              </p>
            )}
          </div>

          {/* Quick Add Section */}
          {!isHovered && (
            <button
              onClick={() => onAddToCart?.(id)}
              disabled={stock === 0}
              className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition-all duration-300
                ${
                  stock === 0
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-blue-500 hover:text-white'
                }`}
            >
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>

        {/* Bottom Border Animation */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent
          via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100
          transition-transform duration-500"
        />
      </div>
    </div>
  )
}

export default EnhancedProductCard
