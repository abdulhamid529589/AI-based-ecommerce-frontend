/**
 * MaterialFilter Component
 * Filter products by material/composition
 */

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './MaterialFilter.css'

function MaterialFilter({
  materials = [],
  activeFilters = [],
  onFilterChange,
  isExpanded = false,
}) {
  const [expanded, setExpanded] = useState(isExpanded)

  const handleToggle = (materialId) => {
    onFilterChange('material', materialId)
  }

  // Group by disabled (count = 0) for better UX
  const availableMaterials = materials.filter((m) => m.count > 0)
  const unavailableMaterials = materials.filter((m) => m.count === 0)

  return (
    <div className="filter-section material-filter">
      <div className="filter-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="filter-title">
          Material
          {activeFilters.length > 0 && <span className="filter-badge">{activeFilters.length}</span>}
        </h3>
        <ChevronDown size={20} className={`filter-icon ${expanded ? 'expanded' : ''}`} />
      </div>

      {expanded && (
        <div className="filter-content">
          <div className="filter-options">
            {availableMaterials.length > 0 ? (
              <>
                {availableMaterials.map((material) => (
                  <label key={material.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(material.id)}
                      onChange={() => handleToggle(material.id)}
                      className="filter-checkbox"
                    />
                    <span className="filter-label">{material.label}</span>
                    {material.count > 0 && <span className="filter-count">({material.count})</span>}
                  </label>
                ))}

                {unavailableMaterials.length > 0 && (
                  <>
                    <div className="filter-divider"></div>
                    {unavailableMaterials.map((material) => (
                      <label key={material.id} className="filter-option filter-option--disabled">
                        <input type="checkbox" disabled className="filter-checkbox" />
                        <span className="filter-label">{material.label}</span>
                        <span className="filter-count">(0)</span>
                      </label>
                    ))}
                  </>
                )}
              </>
            ) : (
              <p className="filter-empty">No materials available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialFilter
