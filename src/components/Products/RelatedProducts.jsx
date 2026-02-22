import { useSelector, shallowEqual } from 'react-redux'
import { Link } from 'react-router-dom'
import { Star, Loader, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import '../../styles/RelatedProducts.css'

const RelatedProducts = ({ currentProductId, category, limit = 6 }) => {
  const products = useSelector((state) => state.product.products, shallowEqual)
  const loading = useSelector((state) => state.product.loading)

  // Get related products (same category, exclude current product)
  const relatedProducts = products
    .filter(
      (product) =>
        product.category?.toLowerCase() === category?.toLowerCase() &&
        product._id !== currentProductId &&
        product.id !== currentProductId,
    )
    .sort((a, b) => {
      // Sort by rating first, then by creation date
      const ratingA = typeof a.ratings === 'string' ? parseFloat(a.ratings) : a.ratings || 0
      const ratingB = typeof b.ratings === 'string' ? parseFloat(b.ratings) : b.ratings || 0
      if (ratingB !== ratingA) return ratingB - ratingA
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    .slice(0, limit)

  if (loading) {
    return (
      <div className="related-products-section">
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="related-products-section"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="related-products-header"
      >
        <div className="header-content">
          <h2 className="header-title">Related Products</h2>
          <p className="header-subtitle">
            You might also like these products from the {category} category
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={`/products?category=${category?.toLowerCase().replace(/\s+/g, '-')}`}
            className="view-all-link"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Products Grid with Stagger Animation */}
      <motion.div
        className="related-products-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }}
      >
        {relatedProducts.map((product) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Browse More Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="browse-more-section"
      >
        <div className="browse-content">
          <h3>Looking for more products?</h3>
          <p>Explore our full collection of {category} products with various brands and prices.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to={`/products?category=${category?.toLowerCase().replace(/\s+/g, '-')}`}>
              Browse Full Category
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RelatedProducts
