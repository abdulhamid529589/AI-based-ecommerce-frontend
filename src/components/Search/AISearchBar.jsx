import React, { useState, useEffect, useCallback } from 'react'
import { Search, Zap, TrendingUp, AlertCircle } from 'lucide-react'
import { getSearchSuggestionsAPI } from '../../services/searchAPI'
import './AISearchBar.css'

/**
 * AI-Powered Search Bar with Suggestions and Real-time Search
 */
const AISearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState({
    textSuggestions: [],
    categories: [],
    trendingSearches: [],
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]').slice(0, 5)
    } catch {
      return []
    }
  })

  // Debounced search suggestions
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions({ textSuggestions: [], categories: [], trendingSearches: [] })
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await getSearchSuggestionsAPI(searchQuery)
      setSuggestions(response.data || {})
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      setError('Failed to load suggestions')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce the fetch function
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, fetchSuggestions])

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Trigger search
    onSearch(searchQuery)
    setShowSuggestions(false)
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.setItem('recentSearches', JSON.stringify([]))
  }

  return (
    <div className="ai-search-container">
      <div className="ai-search-wrapper">
        <div className="ai-search-input-group">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query)
              }
            }}
            placeholder="Search products, categories, brands..."
            className="ai-search-input"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSuggestions({ textSuggestions: [], categories: [], trendingSearches: [] })
              }}
              className="search-clear-btn"
            >
              ✕
            </button>
          )}
          <button onClick={() => handleSearch(query)} className="search-submit-btn" title="Search">
            <Zap size={18} />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="ai-suggestions-panel">
            {/* Text Suggestions */}
            {suggestions.textSuggestions && suggestions.textSuggestions.length > 0 && (
              <div className="suggestions-section">
                <h4 className="suggestions-title">
                  <Search size={14} /> Suggestions
                </h4>
                <div className="suggestions-list">
                  {suggestions.textSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(suggestion)}
                      className="suggestion-item"
                    >
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {suggestions.categories && suggestions.categories.length > 0 && (
              <div className="suggestions-section">
                <h4 className="suggestions-title">
                  <TrendingUp size={14} /> Categories
                </h4>
                <div className="suggestions-list">
                  {suggestions.categories.map((category, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(category)}
                      className="suggestion-item category-item"
                    >
                      <span>{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {suggestions.trendingSearches && suggestions.trendingSearches.length > 0 && (
              <div className="suggestions-section">
                <h4 className="suggestions-title">
                  <TrendingUp size={14} /> Trending
                </h4>
                <div className="suggestions-list">
                  {suggestions.trendingSearches.map((trending, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(trending)}
                      className="suggestion-item trending-item"
                    >
                      <TrendingUp size={12} />
                      <span>{trending}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="suggestions-section">
                <div className="suggestions-header">
                  <h4 className="suggestions-title">Recent Searches</h4>
                  <button onClick={handleClearRecent} className="clear-recent">
                    Clear
                  </button>
                </div>
                <div className="suggestions-list">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(search)}
                      className="suggestion-item recent-item"
                    >
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="suggestions-section">
                <div className="suggestions-loading">
                  <div className="spinner-small"></div>
                  <span>Loading suggestions...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="suggestions-section">
                <div className="suggestions-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading &&
              !error &&
              query &&
              suggestions.textSuggestions.length === 0 &&
              suggestions.categories.length === 0 &&
              suggestions.trendingSearches.length === 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-empty">
                    <span>No suggestions found</span>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showSuggestions && (
        <div className="suggestions-overlay" onClick={() => setShowSuggestions(false)} />
      )}
    </div>
  )
}

export default AISearchBar
