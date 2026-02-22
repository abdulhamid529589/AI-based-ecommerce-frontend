import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import '../../styles/ProductDescriptionSection.css'

const ProductDescriptionSection = ({ description, specifications = null, features = null }) => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    features: false,
    specifications: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Parse description by double newlines or look for bullet points
  const parseDescription = (desc) => {
    if (!desc) return []

    // Check if description contains bullet points or line breaks
    if (desc.includes('\n') || desc.includes('•') || desc.includes('-')) {
      return desc.split('\n').filter((line) => line.trim())
    }

    // Split by periods for sentences
    const sentences = desc.split(/(?<=[.!?])\s+/)
    const paragraphs = []
    let currentParagraph = []

    sentences.forEach((sentence, index) => {
      currentParagraph.push(sentence)

      // Create new paragraph every 2-3 sentences
      if (currentParagraph.length >= 2 || index === sentences.length - 1) {
        paragraphs.push(currentParagraph.join(' '))
        currentParagraph = []
      }
    })

    return paragraphs.filter((p) => p.trim())
  }

  // Extract features from description
  const extractFeatures = (desc) => {
    const featurePatterns = [
      /(?:features?:|✓|●|•)\s*([^.\n]+)/gi,
      /\b(high quality|lightweight|durable|waterproof|wireless|portable|advanced|powerful|efficient)\b/gi,
    ]

    const foundFeatures = new Set()

    featurePatterns.forEach((pattern) => {
      let match
      while ((match = pattern.exec(desc)) !== null) {
        if (match[1]) {
          foundFeatures.add(match[1].trim())
        }
      }
    })

    return Array.from(foundFeatures).slice(0, 6)
  }

  const descriptionParagraphs = parseDescription(description)
  const extractedFeatures = features || (description ? extractFeatures(description) : [])

  return (
    <div className="product-description-section">
      {/* Main Description */}
      <div className="description-block">
        <button onClick={() => toggleSection('description')} className="description-header">
          <div className="header-content">
            <h3>Product Description</h3>
            <span className="header-subtitle">Details about this product</span>
          </div>
          <div className="toggle-icon">
            {expandedSections.description ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </button>

        {expandedSections.description && (
          <div className="description-content">
            {descriptionParagraphs.length > 0 ? (
              <div className="description-paragraphs">
                {descriptionParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="description-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="description-paragraph">{description}</p>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      {extractedFeatures.length > 0 && (
        <div className="description-block">
          <button onClick={() => toggleSection('features')} className="description-header">
            <div className="header-content">
              <h3>Key Features</h3>
              <span className="header-subtitle">{extractedFeatures.length} features</span>
            </div>
            <div className="toggle-icon">
              {expandedSections.features ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {expandedSections.features && (
            <div className="features-content">
              <ul className="features-list">
                {extractedFeatures.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="feature-dot">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Specifications Section */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div className="description-block">
          <button onClick={() => toggleSection('specifications')} className="description-header">
            <div className="header-content">
              <h3>Specifications</h3>
              <span className="header-subtitle">{Object.keys(specifications).length} specs</span>
            </div>
            <div className="toggle-icon">
              {expandedSections.specifications ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {expandedSections.specifications && (
            <div className="specifications-content">
              <div className="specifications-grid">
                {Object.entries(specifications).map(([key, value], idx) => (
                  <div key={idx} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductDescriptionSection
