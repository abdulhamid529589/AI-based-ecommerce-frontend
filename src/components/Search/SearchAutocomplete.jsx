import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, Clock, Zap, TrendingUp, X, Filter } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../styles/SearchAutocomplete.css'

const SearchAutocomplete = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [trendingSearches, setTrendingSearches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [cache, setCache] = useState({})
  const searchInputRef = useRef(null)
  const debounceRef = useRef(null)
  const navigate = useNavigate()
  const products = useSelector((state) => state.products?.items || [])

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(products.map((p) => p.category).filter(Boolean))]
  }, [products])

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent.slice(0, 5))

    setTrendingSearches([
      { term: 'Wireless Earbuds', count: 1250 },
      { term: 'Smart Watch', count: 950 },
      { term: 'Phone Cases', count: 850 },
      { term: 'USB Cables', count: 720 },
      { term: 'Laptop Stand', count: 680 },
    ])
  }, [])

  // Auto-focus on search input
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Optimized search with debouncing and caching
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      setSelectedIndex(-1)
      return
    }

    // Check cache first
    const cacheKey = `${searchTerm}-${selectedFilter}`
    if (cache[cacheKey]) {
      setSuggestions(cache[cacheKey])
      setIsLoading(false)
      return
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    setIsLoading(true)

    // Debounce the search
    debounceRef.current = setTimeout(() => {
      const term = searchTerm.toLowerCase()

      // Filter products by selected category
      const filteredProducts =
        selectedFilter === 'all' ? products : products.filter((p) => p.category === selectedFilter)

      // Optimized filtering with weighted search
      const productSuggestions = filteredProducts
        .filter((product) => {
          const nameMatch = product.name.toLowerCase().includes(term)
          const categoryMatch = product.category?.toLowerCase().includes(term)
          return nameMatch || categoryMatch
        })
        .sort((a, b) => {
          // Prioritize name matches
          const aNameMatch = a.name.toLowerCase().indexOf(term)
          const bNameMatch = b.name.toLowerCase().indexOf(term)
          return aNameMatch - bNameMatch
        })
        .slice(0, 8)
        .map((product) => ({
          id: product._id || product.id,
          name: product.name,
          type: 'product',
          price: product.price,
          image: product.images?.[0]?.url,
          category: product.category,
        }))

      const categorySuggestions =
        selectedFilter === 'all'
          ? [
              ...new Set(
                products
                  .filter((p) => p.category?.toLowerCase().includes(term))
                  .map((p) => p.category),
              ),
            ]
              .slice(0, 3)
              .map((category) => ({
                type: 'category',
                name: category,
              }))
          : []

      const results = [...productSuggestions, ...categorySuggestions]

      // Cache results
      setCache((prev) => ({ ...prev, [cacheKey]: results }))
      setSuggestions(results)
      setSelectedIndex(-1)
      setIsLoading(false)
    }, 200) // Reduced debounce time for faster feedback

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchTerm, products, selectedFilter, cache])

  const handleSearch = (term) => {
    const searchQuery = term || searchTerm
    if (!searchQuery.trim()) return

    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const updated = [searchQuery, ...recent.filter((s) => s !== searchQuery)].slice(0, 10)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    onClose()
  }

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`)
    onClose()
  }

  const handleSelectCategory = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`)
    onClose()
  }

  const handleKeyDown = (e) => {
    const totalItems = suggestions.length + (searchTerm ? 0 : trendingSearches.length)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % totalItems)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const item = suggestions[selectedIndex]
        if (item.type === 'product') {
          handleSelectProduct(item.id)
        } else if (item.type === 'category') {
          handleSelectCategory(item.name)
        }
      } else if (searchTerm.trim()) {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedIndex(-1)
  }

  const clearRecentSearch = (search) => {
    const updated = recentSearches.filter((s) => s !== search)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  return (
    <div className="search-autocomplete-overlay" onClick={onClose}>
      <div className="search-autocomplete-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search className="search-input-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
            autoComplete="off"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="search-clear-btn" aria-label="Clear search">
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="search-keyboard-hints">
            <kbd title="Navigate">↑↓</kbd>
            <kbd title="Select">↵</kbd>
            <kbd title="Close">ESC</kbd>
          </div>
        </div>

        {/* Category Filters - Show when search is active */}
        {searchTerm && categories.length > 1 && (
          <div className="search-category-filter">
            <Filter className="filter-icon" />
            {categories.slice(0, 5).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`category-filter-btn ${selectedFilter === category ? 'active' : ''}`}
                title={category === 'all' ? 'All categories' : category}
              >
                {category === 'all' ? 'All' : category.substring(0, 10)}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="search-content">
          {/* Loading Skeleton */}
          {isLoading && searchTerm && (
            <div className="search-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-subtitle"></div>
                    <div className="skeleton-line skeleton-price"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="search-loading">
              <div className="search-spinner"></div>
              <p>Finding great products for you...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchTerm && suggestions.length === 0 && (
            <div className="search-empty">
              <p>No products found for "{searchTerm}"</p>
              <button onClick={() => handleSearch()} className="search-suggest-btn">
                Search anyway →
              </button>
            </div>
          )}

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="search-suggestions">
              <div className="search-section">
                <div className="search-section-products">
                  {suggestions
                    .filter((s) => s.type === 'product')
                    .map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className={`search-suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
                      >
                        <img
                          src={product.images?.[0]?.url || product.image}
                          alt={product.name}
                          className="suggestion-img"
                        />
                        <div className="suggestion-content">
                          <p className="suggestion-name">{product.name}</p>
                          <p className="suggestion-category">{product.category}</p>
                          <p className="suggestion-price">৳{Math.round(product.price)}</p>
                        </div>
                      </button>
                    ))}
                </div>

                {suggestions.filter((s) => s.type === 'category').length > 0 && (
                  <div className="search-section-categories">
                    <h4 className="search-section-title">Categories</h4>
                    {suggestions
                      .filter((s) => s.type === 'category')
                      .map((category, index) => (
                        <button
                          key={category.name}
                          onClick={() => handleSelectCategory(category.name)}
                          className={`search-category-item ${
                            selectedIndex ===
                            suggestions.filter((s) => s.type === 'product').length + index
                              ? 'selected'
                              : ''
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                          {category.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && !searchTerm && recentSearches.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="search-recent-list">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="search-recent-item"
                  >
                    <Clock className="w-4 h-4" />
                    {search}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        clearRecentSearch(search)
                      }}
                      className="recent-remove-btn"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!isLoading && !searchTerm && (
            <div className="search-section">
              <h3 className="search-section-title">
                <TrendingUp className="w-4 h-4" />
                Trending Now
              </h3>
              <div className="search-trending-grid">
                {trendingSearches.map((trend, index) => (
                  <button
                    key={trend.term}
                    onClick={() => handleSearch(trend.term)}
                    className={`search-trending-item ${selectedIndex === recentSearches.length + index ? 'selected' : ''}`}
                  >
                    <span className="trending-rank">#{index + 1}</span>
                    <p className="trending-term">{trend.term}</p>
                    <p className="trending-count">{trend.count} searches</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchAutocomplete
