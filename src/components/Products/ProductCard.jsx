import React, { useState } from 'react'
import { Star, ShoppingCart, Heart, Zap, Eye } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import QuickViewModal from './QuickViewModal'
import { toast } from 'react-toastify'
import { getImageSrc, handleImageError } from '../../utils/placeholderImage'

const ProductCard = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Handle product data with both id and _id
  const productId = product._id || product.id
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price || 0
  const originalPrice = product.originalPrice
    ? typeof product.originalPrice === 'string'
      ? parseFloat(product.originalPrice)
      : product.originalPrice
    : price
  const discount =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const rating =
    typeof product.ratings === 'string' ? parseFloat(product.ratings) : product.ratings || 0
  const reviewCount = product.reviewCount || 0
  const image = getImageSrc(product.images?.[0]?.url, 'No Image')

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        quantity: 1,
      }),
    )
    toast.success('Added to cart!')
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    // Add to cart and navigate to checkout
    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        quantity: 1,
      }),
    )
    toast.success('Added to cart! Proceeding to checkout...')
    setTimeout(() => {
      navigate('/payment')
    }, 500)
  }

  return (
    <>
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
      <div className="group h-full animate-fade-scale-in">
        <div className="bg-card rounded-lg sm:rounded-xl shadow-soft hover-lift hover:shadow-hover transition-all overflow-hidden h-full flex flex-col active:shadow-md sm:active:shadow-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-800 duration-300">
          {/* Image - Mobile first aspect ratio */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 w-full aspect-square">
            <Link to={`/product/${productId}`} className="block w-full h-full">
              <img
                src={image}
                alt={product.name}
                onError={(e) => handleImageError(e, 'No Image')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 active:scale-95 sm:active:scale-100 will-change-transform"
              />
            </Link>
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">Out of Stock</span>
              </div>
            )}

            {/* Discount Badge - Mobile optimized */}
            {discount > 0 && (
              <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-gradient-danger text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-bold shadow-glow-red transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>-{discount}%</span>
              </div>
            )}

            {/* Quick Badge - Mobile optimized */}
            {product.stock > 10 && (
              <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-gradient-success text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-semibold shadow-glow transform group-hover:scale-110 transition-transform duration-300">
                In Stock
              </div>
            )}

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          </div>

          {/* Content - Mobile first spacing */}
          <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
            {/* Category - Hidden on very small phones */}
            <span className="hidden sm:inline text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-75 group-hover:opacity-100 transition-opacity duration-300">
              {product.category}
            </span>

            {/* Name - Compact for mobile */}
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              <Link to={`/product/${productId}`}>{product.name}</Link>
            </h3>

            {/* Rating and Reviews - Mobile optimized */}
            <div className="flex items-center gap-1 sm:gap-2 mt-1.5 sm:mt-2.5 group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400 group-hover:scale-110'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full hidden sm:inline-block">
                  ({reviewCount})
                </span>
              )}
            </div>

            {/* Price and Stock */}
            <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <p className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ৳{price.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
                </p>
                {discount > 0 && (
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                    ৳{originalPrice.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
              <p
                className={`text-xs font-semibold transition-all duration-300 ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {product.stock >= 10
                  ? '✓ In Stock'
                  : product.stock > 0
                    ? `⚠ ${product.stock} left`
                    : '✗ Out'}
              </p>
            </div>

            {/* Buttons - Touch optimized on mobile */}
            <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4 group/buttons flex-wrap sm:flex-nowrap">
              {/* Product Details Button - Mobile text hidden */}
              <Link
                to={`/product/${productId}`}
                className="flex-1 min-w-[44px] px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold rounded-md sm:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-center active:scale-95 flex items-center justify-center hover:shadow-soft hover-lift"
                title="View Details"
              >
                <span className="hidden sm:inline">Details</span>
                <Eye className="w-3.5 h-3.5 sm:hidden" />
              </Link>

              {/* Add to Cart Button - Primary action */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 min-w-[44px] px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 text-xs font-semibold rounded-md sm:rounded-lg transition-all duration-300 flex items-center justify-center gap-1 active:scale-95 hover-lift ${
                  product.stock > 0
                    ? 'bg-gradient-primary text-white hover:shadow-soft hover-glow-blue dark:hover-glow-blue'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                }`}
                title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>

              {/* Quick View Button - Secondary action */}
              <button
                onClick={() => setShowQuickView(true)}
                className="min-w-[44px] px-1.5 sm:px-3 py-2 sm:py-2.5 md:py-3 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-semibold rounded-md sm:rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-300 flex items-center justify-center hover:shadow-soft hover-glow-purple active:scale-95 hover-lift hidden sm:flex"
                title="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
