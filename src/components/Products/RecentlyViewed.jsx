import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useSelector, shallowEqual } from 'react-redux'
import ProductCard from './ProductCard'

const RecentlyViewed = () => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([])
  const products = useSelector((state) => state.product.products, shallowEqual)

  // Load recently viewed from localStorage and match with full product data
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed')
    if (stored && products.length > 0) {
      const ids = JSON.parse(stored)
      // Map stored IDs to full product data
      const fullProducts = ids
        .map((id) => products.find((p) => p._id === id || p.id === id))
        .filter((p) => p && p.price) // Filter out undefined or incomplete products
        .slice(0, 6) // Show only first 6
      setRecentlyViewedProducts(fullProducts)
    }
  }, [products])

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed')
    setRecentlyViewedProducts([])
  }

  if (recentlyViewedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Recently Viewed
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Products you've looked at recently
            </p>
          </div>
          <button
            onClick={clearHistory}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition"
            title="Clear viewing history"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {recentlyViewedProducts.map((product) => (
            <div key={product._id || product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewed
