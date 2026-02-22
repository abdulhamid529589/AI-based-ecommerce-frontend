/**
 * Filter Service - Advanced Product Filtering Logic
 * Handles filtering, combinations, presets, and history
 */

export const filterService = {
  // Filter types
  FILTER_TYPES: {
    BRAND: 'brand',
    MATERIAL: 'material',
    SIZE: 'size',
    COLOR: 'color',
    PRICE: 'price',
    RATING: 'rating',
  },

  // Common filter options
  COMMON_MATERIALS: [
    { id: 'cotton', label: 'Cotton', count: 0 },
    { id: 'polyester', label: 'Polyester', count: 0 },
    { id: 'silk', label: 'Silk', count: 0 },
    { id: 'wool', label: 'Wool', count: 0 },
    { id: 'linen', label: 'Linen', count: 0 },
    { id: 'rayon', label: 'Rayon', count: 0 },
    { id: 'blend', label: 'Blend', count: 0 },
  ],

  COMMON_SIZES: [
    { id: 'xs', label: 'XS', count: 0 },
    { id: 's', label: 'S', count: 0 },
    { id: 'm', label: 'M', count: 0 },
    { id: 'l', label: 'L', count: 0 },
    { id: 'xl', label: 'XL', count: 0 },
    { id: 'xxl', label: 'XXL', count: 0 },
    { id: 'single', label: 'Single', count: 0 },
    { id: 'double', label: 'Double', count: 0 },
    { id: 'queen', label: 'Queen', count: 0 },
    { id: 'king', label: 'King', count: 0 },
  ],

  COMMON_COLORS: [
    { id: 'black', label: 'Black', hex: '#000000', count: 0 },
    { id: 'white', label: 'White', hex: '#FFFFFF', count: 0 },
    { id: 'red', label: 'Red', hex: '#EF4444', count: 0 },
    { id: 'blue', label: 'Blue', hex: '#3B82F6', count: 0 },
    { id: 'green', label: 'Green', hex: '#22C55E', count: 0 },
    { id: 'yellow', label: 'Yellow', hex: '#FBBF24', count: 0 },
    { id: 'pink', label: 'Pink', hex: '#EC4899', count: 0 },
    { id: 'purple', label: 'Purple', hex: '#A855F7', count: 0 },
    { id: 'brown', label: 'Brown', hex: '#92400E', count: 0 },
    { id: 'gray', label: 'Gray', hex: '#6B7280', count: 0 },
    { id: 'navy', label: 'Navy', hex: '#001F3F', count: 0 },
    { id: 'beige', label: 'Beige', hex: '#F5E6D3', count: 0 },
  ],

  // Filter products by active filters
  filterProducts: (products, activeFilters) => {
    return products.filter((product) => {
      // Check each filter type
      for (const [filterType, filterValues] of Object.entries(activeFilters)) {
        if (filterValues.length === 0) continue

        switch (filterType) {
          case 'brand':
            if (!filterValues.includes(product.brand)) return false
            break
          case 'material':
            if (!product.materials?.some((m) => filterValues.includes(m))) return false
            break
          case 'size':
            if (!product.sizes?.some((s) => filterValues.includes(s))) return false
            break
          case 'color':
            if (!product.colors?.some((c) => filterValues.includes(c))) return false
            break
          case 'price':
            const [minPrice, maxPrice] = filterValues[0]
            if (product.price < minPrice || product.price > maxPrice) return false
            break
          case 'rating':
            if ((product.rating || 0) < filterValues[0]) return false
            break
          default:
            break
        }
      }
      return true
    })
  },

  // Get available options for each filter (with counts)
  getAvailableFilters: (products, currentFilters) => {
    const filtered = filterService.filterProducts(products, currentFilters)

    const filters = {
      brands: [],
      materials: [],
      sizes: [],
      colors: [],
      priceRange: { min: 0, max: 0 },
      ratings: [],
    }

    // Extract unique brands
    const brandsMap = {}
    filtered.forEach((p) => {
      if (p.brand) {
        brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1
      }
    })
    filters.brands = Object.entries(brandsMap).map(([brand, count]) => ({
      id: brand,
      label: brand,
      count,
    }))

    // Extract unique materials
    const materialsMap = {}
    filtered.forEach((p) => {
      p.materials?.forEach((m) => {
        materialsMap[m] = (materialsMap[m] || 0) + 1
      })
    })
    filters.materials = filterService.COMMON_MATERIALS.map((m) => ({
      ...m,
      count: materialsMap[m.id] || 0,
    }))

    // Extract unique sizes
    const sizesMap = {}
    filtered.forEach((p) => {
      p.sizes?.forEach((s) => {
        sizesMap[s] = (sizesMap[s] || 0) + 1
      })
    })
    filters.sizes = filterService.COMMON_SIZES.map((s) => ({
      ...s,
      count: sizesMap[s.id] || 0,
    }))

    // Extract unique colors
    const colorsMap = {}
    filtered.forEach((p) => {
      p.colors?.forEach((c) => {
        colorsMap[c] = (colorsMap[c] || 0) + 1
      })
    })
    filters.colors = filterService.COMMON_COLORS.map((c) => ({
      ...c,
      count: colorsMap[c.id] || 0,
    }))

    // Get price range
    if (filtered.length > 0) {
      filters.priceRange.min = Math.min(...filtered.map((p) => p.price))
      filters.priceRange.max = Math.max(...filtered.map((p) => p.price))
    }

    // Get ratings
    filters.ratings = [1, 2, 3, 4, 5].map((rating) => ({
      id: rating,
      label: `${rating}+ Stars`,
      count: filtered.filter((p) => (p.rating || 0) >= rating).length,
    }))

    return filters
  },

  // Toggle filter value
  toggleFilter: (activeFilters, filterType, value) => {
    const current = activeFilters[filterType] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    return {
      ...activeFilters,
      [filterType]: updated,
    }
  },

  // Clear all filters
  clearAllFilters: () => ({
    brand: [],
    material: [],
    size: [],
    color: [],
    price: [],
    rating: [],
  }),

  // Clear single filter type
  clearFilterType: (activeFilters, filterType) => ({
    ...activeFilters,
    [filterType]: [],
  }),

  // Get active filter count
  getActiveFilterCount: (activeFilters) => {
    return Object.values(activeFilters).reduce(
      (sum, values) => sum + (Array.isArray(values) ? values.length : 0),
      0,
    )
  },

  // Get filter summary string
  getFilterSummary: (activeFilters) => {
    const parts = []

    if (activeFilters.brand?.length > 0) {
      parts.push(`Brands: ${activeFilters.brand.join(', ')}`)
    }
    if (activeFilters.material?.length > 0) {
      parts.push(`Material: ${activeFilters.material.join(', ')}`)
    }
    if (activeFilters.size?.length > 0) {
      parts.push(`Size: ${activeFilters.size.join(', ')}`)
    }
    if (activeFilters.color?.length > 0) {
      parts.push(`Color: ${activeFilters.color.join(', ')}`)
    }
    if (activeFilters.price?.length > 0) {
      const [min, max] = activeFilters.price[0]
      parts.push(`Price: $${min}-$${max}`)
    }
    if (activeFilters.rating?.length > 0) {
      parts.push(`Rating: ${activeFilters.rating[0]}+ Stars`)
    }

    return parts.join(' | ')
  },

  // Save preset to localStorage
  savePreset: (presetName, filters) => {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}')
    presets[presetName] = {
      filters,
      createdAt: new Date().toISOString(),
      name: presetName,
    }
    localStorage.setItem('filterPresets', JSON.stringify(presets))
    return presets
  },

  // Load preset from localStorage
  loadPreset: (presetName) => {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}')
    return presets[presetName]?.filters || null
  },

  // Get all presets
  getAllPresets: () => {
    return JSON.parse(localStorage.getItem('filterPresets') || '{}')
  },

  // Delete preset
  deletePreset: (presetName) => {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}')
    delete presets[presetName]
    localStorage.setItem('filterPresets', JSON.stringify(presets))
    return presets
  },

  // Get filter history (last 5)
  getFilterHistory: () => {
    return JSON.parse(localStorage.getItem('filterHistory') || '[]').slice(0, 5)
  },

  // Add to filter history
  addToFilterHistory: (filters, resultsCount) => {
    const history = JSON.parse(localStorage.getItem('filterHistory') || '[]')
    history.unshift({
      filters,
      resultsCount,
      timestamp: new Date().toISOString(),
      summary: filterService.getFilterSummary(filters),
    })
    localStorage.setItem('filterHistory', JSON.stringify(history.slice(0, 10)))
  },

  // Clear filter history
  clearFilterHistory: () => {
    localStorage.removeItem('filterHistory')
  },

  // Combine multiple filter types (AND logic)
  combineFilters: (filterGroups) => {
    return Object.assign({}, filterService.clearAllFilters(), ...filterGroups)
  },

  // Get filter stats
  getFilterStats: (products, activeFilters) => {
    const filtered = filterService.filterProducts(products, activeFilters)
    return {
      totalProducts: products.length,
      filteredProducts: filtered.length,
      activeFilterCount: filterService.getActiveFilterCount(activeFilters),
      reductionPercent: Math.round(((products.length - filtered.length) / products.length) * 100),
    }
  },

  // Export filters as URL query string
  exportFiltersAsURL: (activeFilters) => {
    const params = new URLSearchParams()
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        params.append(key, JSON.stringify(values))
      }
    })
    return params.toString()
  },

  // Import filters from URL query string
  importFiltersFromURL: (queryString) => {
    const params = new URLSearchParams(queryString)
    const filters = filterService.clearAllFilters()

    params.forEach((value, key) => {
      try {
        filters[key] = JSON.parse(value)
      } catch (e) {
        console.error('Failed to parse filter:', key, value)
      }
    })

    return filters
  },
}

export default filterService
