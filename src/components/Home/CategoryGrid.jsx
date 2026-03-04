import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, X, ChevronDown } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

const CategoryGrid = () => {
  const { categories } = useSettings()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedSubcategory, setExpandedSubcategory] = useState(null)

  const getCategoryUrl = (categoryName) => {
    return categoryName
      .toLowerCase()
      .replace(/\s+&\s+/g, '-')
      .replace(/\s+/g, '-')
  }

  // Handle both formats: object format and array format
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

  const selectedCategoryData = normalizeCategory(categories.find((c) => c.id === selectedCategory))

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-0">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
          Shop by Category
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
          Discover our wide range of products across different categories
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              // Check if category has subcategories
              if (category.subcategories && category.subcategories.length > 0) {
                // Show modal if it has subcategories
                setSelectedCategory(category.id)
              } else {
                // Navigate directly if no subcategories
                navigate(`/products?category=${getCategoryUrl(category.name)}`)
              }
            }}
            className="group glass-card p-4 sm:p-5 md:p-6 text-center hover:glow-on-hover animate-smooth cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-20 sm:h-24 md:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {category.name}
            </h3>
          </button>
        ))}
      </div>

      {/* Subcategories Modal */}
      {selectedCategoryData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="bg-background border border-primary/20 rounded-lg sm:rounded-xl max-w-4xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex-1 line-clamp-1">
                {selectedCategoryData.name}
              </h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Subcategories Sections */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {Object.entries(selectedCategoryData.subcategories).map(([section, items]) => (
                <div key={section} className="border border-primary/10 rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <button
                    onClick={() =>
                      setExpandedSubcategory(expandedSubcategory === section ? null : section)
                    }
                    className="w-full bg-primary/5 hover:bg-primary/10 px-4 py-3 flex items-center justify-between transition-colors"
                  >
                    <h4 className="font-semibold text-foreground text-left">{section}</h4>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedSubcategory === section ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Section Items */}
                  {expandedSubcategory === section && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                      {items.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/products?category=${getCategoryUrl(selectedCategoryData.name)}&subcategory=${getCategoryUrl(subcategory.name)}`}
                          onClick={() => setSelectedCategory(null)}
                          className="px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/20 text-foreground hover:text-primary transition-colors text-sm font-medium"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View All Link */}
            <Link
              to={`/products?category=${getCategoryUrl(selectedCategoryData.name)}`}
              onClick={() => setSelectedCategory(null)}
              className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center"
            >
              View All {selectedCategoryData.name}
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default CategoryGrid
