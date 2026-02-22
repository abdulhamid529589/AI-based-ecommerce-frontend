import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../../lib/axios'
import { Search, Loader, TrendingUp, Zap, Clock } from 'lucide-react'

const API_BASE_URL = ''

const AISearchComponent = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState({
    textSuggestions: [],
    categories: [],
    trendingSearches: [],
    highlightedCategories: [],
  })
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    inStockOnly: false,
  })
  const searchRef = useRef(null)
  const [recentSearches, setRecentSearches] = useState([])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [])

  // Debounced suggestion fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        fetchSuggestions()
      } else {
        setSuggestions({
          textSuggestions: [],
          categories: [],
          trendingSearches: [],
          highlightedCategories: [],
        })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/product/search/suggestions`, {
        params: { query },
      })
      if (response.data.success) {
        setSuggestions(response.data.data)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    }
  }

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/product/ai-search`, {
        query: searchQuery,
        filters,
        limit: 20,
        page: 1,
      })

      setSearchResults(response.data.data)

      // Add to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery).slice(0, 9),
      ]
      setRecentSearches(newRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))

      setShowSuggestions(false)
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search products, categories..."
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
          {loading && <Loader className="animate-spin text-blue-500" size={20} />}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Text Suggestions */}
            {suggestions.textSuggestions.length > 0 && (
              <div className="border-b p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Products</p>
                {suggestions.textSuggestions.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(text)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            {/* Highlighted Categories */}
            {suggestions.highlightedCategories.length > 0 && (
              <div className="border-b p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <Zap size={14} /> Categories
                </p>
                {suggestions.highlightedCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(cat.name)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {suggestions.trendingSearches.length > 0 && (
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <TrendingUp size={14} /> Trending Now
                </p>
                {suggestions.trendingSearches.map((trend, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(trend)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded"
                  >
                    {trend}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="border-t p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <Clock size={14} /> Recent
                </p>
                {recentSearches.slice(0, 5).map((recent, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(recent)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Options */}
      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: parseFloat(e.target.value) })}
          className="px-3 py-2 border rounded-lg text-sm w-28"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })}
          className="px-3 py-2 border rounded-lg text-sm w-28"
        />

        <label className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
          />
          In Stock
        </label>

        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.products && searchResults.products.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Results ({searchResults.pagination.total})</h3>
            <div className="text-sm text-gray-600">
              Page {searchResults.pagination.page} of {searchResults.pagination.totalPages}
            </div>
          </div>

          {/* Suggestions and Related Categories */}
          {searchResults.suggestions.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Did you mean:</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-sm hover:bg-blue-300"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchResults.products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
                <p className="text-lg font-bold text-blue-600">৳{product.price}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm">
                    {product.ratings} ({product.stock > 0 ? 'In Stock' : 'Out'})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AISearchComponent
