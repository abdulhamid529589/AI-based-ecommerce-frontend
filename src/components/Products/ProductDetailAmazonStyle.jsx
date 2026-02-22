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
  MapPin,
  Gift,
  Lock,
  MessageCircle,
} from 'lucide-react'
import './ProductDetailAmazonStyle.css'

const ProductDetailAmazonStyle = ({
  product = {},
  onAddToCart = () => {},
  onBuyNow = () => {},
  onAddToWishlist = () => {},
  onShare = () => {},
  allProducts = [],
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [expandedSection, setExpandedSection] = useState('description')
  const [showAskQuestion, setShowAskQuestion] = useState(false)

  const images = product.images || [{ url: product.image || product.productImage }]
  const mainImage = images[selectedImage]?.url || product.image || product.productImage
  const rating = product.rating || 4.5
  const reviews = product.reviews || 0
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const originalPrice = product.originalPrice || product.original_price || 0
  const discount =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const relatedProducts = allProducts
    .filter(
      (p) => p.category === product.category && (p.id || p._id) !== (product.id || product._id),
    )
    .slice(0, 6)

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
    onAddToWishlist?.(product)
  }

  const ExpandableSection = ({ title, children, sectionName }) => (
    <div className="expandable-section">
      <button
        className={`section-header ${expandedSection === sectionName ? 'expanded' : ''}`}
        onClick={() => setExpandedSection(expandedSection === sectionName ? null : sectionName)}
      >
        <span className="section-title">{title}</span>
        {expandedSection === sectionName ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expandedSection === sectionName && <div className="section-content">{children}</div>}
    </div>
  )

  return (
    <div className="product-detail-amazon">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/products">{product.category}</a>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="detail-container">
        {/* Left: Image Gallery */}
        <div className="detail-left">
          {/* Main Image */}
          <div className="main-image-container">
            <div className="main-image-box">
              {product.isPrime && <div className="prime-badge">Prime</div>}
              {discount > 0 && <div className="discount-badge-large">-{discount}%</div>}
              <img src={mainImage} alt={product.name} className="main-image" />
            </div>

            {/* Zoom Info */}
            <div className="zoom-info">
              <span>Hover to zoom</span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="thumbnails">
              {images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img.url} alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Share & Wishlist Buttons */}
          <div className="detail-actions-left">
            <button className="action-link" onClick={() => onShare?.()}>
              <Share2 size={18} />
              Share
            </button>
            <button
              className={`action-link ${isInWishlist ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              <Heart size={18} />
              {isInWishlist ? 'In Wishlist' : 'Wishlist'}
            </button>
          </div>
        </div>

        {/* Middle: Product Info */}
        <div className="detail-middle">
          {/* Title */}
          <h1 className="product-title">{product.name}</h1>

          {/* Rating Bar */}
          <div className="rating-bar">
            <div className="stars-group">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.floor(rating) ? 'filled' : ''} />
              ))}
            </div>
            <span className="rating-number">{rating.toFixed(1)}</span>
            <a href="#reviews" className="review-link">
              {reviews.toLocaleString()} Reviews
            </a>
          </div>

          {/* Price Info */}
          <div className="price-section">
            <div className="price-container">
              {originalPrice > price && (
                <span className="original-price">৳{originalPrice.toLocaleString()}</span>
              )}
              <span className="current-price">৳{price.toLocaleString()}</span>
              {discount > 0 && <span className="discount-text">{discount}% off</span>}
            </div>

            <div className="savings-info">
              {discount > 0 && (
                <span>
                  You Save: ৳{(originalPrice - price).toLocaleString()} ({discount}%)
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            {product.stock > 5 ? (
              <span className="in-stock">In Stock</span>
            ) : product.stock > 0 ? (
              <span className="low-stock">Only {product.stock} left in stock - order soon.</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {/* Trust Signals */}
          <div className="trust-signals">
            <div className="signal">
              <Lock size={16} />
              <span>Secure transaction</span>
            </div>
            <div className="signal">
              <Truck size={16} />
              <span>Free delivery available</span>
            </div>
            <div className="signal">
              <RotateCcw size={16} />
              <span>30-day return policy</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="highlights-section">
            <h3>Key Features:</h3>
            <ul className="highlights-list">
              {product.highlights
                ?.slice(0, 5)
                .map((highlight, idx) => <li key={idx}>{highlight}</li>) || (
                <li>{product.description?.substring(0, 100)}...</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right: Buy Box */}
        <div className="detail-right">
          <div className="buy-box">
            {/* Pricing in Buy Box */}
            <div className="buybox-price">
              <span className="price-label">Price:</span>
              <span className="price-value">৳{price.toLocaleString()}</span>
            </div>

            {/* Stock Status in Buy Box */}
            <div className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? <span>✓ In Stock</span> : <span>Out of Stock</span>}
            </div>

            {/* Delivery Info */}
            <div className="delivery-info">
              <div className="delivery-item">
                <Truck size={18} />
                <div>
                  <div className="delivery-label">FREE Delivery</div>
                  <div className="delivery-date">Thursday, January 23</div>
                </div>
              </div>

              <div className="delivery-item">
                <MapPin size={18} />
                <div>
                  <div className="delivery-label">Deliver to Dhaka</div>
                  <a href="#">Change location</a>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input type="number" value={quantity} readOnly />
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={quantity >= (product.stock || 10)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn-add-to-cart"
                onClick={() => onAddToCart?.({ ...product, quantity })}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                className="btn-buy-now"
                onClick={() => onBuyNow?.({ ...product, quantity })}
                disabled={product.stock === 0}
              >
                <Zap size={20} />
                Buy Now
              </button>
            </div>

            {/* Promo Offers */}
            <div className="promo-box">
              <span className="promo-label">Special Offers</span>
              <div className="promo-items">
                <div className="promo-item">
                  <Gift size={14} />
                  <span>Free gift with purchase</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="seller-info-box">
              <span className="seller-label">Sold by:</span>
              <span className="seller-name">{product.seller || 'Official Store'}</span>
              <a href="#" className="see-all-seller">
                See all offers
              </a>
            </div>

            {/* Payment Options */}
            <div className="payment-options">
              <p>Payment Options</p>
              <div className="payment-methods">
                <span>Credit Card</span>
                <span>Debit Card</span>
                <span>Mobile Banking</span>
              </div>
            </div>
          </div>

          {/* Report Link */}
          <button className="report-link">Report an issue with this product</button>
        </div>
      </div>

      {/* Description & Details */}
      <div className="details-section">
        <h2>Product Details</h2>

        <ExpandableSection title="Description" sectionName="description">
          <div className="section-text">{product.description || 'No description available'}</div>
        </ExpandableSection>

        <ExpandableSection title="Specifications" sectionName="specifications">
          <table className="specs-table">
            <tbody>
              {product.specs?.map((spec, idx) => (
                <tr key={idx}>
                  <td className="spec-label">{spec.label}</td>
                  <td className="spec-value">{spec.value}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="2">No specifications available</td>
                </tr>
              )}
            </tbody>
          </table>
        </ExpandableSection>

        <ExpandableSection title="Shipping & Returns" sectionName="shipping">
          <div className="shipping-info">
            <h4>Shipping Information</h4>
            <p>Free shipping on orders over ৳500. Standard delivery within 3-5 business days.</p>
            <h4>Return Policy</h4>
            <p>30-day returns. Items must be in original condition with all packaging.</p>
          </div>
        </ExpandableSection>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" id="reviews">
        <h2>Customer Reviews</h2>

        <div className="reviews-summary">
          <div className="rating-overview">
            <div className="big-rating">{rating.toFixed(1)}</div>
            <div className="stars-review">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < Math.floor(rating) ? 'filled' : ''} />
              ))}
            </div>
            <span className="total-reviews">{reviews} customer reviews</span>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="breakdown-row">
                <span className="breakdown-label">{stars} star</span>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${Math.random() * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          <h3>Top Reviews</h3>
          {reviews > 0 ? (
            <div className="review-items">
              {[...Array(Math.min(5, reviews))].map((_, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">Customer {idx + 1}</span>
                      <span className="verified-badge">✓ Verified Purchase</span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < 4 ? 'filled' : ''} />
                    ))}
                  </div>
                  <div className="review-content">
                    <p className="review-title">Great product, highly recommend</p>
                    <p className="review-text">
                      This product is excellent quality and delivery was fast. Very happy with my
                      purchase.
                    </p>
                  </div>
                  <div className="review-footer">
                    <span className="review-date">2 weeks ago</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Ask Question */}
        <div className="ask-question-section">
          <button className="ask-question-btn" onClick={() => setShowAskQuestion(!showAskQuestion)}>
            <MessageCircle size={18} />
            Ask a Question
          </button>

          {showAskQuestion && (
            <div className="question-form">
              <textarea
                placeholder="Ask fellow customers or sellers for details about this product..."
                rows={3}
              />
              <button className="submit-question">Submit Question</button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Customers Also Bought</h2>
          <div className="related-grid">
            {relatedProducts.map((p) => (
              <div key={p.id || p._id} className="related-product-card">
                <div className="related-image">
                  <img src={p.image || p.productImage || '/placeholder.jpg'} alt={p.name} />
                </div>
                <h4>{p.name}</h4>
                <div className="related-price">
                  ৳{(typeof p.price === 'string' ? parseFloat(p.price) : p.price).toLocaleString()}
                </div>
                <button className="related-add-btn">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailAmazonStyle
