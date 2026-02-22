/**
 * 🔍 Enhanced Search Experience - INSANE UX
 * Features: AI suggestions, Recent searches, Voice search, Image search
 */

import React, { useState, useRef, useEffect } from 'react'
import { Search, Mic, Camera, X, Loader, Zap } from 'lucide-react'
import './EnhancedSearch.css'

const EnhancedSearch = ({ onSearch, suggestions = [] }) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Initialize voice recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.onstart = () => setIsListening(true)
      recognitionRef.current.onend = () => setIsListening(false)
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')
        setQuery(transcript)
        handleSearch(transcript)
      }
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    // Show AI suggestions
    if (value.length > 2) {
      const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      setSearchSuggestions(filtered.slice(0, 8))
    } else {
      setSearchSuggestions([])
    }
  }

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))

      // Perform search
      onSearch(searchQuery)
      setIsFocused(false)
      setQuery('')
    }
  }

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    }
  }

  const handleImageSearch = async () => {
    // Placeholder for image search functionality
    alert('Image search coming soon!')
  }

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const popularSearches = [
    { term: 'Bedding Sets', icon: '🛏️' },
    { term: 'Pillows', icon: '🛌' },
    { term: 'Comforters', icon: '🧵' },
    { term: 'Curtains', icon: '🪟' },
  ]

  return (
    <div className="enhanced-search-wrapper">
      <div className={`enhanced-search ${isFocused ? 'focused' : ''}`}>
        {/* Search Input */}
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for products..."
            className="search-input"
          />

          {/* Voice & Image Buttons */}
          <div className="search-actions">
            <button
              className={`btn-voice ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceSearch}
              title="Voice Search"
            >
              {isListening ? <Loader className="icon-loading" size={18} /> : <Mic size={18} />}
            </button>

            <button className="btn-image" onClick={handleImageSearch} title="Image Search">
              <Camera size={18} />
            </button>

            {query && (
              <button className="btn-clear" onClick={clearSearch} title="Clear search">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Content */}
        {isFocused && (
          <div className="search-dropdown">
            {/* AI Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="suggestions-section">
                <h4>Suggestions</h4>
                <div className="suggestions-list">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSearch(suggestion)}
                    >
                      <Search size={16} />
                      <span>{suggestion}</span>
                      <span className="suggestion-shortcut">↵</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="recent-section">
                <h4>Recent Searches</h4>
                <div className="recent-list">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="recent-item"
                      onClick={() => handleSearch(search)}
                    >
                      <span className="recent-icon">↻</span>
                      <span>{search}</span>
                      <button
                        className="remove-recent"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRecentSearches(recentSearches.filter((_, i) => i !== index))
                        }}
                      >
                        ×
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!query && recentSearches.length === 0 && (
              <div className="popular-section">
                <h4>
                  <Zap size={16} />
                  Popular Searches
                </h4>
                <div className="popular-list">
                  {popularSearches.map((item, index) => (
                    <button
                      key={index}
                      className="popular-item"
                      onClick={() => handleSearch(item.term)}
                    >
                      <span className="popular-icon">{item.icon}</span>
                      <span>{item.term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Filters */}
            {query && (
              <div className="quick-filters">
                <span className="filter-label">Filter by:</span>
                <button className="filter-btn">Under ৳1000</button>
                <button className="filter-btn">৳1000-৳5000</button>
                <button className="filter-btn">Over ৳5000</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Feedback Overlay */}
      {isListening && (
        <div className="voice-feedback">
          <div className="voice-waves">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="wave" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
          <p>Listening...</p>
        </div>
      )}
    </div>
  )
}

export default EnhancedSearch
