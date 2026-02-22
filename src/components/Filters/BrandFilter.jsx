/**
 * BrandFilter Component
 * Filter products by brand/manufacturer
 */

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './BrandFilter.css'

function BrandFilter({ brands = [], activeFilters = [], onFilterChange, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBrands = brands.filter((brand) =>
    brand.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggle = (brandId) => {
    onFilterChange('brand', brandId)
  }

  return (
    <div className="filter-section brand-filter">
      <div className="filter-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="filter-title">
          Brand
          {activeFilters.length > 0 && <span className="filter-badge">{activeFilters.length}</span>}
        </h3>
        <ChevronDown size={20} className={`filter-icon ${expanded ? 'expanded' : ''}`} />
      </div>

      {expanded && (
        <div className="filter-content">
          {brands.length > 8 && (
            <input
              type="text"
              placeholder="Search brands..."
              className="filter-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          <div className="filter-options">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <label key={brand.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(brand.id)}
                    onChange={() => handleToggle(brand.id)}
                    className="filter-checkbox"
                  />
                  <span className="filter-label">{brand.label}</span>
                  {brand.count > 0 && <span className="filter-count">({brand.count})</span>}
                </label>
              ))
            ) : (
              <p className="filter-empty">No brands found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandFilter
