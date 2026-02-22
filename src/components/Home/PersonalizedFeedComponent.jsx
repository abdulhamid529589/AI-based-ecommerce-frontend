import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../lib/axios'
import { Loader, Star, ShoppingCart, Heart } from 'lucide-react'

const API_BASE_URL = ''

const PersonalizedFeedComponent = () => {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState({})
  const [userPreferences, setUserPreferences] = useState({})
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/feed`)
      const { feed: feedData, sections: sectionsData, userPreferences: prefs } = response.data.data
      setFeed(feedData)
      setSections(sectionsData)
      setUserPreferences(prefs)
    } catch (error) {
      console.error('Error fetching personalized feed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    )
  }

  const groupedFeed = {
    recommended: feed.filter((item) => item.feed_type === 'recommended'),
    trending: feed.filter((item) => item.feed_type === 'trending'),
    flashDeals: feed.filter((item) => item.feed_type === 'flash_deal'),
  }

  return (
    <div className="w-full">
      {/* User Preferences Summary */}
      {userPreferences.favoriteCategories?.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-800">Your Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {userPreferences.favoriteCategories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-700"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {groupedFeed.recommended.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🎯 Recommended For You</h2>
            <span className="text-sm text-gray-600">{groupedFeed.recommended.length} items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupedFeed.recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Flash Deals */}
      {groupedFeed.flashDeals.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">⚡ Flash Deals</h2>
            <span className="text-sm text-red-600 font-semibold">Limited Time</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupedFeed.flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} isFlashDeal />
            ))}
          </div>
        </div>
      )}

      {/* Trending Products */}
      {groupedFeed.trending.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">📈 Trending Now</h2>
            <span className="text-sm text-gray-600">{groupedFeed.trending.length} items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupedFeed.trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ProductCard = ({ product, isFlashDeal = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    // Dispatch to cart
    console.log('Added to cart:', product.id)
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const discount = product.discount_percent || 0
  const originalPrice = product.price
  const finalPrice = originalPrice * (1 - discount / 100)

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
      {/* Image Container */}
      <div className="relative bg-gray-100 h-48 overflow-hidden">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-300"
        />

        {isFlashDeal && discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>

        {/* Name */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.ratings) ? 'fill-current' : ''}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.ratings})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          {discount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">৳{finalPrice.toFixed(0)}</span>
              <span className="text-sm text-gray-500 line-through">৳{originalPrice}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">৳{originalPrice}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-1"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`py-2 px-3 rounded border transition ${
              isWishlisted
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'border-gray-300 text-gray-600 hover:border-red-300'
            }`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonalizedFeedComponent
