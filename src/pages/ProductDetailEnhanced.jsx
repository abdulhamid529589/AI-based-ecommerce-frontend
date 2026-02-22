import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  Check,
  AlertCircle,
  TrendingUp,
  Eye,
  MapPin,
  Clock,
  Award,
  ChevronDown,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchSingleProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import ReviewForm from '../components/Products/ReviewForm'
import ReviewsList from '../components/Products/ReviewsList'
import RelatedProducts from '../components/Products/RelatedProducts'
import ImageGallery from '../components/Products/ImageGallery'
import Breadcrumb from '../components/Navigation/Breadcrumb'
import { toast } from 'react-toastify'

const ProductDetailEnhanced = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedVariant, setSelectedVariant] = useState(null)
  const stickyButtonRef = useRef(null)

  const productDetails = useSelector((state) => state.product.productDetails)
  const loading = useSelector((state) => state.product.loading)
  const wishlist = useSelector((state) => state.wishlist.items, shallowEqual)

  const isInWishlist = wishlist.some((item) => item.id === productDetails?.id)

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id))
      // Track recently viewed
      const stored = localStorage.getItem('recentlyViewed')
      let recentlyViewed = stored ? JSON.parse(stored) : []
      recentlyViewed = recentlyViewed.filter((p) => (p.id || p._id) !== id)
      recentlyViewed.unshift({ id, _id: id })
      recentlyViewed = recentlyViewed.slice(0, 20)
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed))
    }
  }, [id, dispatch])

  // Track scroll for sticky button
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Loader className="w-16 h-16 animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!productDetails?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  // Parse data
  const price =
    typeof productDetails.price === 'string'
      ? parseFloat(productDetails.price)
      : productDetails.price
  const rating =
    typeof productDetails.ratings === 'string'
      ? parseFloat(productDetails.ratings)
      : productDetails.ratings || 0
  const images = productDetails.images || []
  const mainImage = images[selectedImage]?.url || images[0]?.url || ''

  // Calculate discount percentage
  const discount = productDetails.original_price
    ? Math.round(((productDetails.original_price - price) / productDetails.original_price) * 100)
    : 0

  const handleAddToCart = () => {
    if (quantity <= 0) return
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: images[0]?.url || mainImage,
        quantity: quantity,
      }),
    )
    toast.success(`✓ ${quantity} item(s) added to cart!`, {
      autoClose: 2000,
      className: 'bg-green-600',
    })
  }

  const handleBuyNow = () => {
    if (quantity <= 0) return
    handleAddToCart()
    setTimeout(() => navigate('/payment'), 600)
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < productDetails.stock) {
      setQuantity(quantity + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productDetails.id))
      setIsWishlisted(false)
      toast.info('Removed from wishlist')
    } else {
      dispatch(
        addToWishlist({
          id: productDetails.id,
          name: productDetails.name,
          price: price,
          image: images[0]?.url || mainImage,
          category: productDetails.category,
        }),
      )
      setIsWishlisted(true)
      toast.success('Added to wishlist!')
    }
  }

  const handleShare = () => {
    const shareUrl = window.location.href
    const shareText = `Check out "${productDetails.name}" - ৳${price.toFixed(2)}`

    if (navigator.share) {
      navigator
        .share({
          title: productDetails.name,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => navigator.clipboard.writeText(shareUrl))
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sticky Mobile Header */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 md:hidden">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-full">
          <button
            onClick={() => navigate('/products')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex-1 mx-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              ৳{price.toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {productDetails.name}
            </p>
          </div>
          <button
            onClick={handleWishlist}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <Heart
              className={`w-5 h-5 transition ${isInWishlist ? 'fill-red-600 text-red-600' : 'text-gray-600 dark:text-gray-400'}`}
            />
          </button>
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:block border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              {
                label: productDetails.category,
                href: `/products?category=${productDetails.category}`,
              },
              { label: productDetails.name, href: '#' },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 md:pt-0">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl sm:px-4 py-4 md:py-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* IMAGE SECTION - Enhanced Gallery */}
            <div className="lg:col-span-1 md:sticky md:top-20 md:h-fit">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Main Image with Premium Effects */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 aspect-square overflow-hidden group">
                  <img
                    src={mainImage}
                    alt={productDetails.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      -{discount}%
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  <div className="absolute top-4 left-4">
                    {productDetails.stock > 5 ? (
                      <div className="flex items-center gap-2 bg-green-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                        <Check className="w-4 h-4" />
                        In Stock
                      </div>
                    ) : productDetails.stock > 0 ? (
                      <div className="flex items-center gap-2 bg-orange-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                        <AlertCircle className="w-4 h-4" />
                        Low Stock
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* View Count Indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{Math.floor(Math.random() * 500) + 100} viewing</span>
                  </div>
                </div>

                {/* Thumbnail Gallery - Premium */}
                {images.length > 1 && (
                  <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex gap-2 overflow-x-auto">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            selectedImage === idx
                              ? 'border-blue-600 shadow-lg'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`${idx}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedImage === idx && (
                            <div className="absolute inset-0 bg-blue-600/20" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges Row */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50 text-center hover:shadow-md transition">
                  <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Free Ship</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50 text-center hover:shadow-md transition">
                  <RotateCcw className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">30 Return</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50 text-center hover:shadow-md transition">
                  <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Warranty</p>
                </div>
              </div>
            </div>

            {/* PRODUCT INFO SECTION - Right Side */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Header Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-4">
                {/* Category & Social Proof */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-wrap">
                    <span className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                      {productDetails.category}
                    </span>
                    {productDetails.is_bestseller && (
                      <span className="inline-block text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1.5 rounded-full">
                        🔥 Best Seller
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Rating - Premium Layout */}
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                    {productDetails.name}
                  </h1>

                  {/* Enhanced Rating Section */}
                  <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">
                        {productDetails.review_count || 0} reviews
                      </span>
                      <span>•</span>
                      <span className="text-green-600 font-semibold">
                        {Math.floor(Math.random() * 5000) + 1000} sold
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section - Premium Design */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-baseline gap-4 mb-3">
                    <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400">
                      ৳{price.toFixed(0)}
                    </p>
                    {productDetails.original_price && productDetails.original_price > price && (
                      <>
                        <span className="text-lg line-through text-gray-500 dark:text-gray-400">
                          ৳{productDetails.original_price.toFixed(0)}
                        </span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                          Save ৳{Math.round(productDetails.original_price - price)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Price Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      Price dropping
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                      <Clock className="w-4 h-4" />
                      Limited offer
                    </div>
                  </div>
                </div>

                {/* Delivery Info - Premium Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200/50 dark:border-green-700/50">
                    <Truck className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Free Delivery</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Orders over ৳500</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50">
                    <Clock className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Fast Delivery</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1-2 Days</p>
                  </div>
                </div>
              </div>

              {/* QUANTITY & ACTION BUTTONS */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-4">
                {/* Quantity Selector - Enhanced */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                      >
                        <Minus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <span className="px-6 font-bold text-lg text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        disabled={quantity >= productDetails.stock}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                      >
                        <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        productDetails.stock > 10
                          ? 'text-green-600'
                          : productDetails.stock > 0
                            ? 'text-orange-600'
                            : 'text-red-600'
                      }`}
                    >
                      {productDetails.stock > 10
                        ? '✓ Plenty in stock'
                        : productDetails.stock > 0
                          ? `Only ${productDetails.stock} left!`
                          : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Premium Design */}
                <div className="space-y-3">
                  {/* Primary CTAs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={productDetails.stock <= 0}
                      className={`py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all duration-300 ${
                        productDetails.stock > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={productDetails.stock <= 0}
                      className={`py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all duration-300 ${
                        productDetails.stock > 0
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-6 h-6" />
                      Buy Now
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleWishlist}
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                        isInWishlist
                          ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-600 dark:hover:border-red-400 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">Wishlist</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="py-3 px-4 rounded-xl font-bold border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>

                {/* Guarantee Message */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <span className="font-bold">Secure checkout</span> • 30-day returns • 1-year
                    warranty
                  </p>
                </div>
              </div>

              {/* PRODUCT SPECS & DETAILS */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200/50 dark:border-gray-700/50">
                  {['Overview', 'Details', 'Reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`flex-1 py-4 px-4 font-bold transition-all border-b-2 ${
                        activeTab === tab.toLowerCase()
                          ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                          : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        Product Overview
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {productDetails.description ||
                          'High-quality product designed for optimal performance and durability. Perfect for everyday use with premium materials.'}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                            SKU
                          </p>
                          <p className="text-gray-900 dark:text-white font-bold">
                            {productDetails.sku || 'SKU123'}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                            Category
                          </p>
                          <p className="text-gray-900 dark:text-white font-bold">
                            {productDetails.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Material', value: 'Premium Quality' },
                          { label: 'Color', value: productDetails.color || 'Available' },
                          { label: 'Warranty', value: '1 Year' },
                          { label: 'Shipping', value: 'Free Delivery' },
                        ].map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                          >
                            <span className="text-gray-600 dark:text-gray-400 font-semibold">
                              {spec.label}
                            </span>
                            <span className="text-gray-900 dark:text-white font-bold">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        Customer Reviews
                      </h3>
                      <ReviewsList productId={id} />
                      <ReviewForm productId={id} />
                    </div>
                  )}
                </div>
              </div>

              {/* Related Products */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-4">
                  Similar Products
                </h3>
                <RelatedProducts category={productDetails.category} currentProductId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailEnhanced
