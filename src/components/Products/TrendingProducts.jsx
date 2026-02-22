import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Star, ShoppingCart, Heart } from 'lucide-react'
import { getTrendingProductsAPI } from '../../services/searchAPI'
import './TrendingProducts.css'

/**
 * Trending Products Component
 * Displays AI-recommended trending products with real-time statistics
 */
const TrendingProducts = ({ limit = 8, showStats = true }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlistItems, setWishlistItems] = useState(new Set())

  useEffect(() => {
    fetchTrendingProducts()
  }, [limit])

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true)
      const response = await getTrendingProductsAPI(limit)
      setProducts(response.data?.products || [])
    } catch (err) {
      console.error('Error fetching trending products:', err)
      setError('Failed to load trending products')
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = (productId) => {
    const updated = new Set(wishlistItems)
    if (updated.has(productId)) {
      updated.delete(productId)
    } else {
      updated.add(productId)
    }
    setWishlistItems(updated)
  }

  if (loading) {
    return (
      <div className="trending-container">
        <div className="trending-header">
          <h2 className="trending-title">
            <TrendingUp size={24} />
            Trending Now
          </h2>
        </div>
        <div className="trending-skeleton">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || products.length === 0) {
    return (
      <div className="trending-container">
        <div className="trending-header">
          <h2 className="trending-title">
            <TrendingUp size={24} />
            Trending Now
          </h2>
        </div>
        <div className="trending-error">
          <p>{error || 'No trending products available'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="trending-container">
      <div className="trending-header">
        <div>
          <h2 className="trending-title">
            <TrendingUp size={24} />
            Trending Now
          </h2>
          <p className="trending-subtitle">Handpicked items gaining popularity this week</p>
        </div>
        <Link to="/products?sort=trending" className="trending-link">
          View All →
        </Link>
      </div>

      <div className="trending-grid">
        {products.map((product) => (
          <div key={product.id} className="trending-card">
            {/* Trending Badge */}
            {product.trendingScore && (
              <div className="trending-badge">
                <TrendingUp size={14} />
                <span>{Math.round(product.trendingScore)}% hot</span>
              </div>
            )}

            {/* Image Container */}
            <Link to={`/product/${product.id}`} className="trending-image-link">
              <div className="trending-image-container">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="trending-image"
                />
                {product.discount && (
                  <div className="trending-discount">{product.discount}% OFF</div>
                )}
              </div>
            </Link>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`trending-wishlist-btn ${wishlistItems.has(product.id) ? 'active' : ''}`}
              title="Add to wishlist"
            >
              <Heart size={18} fill={wishlistItems.has(product.id) ? 'currentColor' : 'none'} />
            </button>

            {/* Product Info */}
            <div className="trending-info">
              {/* Category */}
              {product.category && <p className="trending-category">{product.category}</p>}

              {/* Product Name */}
              <Link to={`/product/${product.id}`} className="trending-name-link">
                <h3 className="trending-name">{product.name}</h3>
              </Link>

              {/* Rating */}
              {product.rating && (
                <div className="trending-rating">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(product.rating) ? 'filled' : ''}
                      />
                    ))}
                  </div>
                  <span className="rating-count">({product.reviews || 0})</span>
                </div>
              )}

              {/* Stats */}
              {showStats && (
                <div className="trending-stats">
                  {product.salesCount && (
                    <span className="stat-item">
                      <ShoppingCart size={12} />
                      {product.salesCount} sold
                    </span>
                  )}
                  {product.viewCount && (
                    <span className="stat-item">{product.viewCount.toLocaleString()} views</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="trending-price">
                <span className="current-price">৳{product.price?.toLocaleString() || 'N/A'}</span>
                {product.originalPrice && (
                  <span className="original-price">৳{product.originalPrice?.toLocaleString()}</span>
                )}
              </div>

              {/* Add to Cart Button */}
              <Link to={`/product/${product.id}`} className="trending-add-btn">
                <ShoppingCart size={16} />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingProducts
