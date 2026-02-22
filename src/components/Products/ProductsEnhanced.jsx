import React, { useState, useEffect } from 'react'
import { Grid, List, Sliders, X, ChevronDown } from 'lucide-react'
import './ProductsEnhanced.css'

const ProductsEnhanced = ({
  products = [],
  loading = false,
  totalProducts = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange = () => {},
  onFilterChange = () => {},
  onSortChange = () => {},
  searchTerm = '',
  categories = [],
  priceRange = [0, 100000],
}) => {
  const [viewMode, setViewMode] = useState('grid') // grid | list
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevant')
  const [selectedFilters, setSelectedFilters] = useState({})

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  const handleSortChange = (value) => {
    setSortBy(value)
    onSortChange?.(value)
  }

  return (
    <div className="products-enhanced">
      {/* Header with search and view toggle */}
      <div className="products-header">
        <div className="header-left">
          <h1 className="products-title">
            {searchTerm ? `Results for "${searchTerm}"` : 'All Products'}
          </h1>
          <p className="results-count">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts}
          </p>
        </div>

        <div className="header-controls md:flex hidden">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="relevant">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={16} className="dropdown-icon" />
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden mobile-filter-btn-wrapper">
        <button className="mobile-filter-btn" onClick={() => setShowMobileFilters(true)}>
          <Sliders size={18} />
          <span>Filters</span>
        </button>
        <div className="sort-dropdown-mobile">
          <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="relevant">Most Relevant</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="products-main">
        {/* Desktop Sidebar */}
        <div className="products-sidebar md:flex hidden">
          {/* Category Filter */}
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-options">
              {categories.map((cat) => (
                <label key={cat.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFilters[cat.id] || false}
                    onChange={() => {
                      setSelectedFilters({
                        ...selectedFilters,
                        [cat.id]: !selectedFilters[cat.id],
                      })
                    }}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-filter">
              <input
                type="number"
                min="0"
                placeholder="Min"
                className="price-input"
                defaultValue={priceRange[0]}
              />
              <span>-</span>
              <input
                type="number"
                max="100000"
                placeholder="Max"
                className="price-input"
                defaultValue={priceRange[1]}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h3>Rating</h3>
            <div className="filter-options">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="filter-checkbox">
                  <input type="checkbox" />
                  <span>{'⭐'.repeat(rating)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={`products-container products-${viewMode}`}>
          {loading ? (
            <div className="loading-state">
              <div className="skeleton-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            </div>
          ) : products.length > 0 ? (
            <>
              {products.map((product) => (
                <div key={product.id} className={`product-cell product-${viewMode}`}>
                  {/* Your product card component here */}
                  <div className="product-cell-content">
                    <div className="product-image">
                      <img src={product.images?.[0]?.url || product.image} alt={product.name} />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                    </div>
                    <div className="product-info">
                      <h4 className="product-name">{product.name}</h4>
                      <div className="product-rating">
                        <span className="stars">
                          {'⭐'.repeat(Math.floor(product.rating || 4))}
                        </span>
                        <span className="reviews">({product.reviews || 0})</span>
                      </div>
                      <div className="product-pricing">
                        <span className="price">৳{product.price?.toLocaleString('bn-BD')}</span>
                        {product.originalPrice && (
                          <span className="original-price">
                            ৳{product.originalPrice?.toLocaleString('bn-BD')}
                          </span>
                        )}
                      </div>
                      <button className="btn-add-cart">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-state">
              <p>No products found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="products-pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductsEnhanced
