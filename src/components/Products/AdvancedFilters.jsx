import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

const AdvancedFilters = ({ filters = {}, onFilterChange = null, categories = [], brands = [] }) => {
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    priceRange: true,
    rating: false,
    brand: false,
    availability: false,
    discount: false,
  })

  const [localFilters, setLocalFilters] = useState({
    category: filters.category || [],
    priceMin: filters.priceMin || 0,
    priceMax: filters.priceMax || 100000,
    rating: filters.rating || [],
    brand: filters.brand || [],
    inStock: filters.inStock !== undefined ? filters.inStock : true,
    minDiscount: filters.minDiscount || 0,
  })

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  const handleCategoryChange = (category) => {
    const updated = localFilters.category.includes(category)
      ? localFilters.category.filter((c) => c !== category)
      : [...localFilters.category, category]

    const newFilters = { ...localFilters, category: updated }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleBrandChange = (brand) => {
    const updated = localFilters.brand.includes(brand)
      ? localFilters.brand.filter((b) => b !== brand)
      : [...localFilters.brand, brand]

    const newFilters = { ...localFilters, brand: updated }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleRatingChange = (rating) => {
    const updated = localFilters.rating.includes(rating)
      ? localFilters.rating.filter((r) => r !== rating)
      : [...localFilters.rating, rating]

    const newFilters = { ...localFilters, rating: updated }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handlePriceChange = (type, value) => {
    const newFilters = { ...localFilters, [type]: parseInt(value) }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleDiscountChange = (value) => {
    const newFilters = { ...localFilters, minDiscount: parseInt(value) }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleAvailabilityChange = (checked) => {
    const newFilters = { ...localFilters, inStock: checked }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearAllFilters = () => {
    const cleared = {
      category: [],
      priceMin: 0,
      priceMax: 100000,
      rating: [],
      brand: [],
      inStock: true,
      minDiscount: 0,
    }
    setLocalFilters(cleared)
    onFilterChange?.(cleared)
  }

  const activeFilterCount =
    localFilters.category.length +
    localFilters.brand.length +
    localFilters.rating.length +
    (localFilters.minDiscount > 0 ? 1 : 0)

  return (
    <div className="bg-card rounded-lg p-4">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleFilter('category')}
          className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Category
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.category ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedFilters.category && (
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label key={category._id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.category.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">
                  ({category.count || 0})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleFilter('priceRange')}
          className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Price Range
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.priceRange ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedFilters.priceRange && (
          <div className="mt-3 space-y-4">
            {/* Min Price */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
                Min Price: ৳{localFilters.priceMin.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={localFilters.priceMin}
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
                Max Price: ৳{localFilters.priceMax.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={localFilters.priceMax}
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2 pt-2">
              {[
                { label: 'Under ৳5K', min: 0, max: 5000 },
                { label: '৳5K-৳10K', min: 5000, max: 10000 },
                { label: '৳10K+', min: 10000, max: 100000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceMin: preset.min,
                      priceMax: preset.max,
                    }))
                    onFilterChange?.({
                      ...localFilters,
                      priceMin: preset.min,
                      priceMax: preset.max,
                    })
                  }}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleFilter('rating')}
          className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Rating
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.rating ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedFilters.rating && (
          <div className="mt-3 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.rating.includes(star)}
                  onChange={() => handleRatingChange(star)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {'★'.repeat(star)}
                  {'☆'.repeat(5 - star)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">& Up</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <button
            onClick={() => toggleFilter('brand')}
            className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Brand
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedFilters.brand ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedFilters.brand && (
            <div className="mt-3 space-y-2">
              {brands.map((brand) => (
                <label key={brand._id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={localFilters.brand.includes(brand._id)}
                    onChange={() => handleBrandChange(brand._id)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {brand.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discount Filter */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleFilter('discount')}
          className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Discount
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.discount ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedFilters.discount && (
          <div className="mt-3 space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
              Min Discount: {localFilters.minDiscount}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={localFilters.minDiscount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex gap-2 pt-2">
              {[20, 30, 50].map((discount) => (
                <button
                  key={discount}
                  onClick={() => handleDiscountChange(discount)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                >
                  {discount}%+
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter('availability')}
          className="w-full flex items-center justify-between text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Availability
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.availability ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedFilters.availability && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.inStock}
                onChange={(e) => handleAvailabilityChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                In Stock Only
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancedFilters
