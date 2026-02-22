import React, { useState } from 'react'
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import './ProductDetailEnhanced.css'

const ProductDetailEnhanced = ({
  product = {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [expandedSection, setExpandedSection] = useState('description')
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleAddToCart = () => {
    onAddToCart?.({
      ...product,
      quantity,
    })
  }

  const handleWishlist = () => {
    setIsInWishlist(!isInWishlist)
    onAddToWishlist?.(product)
  }

  return (
    <div className="product-detail-enhanced">
      {/* Main Product Section */}
      <div className="product-main">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.images?.[0]?.url || product.image || product.productImage}
              alt={product.name}
              className="image"
            />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {product.stock < 5 && product.stock > 0 && (
              <span className="stock-badge">Only {product.stock} left!</span>
            )}
            {product.stock === 0 && <span className="stock-badge out">Out of Stock</span>}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="thumbnail-gallery">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img?.url || img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          {/* Header */}
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-meta">
              <div className="rating-section">
                <div className="stars">
                  {'⭐'.repeat(Math.floor(product.rating || 4.5))}
                  <span className="rating-number">{product.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <span className="reviews-count">({product.reviews || 0} reviews)</span>
              </div>
              <span className="sku">SKU: {product.sku || 'N/A'}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="pricing-section">
            <div className="price-display">
              <span className="current-price">৳{product.price?.toLocaleString('bn-BD')}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">
                    ৳{product.originalPrice?.toLocaleString('bn-BD')}
                  </span>
                  <span className="discount-badge">
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Urgency Indicator */}
            {product.stock < 5 && product.stock > 0 && (
              <div className="urgency-banner">
                <Zap size={16} />
                <span>Only {product.stock} items left - Buy now!</span>
              </div>
            )}
          </div>

          {/* Trust Signals */}
          <div className="trust-signals">
            <div className="signal">
              <Shield size={18} />
              <span>100% Authentic</span>
            </div>
            <div className="signal">
              <Truck size={18} />
              <span>Free Shipping</span>
            </div>
            <div className="signal">
              <RotateCcw size={18} />
              <span>30-Day Return</span>
            </div>
          </div>

          {/* Actions */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input type="number" min="1" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button
              className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              <Heart size={18} />
            </button>

            <button className="btn-share">
              <Share2 size={18} />
            </button>
          </div>

          {/* Seller Info */}
          <div className="seller-info">
            <p>
              <strong>Sold by:</strong> {product.seller || 'Official Store'}
            </p>
            <p>
              <strong>Warranty:</strong> {product.warranty || '12 months'}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="product-details-section">
        {/* Description */}
        <div className="detail-box">
          <button
            className={`detail-header ${expandedSection === 'description' ? 'expanded' : ''}`}
            onClick={() =>
              setExpandedSection(expandedSection === 'description' ? null : 'description')
            }
          >
            <span>Product Description</span>
            {expandedSection === 'description' ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === 'description' && (
            <div className="detail-content">
              <p>{product.description || 'No description available'}</p>
            </div>
          )}
        </div>

        {/* Specifications */}
        {product.specs && (
          <div className="detail-box">
            <button
              className={`detail-header ${expandedSection === 'specs' ? 'expanded' : ''}`}
              onClick={() => setExpandedSection(expandedSection === 'specs' ? null : 'specs')}
            >
              <span>Specifications</span>
              {expandedSection === 'specs' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSection === 'specs' && (
              <div className="detail-content">
                <div className="specs-grid">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shipping Info */}
        <div className="detail-box">
          <button
            className={`detail-header ${expandedSection === 'shipping' ? 'expanded' : ''}`}
            onClick={() => setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')}
          >
            <span>Shipping & Returns</span>
            {expandedSection === 'shipping' ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === 'shipping' && (
            <div className="detail-content">
              <ul>
                <li>Free shipping on orders over ৳500</li>
                <li>Delivery in 2-7 business days</li>
                <li>30-day money-back guarantee</li>
                <li>Hassle-free returns</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="rating-overview">
            <div className="big-rating">{product.rating?.toFixed(1) || '4.5'}</div>
            <div className="stars-large">{'⭐'.repeat(Math.floor(product.rating || 4.5))}</div>
            <p className="reviews-total">Based on {product.reviews || 0} reviews</p>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="rating-bar">
                <span className="stars-label">{'⭐'.repeat(stars)}</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${Math.random() * 80 + 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-list">
          {/* Review items would go here */}
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailEnhanced
