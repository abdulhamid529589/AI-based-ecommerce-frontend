import React, { useState, useMemo } from 'react'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  TrendingUp,
  Filter,
} from 'lucide-react'
import './ProductsAmazonStyle.css'

const ProductsAmazonStyle = ({
  products = [],
  loading = false,
  totalProducts = 0,
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange = () => {},
  onFilterChange = () => {},
  onSortChange = () => {},
  onProductSelect = () => {},
  searchTerm = '',
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    rating: true,
    category: true,
  })
  const [hoveredProduct, setHoveredProduct] = useState(null)

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  const handleSortChange = (value) => {
    setSortBy(value)
    onSortChange?.(value)
  }

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  const FilterSection = ({ title, children, name }) => (
    <div className="filter-section">
      <button className="filter-header" onClick={() => toggleFilter(name)}>
        <span className="filter-title">{title}</span>
        {expandedFilters[name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {expandedFilters[name] && <div className="filter-content">{children}</div>}
    </div>
  )

  const ProductCard = ({ product, index }) => {
    const isHovered = hoveredProduct === index
    const rating = product.rating || 0
    const reviews = product.reviews || 0
    const discount = product.discount || 0

    return (
      <div
        className={`amazon-product-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredProduct(index)}
        onMouseLeave={() => setHoveredProduct(null)}
        onClick={() => onProductSelect?.(product.id || product._id)}
      >
        {/* Badge */}
        {discount > 0 && (
          <div className="discount-badge">
            <span className="discount-percent">-{discount}%</span>
          </div>
        )}

        {/* Image Section with Hover Actions */}
        <div className="card-image-wrapper">
          <img
            src={
              product.images?.[0]?.url ||
              product.image ||
              product.productImage ||
              '/placeholder.jpg'
            }
            alt={product.name}
            className="card-image"
            loading="lazy"
          />

          {/* Quick Actions - Show on Hover */}
          <div className="quick-actions">
            <button className="action-btn wishlist-btn" title="Add to wishlist">
              <Heart size={20} />
            </button>
            <button className="action-btn compare-btn" title="Compare">
              <ShoppingCart size={20} />
            </button>
            <button className="action-btn quick-view-btn" title="Quick view">
              <Eye size={20} />
            </button>
          </div>

          {/* Prime Badge */}
          {product.isPrime && (
            <div className="prime-badge">
              <span>Prime</span>
            </div>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="card-content">
          {/* Category */}
          {product.category && <p className="card-category">{product.category}</p>}

          {/* Title */}
          <h3 className="card-title">{product.name || product.title}</h3>

          {/* Ratings */}
          <div className="card-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(rating) ? 'filled' : ''} />
              ))}
            </div>
            <span className="rating-count">{rating.toFixed(1)}</span>
            <span className="review-count">({reviews})</span>
          </div>

          {/* Price Section */}
          <div className="card-price">
            <div className="price-row">
              <span className="currency">৳</span>
              <span className="current-price">
                {typeof product.price === 'string'
                  ? parseFloat(product.price).toLocaleString()
                  : product.price?.toLocaleString() || '0'}
              </span>
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <div className="original-price">
                <span className="currency">৳</span>
                <span className="strikethrough">{product.originalPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Quick Buy Button */}
          <button
            className="add-to-cart-quick"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.stopPropagation()
              onProductSelect?.(product.id || product._id)
            }}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          {/* Free Shipping Badge */}
          {product.freeShipping && (
            <div className="free-shipping">
              <span>FREE Shipping</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="products-amazon-style">
      {/* Header Bar */}
      <div className="amazon-header">
        <div className="header-content">
          <h1 className="page-title">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Shop All Products'}
          </h1>

          <div className="header-stats">
            <span className="results-count">{totalProducts.toLocaleString()} results</span>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          className="mobile-filter-toggle md:hidden"
          onClick={() => setShowMobileFilters(true)}
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      <div className="products-container">
        {/* Left Sidebar - Filters */}
        <aside className={`filters-sidebar ${showMobileFilters ? 'open' : ''}`}>
          <div className="filters-header md:hidden">
            <h2>Filters</h2>
            <button className="close-filters" onClick={() => setShowMobileFilters(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Sort Section */}
          <div className="sort-section">
            <label className="sort-label">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
              <option value="bestSellers">Best Sellers</option>
            </select>
          </div>

          {/* Price Filter */}
          <FilterSection title="Price" name="price">
            <div className="price-inputs">
              <div className="price-input-group">
                <label>Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="price-input"
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-group">
                <label>Max</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-input"
                />
              </div>
            </div>
            <button className="go-btn">Go</button>
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection title="Customer Reviews" name="rating">
            <div className="rating-filters">
              {[4, 3, 2, 1].map((stars) => (
                <label key={stars} className="rating-option">
                  <input
                    type="checkbox"
                    checked={selectedRating === stars}
                    onChange={() => setSelectedRating(stars)}
                  />
                  <div className="rating-display">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < stars ? 'filled' : ''} />
                    ))}
                    <span className="stars-label">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Availability Filter */}
          <FilterSection title="Availability" name="availability">
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>In Stock</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>Out of Stock</span>
            </label>
          </FilterSection>

          {/* Prime Filter */}
          <FilterSection title="Amazon Prime" name="prime">
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>Prime Eligible</span>
            </label>
          </FilterSection>

          {/* Merchant Filter */}
          <FilterSection title="Brand" name="brand">
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>All Brands</span>
            </label>
          </FilterSection>
        </aside>

        {/* Mobile Filter Backdrop */}
        {showMobileFilters && (
          <div className="filter-backdrop" onClick={() => setShowMobileFilters(false)} />
        )}

        {/* Products Grid */}
        <main className="products-main">
          {loading ? (
            <div className="loading-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="skeleton-image" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text short" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id || product._id || index}
                    product={product}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => onPageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <Search size={48} />
              <h2>No products found</h2>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProductsAmazonStyle
