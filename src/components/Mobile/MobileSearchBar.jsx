import React, { useState, useRef, useEffect } from 'react'
import { Mic, X, Search, Loader } from 'lucide-react'
import './MobileSearchBar.css'

const MobileSearchBar = ({ onSearch, onVoiceSearch, onQRScan, suggestions = [] }) => {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const searchInputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Initialize voice recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'bn-BD'

      recognitionRef.current.onstart = () => setIsListening(true)

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setQuery(finalTranscript)
          handleSearch(finalTranscript)
          setIsListening(false)
          onVoiceSearch?.(finalTranscript)
        }
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [onVoiceSearch])

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search not supported in your browser')
      return
    }

    if (isListening) {
      recognitionRef.current.abort()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
    }
  }

  const handleInputChange = (value) => {
    setQuery(value)

    // Filter suggestions
    if (value.trim()) {
      const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      onSearch?.(searchQuery)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    onSearch?.(suggestion)
  }

  return (
    <div className="mobile-search-bar md:hidden">
      <div className="search-input-wrapper">
        <Search size={20} className="search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          className="search-input"
        />

        {query && (
          <button
            className="clear-btn"
            onClick={() => {
              setQuery('')
              setShowSuggestions(false)
              searchInputRef.current?.focus()
            }}
          >
            <X size={18} />
          </button>
        )}

        <button
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceSearch}
          title="Voice search"
        >
          {isListening ? <Loader size={18} className="animate-spin" /> : <Mic size={18} />}
        </button>

        <button className="qr-btn" onClick={onQRScan} title="QR scan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <path d="M3 14h4v4H3z" />
            <path d="M11 11v2" />
            <path d="M11 17v2" />
          </svg>
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="search-suggestions">
          {filteredSuggestions.slice(0, 5).map((suggestion, idx) => (
            <button
              key={idx}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Search size={16} />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MobileSearchBar
