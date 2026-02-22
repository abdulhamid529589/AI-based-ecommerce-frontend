import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  Search,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  Loader,
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Crown,
} from 'lucide-react'
import { fetchAllProducts } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { toast } from 'react-toastify'
import { getImageSrc, handleImageError } from '../utils/placeholderImage'
import '../styles/products-amazon-style.css'

const ProductsAmazonStyle = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // State
  const [viewMode, setViewMode] = useState('grid')
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: false,
    rating: false,
    shipping: false,
  })
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 100000],
    rating: 0,
    prime: false,
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [page, setPage] = useState(1)
  const itemsPerPage = 24

  // Redux
  const products = useSelector((state) => state.product.products, shallowEqual)
  const loading = useSelector((state) => state.product.loading)
  const wishlistItems = useSelector((state) => state.wishlist.items, shallowEqual)

  // Fetch products
  useEffect(() => {
    dispatch(fetchAllProducts({ page, limit: itemsPerPage }))
  }, [dispatch, page])

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const price = parseFloat(p.price || 0)
      const rating = parseFloat(p.rating || 0)

      if (filters.category !== 'all' && p.category !== filters.category) return false
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      if (filters.rating > 0 && rating < filters.rating) return false
      if (filters.prime && !p.isPrime) return false

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price || 0) - parseFloat(b.price || 0)
        case 'price-high':
          return parseFloat(b.price || 0) - parseFloat(a.price || 0)
        case 'rating':
          return parseFloat(b.rating || 0) - parseFloat(a.rating || 0)
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })

  // Get unique categories
  const categories = ['all', ...new Set(products.map((p) => p.category))].filter(Boolean)

  // Wishlist check
  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId)

  // Handlers
  const handleAddToCart = (product) => {
    const productImage = product.images?.[0]?.url || product.image
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage,
        quantity: 1,
      }),
    )
    toast.success('Added to cart!')
  }

  const handleWishlist = (product) => {
    const productImage = product.images?.[0]?.url || product.image
    if (isInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id))
      toast.info('Removed from wishlist')
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImage,
        }),
      )
      toast.success('Added to wishlist!')
    }
  }

  const handleBuyNow = (product) => {
    const productImage = product.images?.[0]?.url || product.image
    // Add to cart first
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage,
        quantity: 1,
      }),
    )
    toast.success('Added to cart! Proceeding to checkout...')
    // Navigate to checkout after a short delay
    setTimeout(() => {
      navigate('/checkout')
    }, 500)
  }

  const toggleFilter = (filter) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter],
    })
  }

  return (
    <div className="products-amazon-style bg-white dark:bg-gray-900 min-h-screen pt-24 pb-20">
      {/* Top Bar */}
      <div className="sticky top-20 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProducts.length} results
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="sticky top-40 space-y-6">
              {/* Category Filter */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleFilter('category')}
                  className="w-full px-4 py-3 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Category
                  {expandedFilters.category ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.category && (
                  <div className="border-t border-gray-300 dark:border-gray-600 p-4 space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleFilter('price')}
                  className="w-full px-4 py-3 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Price
                  {expandedFilters.price ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.price && (
                  <div className="border-t border-gray-300 dark:border-gray-600 p-4 space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ৳{filters.priceRange[0]} - ৳{filters.priceRange[1]}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleFilter('rating')}
                  className="w-full px-4 py-3 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Rating
                  {expandedFilters.rating ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.rating && (
                  <div className="border-t border-gray-300 dark:border-gray-600 p-4 space-y-2">
                    {[0, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating}
                          onChange={(e) =>
                            setFilters({ ...filters, rating: parseInt(e.target.value) })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Prime Filter */}
              <label className="flex items-center gap-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.prime}
                  onChange={(e) => setFilters({ ...filters, prime: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-gray-900 dark:text-white">Prime Only</span>
              </label>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="md:col-span-4">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`product-card-amazon ${
                        viewMode === 'list' ? 'flex gap-4' : ''
                      } bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow p-4 cursor-pointer`}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {/* Image */}
                      <div
                        className={`relative ${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'w-full h-40'} bg-gray-100 dark:bg-gray-700 rounded overflow-hidden`}
                      >
                        <img
                          src={getImageSrc(product.images?.[0]?.url || product.image, 'Product')}
                          alt={product.name}
                          onError={(e) => handleImageError(e, 'No Image')}
                          className="w-full h-full object-cover"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                            -{product.discount}%
                          </div>
                        )}
                        {product.isPrime && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Prime
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div
                        className={`flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}
                      >
                        {/* Name */}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ({product.reviews || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ৳{parseFloat(product.price || 0).toFixed(0)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ৳{product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Delivery */}
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          FREE Delivery
                        </p>

                        {/* Stock */}
                        <p
                          className={`text-xs mt-2 ${
                            product.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.stock > 0 ? `In stock (${product.stock} left)` : 'Out of stock'}
                        </p>

                        {/* Actions */}
                        <div className={`flex gap-2 mt-4 flex-wrap`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            disabled={product.stock <= 0}
                            className="flex-1 min-w-[100px] bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 rounded font-semibold text-sm flex items-center justify-center gap-1 transition"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBuyNow(product)
                            }}
                            disabled={product.stock <= 0}
                            className="flex-1 min-w-[100px] bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-gray-900 py-2 rounded font-semibold text-sm flex items-center justify-center gap-1 transition"
                          >
                            <Zap className="w-4 h-4" />
                            Buy Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleWishlist(product)
                            }}
                            className={`px-3 py-2 rounded border transition ${
                              isInWishlist(product.id)
                                ? 'bg-red-50 border-red-300 text-red-600'
                                : 'border-gray-300 text-gray-600 hover:border-red-300'
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded ${
                        page === p
                          ? 'bg-orange-500 text-white'
                          : 'border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96">
                <Search className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsAmazonStyle
