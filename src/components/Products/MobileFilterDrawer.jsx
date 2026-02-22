import React from 'react'
import { X, Filter } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  onApplyFilters,
}) => {
  const { categories: settingsCategories } = useSettings()

  // Normalize categories to handle both array and object subcategories format
  const normalizeCategory = (category) => {
    if (!category) return null

    let subcats = category.subcategories || {}
    // If subcategories is an array, convert to object format
    if (Array.isArray(subcats)) {
      subcats = {
        Subcategories: subcats,
      }
    }

    return {
      ...category,
      subcategories: subcats,
    }
  }

  // Use settings categories or empty array as fallback
  const categories = (settingsCategories || []).map(normalizeCategory).filter(Boolean)

  const currentCategoryData = categories.find(
    (cat) =>
      cat.name
        .toLowerCase()
        .replace(/\s+&\s+/g, '-')
        .replace(/\s+/g, '-') === selectedCategory,
  )

  const getSubcategoryOptions = () => {
    if (!currentCategoryData || !currentCategoryData.subcategories) return []
    return Object.entries(currentCategoryData.subcategories).flatMap(([section, items]) =>
      items.map((item) => ({
        ...item,
        section,
      })),
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`} onClick={onClose} />

      {/* Drawer Content */}
      <div
        className={`mobile-drawer-content ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mobile-filter-drawer-header">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h3 className="text-lg font-bold">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="mobile-filter-drawer">
          {/* Category Filter */}
          <div className="filter-section-mobile">
            <h3>Category</h3>
            <div className="space-y-2">
              {[{ id: 'all', name: 'All Categories' }, ...categories].map((cat) => (
                <div key={cat.id || 'all'} className="filter-option-mobile">
                  <input
                    type="radio"
                    id={`cat-${cat.id || 'all'}`}
                    name="category"
                    value={cat.id || 'all'}
                    checked={selectedCategory === (cat.id || 'all')}
                    onChange={() => onCategoryChange(cat.id || 'all')}
                  />
                  <label htmlFor={`cat-${cat.id || 'all'}`}>{cat.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategory Filter */}
          {selectedCategory !== 'all' && (
            <div className="filter-section-mobile">
              <h3>Subcategory</h3>
              <div className="space-y-2">
                <div className="filter-option-mobile">
                  <input
                    type="radio"
                    id="subcat-all"
                    name="subcategory"
                    value="all"
                    checked={selectedSubcategory === 'all'}
                    onChange={() => onSubcategoryChange('all')}
                  />
                  <label htmlFor="subcat-all">All</label>
                </div>
                {getSubcategoryOptions().map((subcat, index) => (
                  <div key={index} className="filter-option-mobile">
                    <input
                      type="radio"
                      id={`subcat-${index}`}
                      name="subcategory"
                      value={subcat.name}
                      checked={selectedSubcategory === subcat.name}
                      onChange={() => onSubcategoryChange(subcat.name)}
                    />
                    <label htmlFor={`subcat-${index}`}>{subcat.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="filter-section-mobile">
            <h3>Price Range</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="flex flex-col">
                  <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Min</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sort Option */}
          <div className="filter-section-mobile">
            <h3>Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="relevant">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mobile-filter-actions">
          <button
            className="btn-reset"
            onClick={() => {
              onCategoryChange('all')
              onSubcategoryChange('all')
              onPriceChange([0, 100000])
              onSortChange('relevant')
            }}
          >
            Reset
          </button>
          <button className="btn-apply" onClick={onApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

export default MobileFilterDrawer
