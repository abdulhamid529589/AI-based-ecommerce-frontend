/**
 * ColorFilter Component
 * Filter products by color with visual swatches
 */

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './ColorFilter.css'

function ColorFilter({ colors = [], activeFilters = [], onFilterChange, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded)
  const [showTooltip, setShowTooltip] = useState(null)

  const handleToggle = (colorId) => {
    onFilterChange('color', colorId)
  }

  const availableColors = colors.filter((c) => c.count > 0)

  return (
    <div className="filter-section color-filter">
      <div className="filter-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="filter-title">
          Color
          {activeFilters.length > 0 && <span className="filter-badge">{activeFilters.length}</span>}
        </h3>
        <ChevronDown size={20} className={`filter-icon ${expanded ? 'expanded' : ''}`} />
      </div>

      {expanded && (
        <div className="filter-content">
          <div className="color-grid">
            {availableColors.length > 0 ? (
              availableColors.map((color) => (
                <div
                  key={color.id}
                  className="color-swatch-wrapper"
                  onMouseEnter={() => setShowTooltip(color.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <button
                    className={`color-swatch ${activeFilters.includes(color.id) ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleToggle(color.id)}
                    title={color.label}
                    aria-label={`Filter by ${color.label}`}
                  >
                    {activeFilters.includes(color.id) && <span className="color-checkmark">✓</span>}
                  </button>
                  <div className={`color-tooltip ${showTooltip === color.id ? 'visible' : ''}`}>
                    <p className="tooltip-label">{color.label}</p>
                    <p className="tooltip-count">{color.count} products</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="filter-empty">No colors available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorFilter
