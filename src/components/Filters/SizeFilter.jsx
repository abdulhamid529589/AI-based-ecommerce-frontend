/**
 * SizeFilter Component
 * Filter products by size/dimensions
 */

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './SizeFilter.css'

function SizeFilter({ sizes = [], activeFilters = [], onFilterChange, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded)

  const handleToggle = (sizeId) => {
    onFilterChange('size', sizeId)
  }

  // Group sizes by category
  const clothingSizes = sizes.filter((s) => ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.id))
  const beddingSizes = sizes.filter((s) => ['single', 'double', 'queen', 'king'].includes(s.id))

  const availableClothing = clothingSizes.filter((s) => s.count > 0)
  const availableBedding = beddingSizes.filter((s) => s.count > 0)

  return (
    <div className="filter-section size-filter">
      <div className="filter-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="filter-title">
          Size
          {activeFilters.length > 0 && <span className="filter-badge">{activeFilters.length}</span>}
        </h3>
        <ChevronDown size={20} className={`filter-icon ${expanded ? 'expanded' : ''}`} />
      </div>

      {expanded && (
        <div className="filter-content">
          <div className="filter-options">
            {availableClothing.length > 0 && (
              <>
                <div className="size-category">
                  <p className="size-category-label">Clothing</p>
                  <div className="size-grid">
                    {availableClothing.map((size) => (
                      <label key={size.id} className="size-button">
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(size.id)}
                          onChange={() => handleToggle(size.id)}
                          className="filter-checkbox"
                          style={{ display: 'none' }}
                        />
                        <span
                          className={`size-label ${activeFilters.includes(size.id) ? 'selected' : ''}`}
                        >
                          {size.label}
                        </span>
                        {size.count > 0 && <span className="size-count">{size.count}</span>}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {availableBedding.length > 0 && (
              <>
                {availableClothing.length > 0 && <div className="filter-divider"></div>}
                <div className="size-category">
                  <p className="size-category-label">Bedding</p>
                  <div className="size-grid">
                    {availableBedding.map((size) => (
                      <label key={size.id} className="size-button">
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(size.id)}
                          onChange={() => handleToggle(size.id)}
                          className="filter-checkbox"
                          style={{ display: 'none' }}
                        />
                        <span
                          className={`size-label ${activeFilters.includes(size.id) ? 'selected' : ''}`}
                        >
                          {size.label}
                        </span>
                        {size.count > 0 && <span className="size-count">{size.count}</span>}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {availableClothing.length === 0 && availableBedding.length === 0 && (
              <p className="filter-empty">No sizes available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeFilter
