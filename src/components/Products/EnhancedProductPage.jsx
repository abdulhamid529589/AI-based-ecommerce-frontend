import React, { useState } from 'react'
import './EnhancedProductPage.css'

/**
 * Enhanced Product Page Component
 * Features: Specs, reviews, related products, Q&A
 */
const EnhancedProductPage = ({ product = {} }) => {
  const [activeTab, setActiveTab] = useState('details')
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isExpanded, setIsExpanded] = useState({})

  const tabs = ['details', 'reviews', 'qa', 'shipping', 'returns']

  // Toggle specification expansion
  const toggleSpec = (spec) => {
    setIsExpanded((prev) => ({
      ...prev,
      [spec]: !prev[spec],
    }))
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes) {
      alert('Please select a size')
      return
    }
    console.log('Adding to cart:', {
      product: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
  }

  return (
    <div className="enhanced-product-page">
      {/* Product Header */}
      <div className="product-header">
        <div className="breadcrumb">
          <a href="/">Home</a>
          {product.category && (
            <>
              <span>/</span>
              <a href={`/category/${product.category}`}>{product.category}</a>
            </>
          )}
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-title-section">
          <h1>{product.name}</h1>
          <div className="rating-section">
            <div className="stars">
              {'⭐'.repeat(Math.floor(product.ratings || 0))}
              {(product.ratings || 0) % 1 > 0 && '✨'}
            </div>
            <span className="rating-value">{(product.ratings || 0).toFixed(1)}</span>
            <span className="review-count">({product.review_count || 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* Price & Stock Info */}
      <div className="price-stock-section">
        <div className="price-info">
          <span className="current-price">${product.price?.toFixed(2)}</span>
          {product.original_price && product.original_price > product.price && (
            <>
              <span className="original-price">${product.original_price?.toFixed(2)}</span>
              <span className="discount-badge">
                -
                {Math.round(
                  ((product.original_price - product.price) / product.original_price) * 100,
                )}
                %
              </span>
            </>
          )}
        </div>

        <div className="stock-info">
          {product.stock > 10 ? (
            <span className="in-stock">✓ In Stock ({product.stock} available)</span>
          ) : product.stock > 0 ? (
            <span className="limited-stock">⚠️ Limited Stock ({product.stock} left)</span>
          ) : (
            <span className="out-of-stock">✗ Out of Stock</span>
          )}
        </div>
      </div>

      {/* Product Options */}
      <div className="product-options">
        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="option-group">
            <label>Size:</label>
            <div className="size-selector">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button className="size-guide">? Size Guide</button>
          </div>
        )}

        {/* Color Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="option-group">
            <label>Color:</label>
            <div className="color-selector">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor === color && '✓'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="option-group">
          <label>Quantity:</label>
          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-button">
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button onClick={() => setQuantity(quantity + 1)} className="qty-button">
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-actions">
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
        <button className="btn-wishlist">❤️ Add to Wishlist</button>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="badge">✓ Free Shipping on Orders Over $50</div>
        <div className="badge">✓ 30-Day Money Back Guarantee</div>
        <div className="badge">✓ Secure Checkout</div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="details-tab">
              <div className="description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="specifications">
                <h3>Specifications</h3>
                {product.specs &&
                  Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <div
                        className="spec-header"
                        onClick={() => toggleSpec(key)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="spec-key">{key}</span>
                        <span className="spec-toggle">{isExpanded[key] ? '▼' : '▶'}</span>
                      </div>
                      {isExpanded[key] && <div className="spec-value">{value}</div>}
                    </div>
                  ))}
              </div>

              <div className="features">
                <h3>Key Features</h3>
                <ul>
                  {product.features?.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <h3>Customer Reviews</h3>
              <div className="reviews-list">
                {product.reviews?.length > 0 ? (
                  product.reviews.map((review, idx) => (
                    <div key={idx} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.user_name}</span>
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="qa-tab">
              <h3>Questions & Answers</h3>
              <p className="qa-info">Have a question? Ask our customers!</p>
              <button className="btn-ask-question">Ask a Question</button>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="shipping-tab">
              <h3>Shipping Information</h3>
              <div className="shipping-info">
                <p>
                  <strong>Shipping Methods:</strong> Standard (5-7 days), Express (2-3 days),
                  Overnight
                </p>
                <p>
                  <strong>Free Shipping:</strong> Orders over $50
                </p>
                <p>
                  <strong>International:</strong> Available to select countries
                </p>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="returns-tab">
              <h3>Returns & Refunds</h3>
              <div className="returns-info">
                <p>
                  <strong>30-Day Money Back Guarantee:</strong> Full refund if not satisfied
                </p>
                <p>
                  <strong>Free Returns:</strong> Free return shipping for defective items
                </p>
                <p>
                  <strong>Processing Time:</strong> Refunds processed within 5-7 business days
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="related-products">
          <h3>You Might Also Like</h3>
          <div className="products-grid">
            {product.related_products.map((relatedProduct) => (
              <div key={relatedProduct.id} className="product-card">
                <img src={relatedProduct.image} alt={relatedProduct.name} />
                <h4>{relatedProduct.name}</h4>
                <p className="price">${relatedProduct.price.toFixed(2)}</p>
                <button className="btn-view">View Product</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedProductPage
