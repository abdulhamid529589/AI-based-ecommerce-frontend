/**
 * FilterPanel Component
 * Main filter coordinator component - combines all filter types
 */

import React, { useState, useEffect } from 'react'
import { X, RotateCcw } from 'lucide-react'
import BrandFilter from './BrandFilter'
import MaterialFilter from './MaterialFilter'
import SizeFilter from './SizeFilter'
import ColorFilter from './ColorFilter'
import PriceFilter from './PriceFilter'
import { filterService } from '../../services/filterService'
import './FilterPanel.css'

function FilterPanel({
  products = [],
  onFiltersChange,
  onResultsChange,
  initialFilters = null,
  maxHeight = 'auto',
}) {
  const [activeFilters, setActiveFilters] = useState(
    initialFilters || filterService.clearAllFilters(),
  )
  const [availableFilters, setAvailableFilters] = useState({})
  const [showPresets, setShowPresets] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [presets, setPresets] = useState({})
  const [history, setHistory] = useState([])
  const [filterStats, setFilterStats] = useState({})

  // Update available filters and stats
  useEffect(() => {
    const available = filterService.getAvailableFilters(products, activeFilters)
    setAvailableFilters(available)

    const stats = filterService.getFilterStats(products, activeFilters)
    setFilterStats(stats)

    // Add to history
    filterService.addToFilterHistory(activeFilters, stats.filteredProducts)

    // Notify parent component
    if (onFiltersChange) {
      onFiltersChange(activeFilters)
    }

    if (onResultsChange) {
      onResultsChange(stats.filteredProducts)
    }
  }, [activeFilters, products])

  // Load presets on mount
  useEffect(() => {
    const allPresets = filterService.getAllPresets()
    setPresets(allPresets)

    const filterHistory = filterService.getFilterHistory()
    setHistory(filterHistory)
  }, [])

  const handleFilterChange = (filterType, value) => {
    const updated = filterService.toggleFilter(activeFilters, filterType, value)
    setActiveFilters(updated)
  }

  const handleClearAll = () => {
    setActiveFilters(filterService.clearAllFilters())
  }

  const handleClearType = (filterType) => {
    setActiveFilters(filterService.clearFilterType(activeFilters, filterType))
  }

  const handleSavePreset = () => {
    const presetName = prompt('Enter preset name:')
    if (presetName) {
      filterService.savePreset(presetName, activeFilters)
      const updated = filterService.getAllPresets()
      setPresets(updated)
    }
  }

  const handleLoadPreset = (presetName) => {
    const filters = filterService.loadPreset(presetName)
    if (filters) {
      setActiveFilters(filters)
      setShowPresets(false)
    }
  }

  const handleDeletePreset = (presetName) => {
    if (window.confirm(`Delete preset "${presetName}"?`)) {
      filterService.deletePreset(presetName)
      const updated = filterService.getAllPresets()
      setPresets(updated)
    }
  }

  const handleLoadHistory = (historyItem) => {
    setActiveFilters(historyItem.filters)
    setShowHistory(false)
  }

  const activeFilterCount = filterService.getActiveFilterCount(activeFilters)
  const filterSummary = filterService.getFilterSummary(activeFilters)

  return (
    <div className="filter-panel" style={{ maxHeight }}>
      <div className="filter-panel-header">
        <h2 className="filter-panel-title">
          Filters
          {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
        </h2>

        <div className="filter-panel-actions">
          {activeFilterCount > 0 && (
            <button
              className="filter-action-btn clear-btn"
              onClick={handleClearAll}
              title="Clear all filters"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {filterSummary && (
        <div className="filter-summary">
          <p className="summary-text">{filterSummary}</p>
        </div>
      )}

      <div className="filter-panel-content">
        {/* Price Filter */}
        {availableFilters.priceRange && (
          <PriceFilter
            priceRange={availableFilters.priceRange}
            activeFilters={activeFilters.price || []}
            onFilterChange={handleFilterChange}
            isExpanded={true}
          />
        )}

        {/* Brand Filter */}
        {availableFilters.brands && availableFilters.brands.length > 0 && (
          <BrandFilter
            brands={availableFilters.brands}
            activeFilters={activeFilters.brand || []}
            onFilterChange={handleFilterChange}
            isExpanded={activeFilterCount === 0}
          />
        )}

        {/* Material Filter */}
        {availableFilters.materials && availableFilters.materials.length > 0 && (
          <MaterialFilter
            materials={availableFilters.materials}
            activeFilters={activeFilters.material || []}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Size Filter */}
        {availableFilters.sizes && availableFilters.sizes.length > 0 && (
          <SizeFilter
            sizes={availableFilters.sizes}
            activeFilters={activeFilters.size || []}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Color Filter */}
        {availableFilters.colors && availableFilters.colors.length > 0 && (
          <ColorFilter
            colors={availableFilters.colors}
            activeFilters={activeFilters.color || []}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* Filter Results */}
      <div className="filter-panel-footer">
        <div className="filter-results-info">
          <p className="results-text">
            {filterStats.filteredProducts} of {filterStats.totalProducts} products
          </p>
          {filterStats.reductionPercent > 0 && (
            <p className="reduction-text">{filterStats.reductionPercent}% filtered</p>
          )}
        </div>
      </div>

      {/* Presets & History */}
      <div className="filter-panel-advanced">
        <button className="advanced-btn presets-btn" onClick={() => setShowPresets(!showPresets)}>
          📌 Saved Presets ({Object.keys(presets).length})
        </button>

        {showPresets && (
          <div className="presets-dropdown">
            {Object.keys(presets).length > 0 ? (
              <>
                {Object.keys(presets).map((presetName) => (
                  <div key={presetName} className="preset-item">
                    <button
                      className="preset-load-btn"
                      onClick={() => handleLoadPreset(presetName)}
                    >
                      {presetName}
                    </button>
                    <button
                      className="preset-delete-btn"
                      onClick={() => handleDeletePreset(presetName)}
                      title="Delete preset"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="preset-divider"></div>
              </>
            ) : (
              <p className="presets-empty">No presets saved</p>
            )}

            {activeFilterCount > 0 && (
              <button className="preset-save-btn" onClick={handleSavePreset}>
                💾 Save Current Filters
              </button>
            )}
          </div>
        )}

        <button className="advanced-btn history-btn" onClick={() => setShowHistory(!showHistory)}>
          🕐 Recent Searches ({history.length})
        </button>

        {showHistory && (
          <div className="history-dropdown">
            {history.length > 0 ? (
              history.map((item, idx) => (
                <button
                  key={idx}
                  className="history-item"
                  onClick={() => handleLoadHistory(item)}
                  title={`${item.resultsCount} results`}
                >
                  <span className="history-summary">{item.summary || 'All Products'}</span>
                  <span className="history-count">({item.resultsCount})</span>
                </button>
              ))
            ) : (
              <p className="history-empty">No search history</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterPanel
