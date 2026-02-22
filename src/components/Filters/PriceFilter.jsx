/**
 * PriceFilter Component
 * Filter products by price range
 */

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import './PriceFilter.css'

function PriceFilter({
  priceRange = { min: 0, max: 1000 },
  activeFilters = [],
  onFilterChange,
  isExpanded = false,
}) {
  const [expanded, setExpanded] = useState(isExpanded)
  const [minPrice, setMinPrice] = useState(activeFilters[0]?.[0] || priceRange.min)
  const [maxPrice, setMaxPrice] = useState(activeFilters[0]?.[1] || priceRange.max)

  useEffect(() => {
    if (activeFilters.length === 0) {
      setMinPrice(priceRange.min)
      setMaxPrice(priceRange.max)
    }
  }, [priceRange])

  const handleApply = () => {
    onFilterChange('price', [minPrice, maxPrice])
  }

  const handleReset = () => {
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    onFilterChange('price', null)
  }

  return (
    <div className="filter-section price-filter">
      <div className="filter-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="filter-title">
          Price Range
          {activeFilters.length > 0 && <span className="filter-badge">Set</span>}
        </h3>
        <ChevronDown size={20} className={`filter-icon ${expanded ? 'expanded' : ''}`} />
      </div>

      {expanded && (
        <div className="filter-content">
          <div className="price-inputs">
            <div className="price-input-group">
              <label>Min</label>
              <div className="price-input-wrapper">
                <span className="currency">$</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                  min={priceRange.min}
                  max={maxPrice}
                  className="price-input"
                />
              </div>
            </div>

            <div className="price-separator">−</div>

            <div className="price-input-group">
              <label>Max</label>
              <div className="price-input-wrapper">
                <span className="currency">$</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.min(priceRange.max, Number(e.target.value)))}
                  min={minPrice}
                  max={priceRange.max}
                  className="price-input"
                />
              </div>
            </div>
          </div>

          <div className="price-range-slider">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={minPrice}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), maxPrice)
                setMinPrice(val)
              }}
              className="price-slider price-slider-min"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), minPrice)
                setMaxPrice(val)
              }}
              className="price-slider price-slider-max"
            />
          </div>

          <div className="price-actions">
            <button className="price-button price-button-apply" onClick={handleApply}>
              Apply
            </button>
            {activeFilters.length > 0 && (
              <button className="price-button price-button-reset" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceFilter
