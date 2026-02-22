import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { axiosInstance } from '../../lib/axios'

const SearchBar = ({ placeholder = 'Search products...', onSearch = null, isHomepage = false }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [trendingSearches, setTrendingSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5))
    }

    // Fetch trending searches
    fetchTrendingSearches()
  }, [])

  // Debounced search suggestions
  useEffect(() => {
    if (query.length > 1) {
      setLoading(true)
      const timer = setTimeout(() => {
        fetchSuggestions()
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setLoading(false)
    }
  }, [query])

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get('/product/search/suggestions', {
        params: { q: query, limit: 8 },
      })

      if (response.data.success) {
        setSuggestions(response.data.suggestions || [])
      }
    } catch (error) {
      console.error('Search suggestions error:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingSearches = async () => {
    try {
      const response = await axiosInstance.get('/product/search/trending')
      if (response.data.success) {
        setTrendingSearches(response.data.trending || [])
      }
    } catch (error) {
      console.error('Trending searches error:', error)
    }
  }

  const handleSearch = (searchTerm = query) => {
    if (searchTerm.trim().length === 0) return

    // Add to recent searches
    const searches = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)
    setRecentSearches(searches)
    localStorage.setItem('recentSearches', JSON.stringify(searches))

    // Navigate to search results
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
    setShowSuggestions(false)
    setQuery('')

    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name)
    handleSearch(suggestion.name)
  }

  const clearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isHomepage ? 'text-lg py-3' : ''
          }`}
        />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              searchInputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length > 0 || !isHomepage) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {loading && query.length > 1 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Product Suggestions */}
          {suggestions.length > 0 && !loading && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                Products
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  {suggestion.image && (
                    <img
                      src={suggestion.image}
                      alt={suggestion.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ৳{suggestion.price?.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* No Results Found */}
          {query.length > 1 && suggestions.length === 0 && !loading && (
            <div className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
              <p className="mb-2">No products found for "{query}"</p>
              <p className="text-sm">Try different keywords</p>
            </div>
          )}

          {/* Recent Searches (when query is empty) */}
          {query.length === 0 && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between sticky top-0">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </span>
                <button
                  onClick={clearRecent}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <Clock className="w-4 h-4 inline mr-2 text-gray-400" />
                  {search}
                </button>
              ))}
            </>
          )}

          {/* Trending Searches (when query is empty) */}
          {query.length === 0 && trendingSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Trending Now
              </div>
              {trendingSearches.slice(0, 5).map((trend, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(trend)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mr-2">
                    #{index + 1}
                  </span>
                  {trend}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
      )}
    </div>
  )
}

export default SearchBar
