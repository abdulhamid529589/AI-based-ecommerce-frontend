import { Link, useLocation } from 'react-router-dom'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import './NotFound.css'

const NotFound = () => {
  const location = useLocation()
  const [showDetails, setShowDetails] = useState(false)

  const suggestedPages = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'All Products' },
    { path: '/cart', label: 'Shopping Cart' },
    { path: '/orders', label: 'My Orders' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
  ]

  return (
    <div className="not-found-container">
      <div className="not-found-wrapper">
        {/* 404 Display */}
        <div className="not-found-header">
          <div className="not-found-number">404</div>
          <h1 className="not-found-title">Oops! Page Not Found</h1>
          <p className="not-found-message">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </div>

        {/* Requested URL Info */}
        <div className="requested-url">
          <div className="url-icon">
            <Search className="w-4 h-4" />
          </div>
          <div className="url-text">
            <small>You tried to access:</small>
            <code className="url-path">{location.pathname}</code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="not-found-actions">
          <Link to="/" className="btn-home">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link to={-1} className="btn-back">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>
        </div>

        {/* Suggested Pages */}
        <div className="suggested-pages">
          <h3 className="suggested-title">Maybe you're looking for:</h3>
          <div className="suggested-grid">
            {suggestedPages.map((page) => (
              <Link key={page.path} to={page.path} className="suggested-link">
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <button onClick={() => setShowDetails(!showDetails)} className="details-toggle">
            <HelpCircle className="w-4 h-4" />
            Troubleshooting
          </button>

          {showDetails && (
            <div className="details-content">
              <h4>Why am I seeing this page?</h4>
              <ul>
                <li>The URL might be misspelled or outdated</li>
                <li>The page might have been moved or deleted</li>
                <li>You might not have permission to access this page</li>
                <li>There could be a temporary server issue</li>
              </ul>

              <h4>What can you do?</h4>
              <ul>
                <li>Check the URL spelling</li>
                <li>Try searching for the product or content</li>
                <li>Contact our support team if you think this is an error</li>
                <li>Browse our categories to find what you need</li>
              </ul>

              <div className="contact-support">
                <p>
                  Need help? <Link to="/contact">Contact Support</Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="not-found-footer">
          <p className="error-code">Error Code: 404 - Not Found</p>
          <p className="timestamp">Timestamp: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
