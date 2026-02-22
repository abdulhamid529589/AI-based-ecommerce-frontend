import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Loader } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'

const ProductRecommendations = ({
  type = 'recently-viewed', // recently-viewed, frequently-bought, related, upsell
  productId = null,
  title = 'Recommended For You',
  limit = 6,
}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist?.items || [])

  useEffect(() => {
    fetchRecommendations()
  }, [type, productId])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      let endpoint = '/product/recommendations'
      let params = { type, limit }

      if (productId) {
        params.productId = productId
      }

      const response = await axiosInstance.get(endpoint, { params })

      if (response.data.success) {
        setProducts(response.data.products || [])
      }
    } catch (error) {
      console.error('Recommendations fetch error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    const productImage = product.images?.[0]?.url || product.image
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: productImage,
        quantity: 1,
      }),
    )
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation()
    const productImage = product.images?.[0]?.url || product.image
    if (wishlist.some((item) => item.id === product._id)) {
      dispatch(removeFromWishlist(product._id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(
        addToWishlist({
          id: product._id,
          name: product.name,
          price: product.salePrice || product.price,
          image: productImage,
        }),
      )
      toast.success('Added to wishlist!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.slice(0, limit).map((product) => {
          const isInWishlist = wishlist.some((item) => item.id === product._id)
          const discount = product.discount || 0
          const salePrice = product.salePrice || product.price
          const discountPercent = product.price
            ? Math.round(((product.price - salePrice) / product.price) * 100)
            : 0

          return (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    -{discountPercent}%
                  </div>
                )}

                {/* Stock Status */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleWishlistToggle(e, product)}
                  className="absolute top-2 left-2 bg-card rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist
                        ? 'fill-red-600 text-red-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                {/* Category */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">
                  {product.category?.name || 'Category'}
                </p>

                {/* Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {product.rating?.toFixed(1) || 'N/A'} ({product.reviews || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900 dark:text-white">
                    ৳{salePrice?.toFixed(2)}
                  </span>
                  {product.price !== salePrice && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ৳{product.price?.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock <= 0}
                  className={`w-full py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                    product.stock > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductRecommendations
