import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
  ArrowLeft,
  Zap,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  Clock,
  Check,
} from 'lucide-react'
import { getImageSrc, handleImageError } from '../utils/placeholderImage'
import { motion } from 'framer-motion'
import { fetchSingleProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { toast } from 'react-toastify'
import ReviewForm from '../components/Products/ReviewForm'
import ReviewsList from '../components/Products/ReviewsList'
import RelatedProducts from '../components/Products/RelatedProducts'
import '../styles/product-detail-amazon-style.css'

const ProductDetailAmazonStyle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // State
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [expandedSection, setExpandedSection] = useState('description')
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Redux
  const productDetails = useSelector((state) => state.product.productDetails)
  const productReviews = useSelector((state) => state.product.productReviews)
  const loading = useSelector((state) => state.product.loading)
  const wishlistItems = useSelector((state) => state.wishlist.items, shallowEqual)

  const isInWishlist = wishlistItems.some((item) => item.id === productDetails?.id)

  // Fetch product
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <p className="text-gray-600 mb-4">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-orange-500 text-white rounded font-semibold"
        >
          Back to Products
        </button>
      </div>
    )
  }

  const price = parseFloat(productDetails.price || 0)
  const originalPrice = parseFloat(productDetails.originalPrice || price)
  const discount =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const rating = parseFloat(productDetails.rating || productDetails.ratings || 0)
  const images = productDetails.images || []
  const mainImage = getImageSrc(images[selectedImage]?.url || productDetails.image, 'Product Image')

  // Calculate review count - reviews can be a number or array
  const reviewCount =
    typeof productDetails.reviews === 'number'
      ? productDetails.reviews
      : Array.isArray(productDetails.reviews)
        ? productDetails.reviews.length
        : 0

  // Handlers
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: mainImage,
        quantity: quantity,
      }),
    )
    toast.success(`${quantity} item(s) added to cart!`)
    setQuantity(1)
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productDetails.id))
      toast.info('Removed from wishlist')
    } else {
      dispatch(
        addToWishlist({
          id: productDetails.id,
          name: productDetails.name,
          price: price,
          image: mainImage,
        }),
      )
      toast.success('Added to wishlist!')
    }
  }

  const handleBuyNow = () => {
    // Add to cart first
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: mainImage,
        quantity: quantity,
      }),
    )
    toast.success(`${quantity} item(s) added to cart! Proceeding to checkout...`)
    // Navigate to checkout after a short delay
    setTimeout(() => {
      navigate('/checkout')
    }, 500)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productDetails.name,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="product-detail-amazon-style bg-white dark:bg-gray-900 min-h-screen pt-20 pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img
                src={mainImage}
                alt={productDetails.name}
                className="w-full h-96 object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded border-2 overflow-hidden ${
                      selectedImage === idx
                        ? 'border-orange-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`View ${idx + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Middle: Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {productDetails.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {rating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">৳{price.toFixed(0)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg line-through text-gray-500">
                      ৳{originalPrice.toFixed(0)}
                    </span>
                    <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock & Delivery */}
            <div className="space-y-3">
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {productDetails.stock > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-semibold">
                      In Stock ({productDetails.stock} available)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-6 space-y-4">
              {/* Price Display in Buy Box */}
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  ৳{price.toFixed(0)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inclusive of all taxes</p>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-semibold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(productDetails.stock, quantity + 1))}
                    disabled={quantity >= productDetails.stock}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={productDetails.stock <= 0}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={productDetails.stock <= 0}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-gray-900 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition border-2 ${
                  isInWishlist
                    ? 'bg-red-50 border-red-600 text-red-600'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Description & Details Section */}
        <div className="mt-12 border-t border-gray-300 dark:border-gray-600 pt-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* About this item */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About this item
                </h2>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {productDetails.description || 'No description available'}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {productDetails.features?.map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Technical Details
                </h3>
                <table className="w-full">
                  <tbody>
                    {productDetails.specifications?.map((spec, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-2 px-4 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 w-1/3">
                          {spec.name}
                        </td>
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Customer Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Customer Reviews
                </h2>

                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Rating Stats */}
                  <div className="text-center md:text-left">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {rating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                          {stars} ★
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${(stars / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                          {Math.round((stars / 5) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form & List */}
        <div className="mt-12 border-t border-gray-300 dark:border-gray-600 pt-8">
          <ReviewForm
            productId={id}
            onReviewAdded={() => {
              // Refresh reviews
              setRefreshTrigger(Date.now())
            }}
          />

          <ReviewsList
            productId={id}
            refreshTrigger={refreshTrigger}
            initialReviews={Array.isArray(productReviews) ? productReviews : []}
          />
        </div>

        {/* Related Products Section */}
        <RelatedProducts currentProductId={id} category={productDetails?.category} limit={6} />
      </div>
    </div>
  )
}

export default ProductDetailAmazonStyle
