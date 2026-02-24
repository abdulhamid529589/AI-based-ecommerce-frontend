import { useEffect, useState } from 'react'
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
  BarChart3,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchSingleProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { useSystemSettings } from '../hooks/useSystemSettings'
import ReviewForm from '../components/Products/ReviewForm'
import ReviewsList from '../components/Products/ReviewsList'
import ProductDescriptionSection from '../components/Products/ProductDescriptionSection'
import RelatedProducts from '../components/Products/RelatedProducts'
import TrustSignals from '../components/Products/TrustSignals'
import ProductInfoDetails from '../components/Products/ProductInfoDetails'
import ImageGallery from '../components/Products/ImageGallery'
import StockIndicator from '../components/Products/StockIndicator'
import Breadcrumb from '../components/Navigation/Breadcrumb'
import ComparisonModal from '../components/Products/ComparisonModal'
import MobileProductSpecs from '../components/Products/MobileProductSpecs'
import {
  UrgencyWidget,
  PricingPsychology,
  TrustBadgesSection,
  UrgencyCounter,
} from '../components/Products/MarketingPsychology'
import {
  FrequentlyBoughtTogether,
  CompleteTheLook,
  CustomersAlsoViewed,
} from '../components/Products/CrossSellUpsell'
import {
  ReviewHighlights,
  ReviewRatingBreakdown,
  BuyersAlsoAppreciated,
} from '../components/Products/ReviewMarketing'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { settings } = useSystemSettings()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonProducts, setComparisonProducts] = useState([])

  const productDetails = useSelector((state) => state.product.productDetails)
  const loading = useSelector((state) => state.product.loading)
  const wishlist = useSelector((state) => state.wishlist.items, shallowEqual)
  const products = useSelector((state) => state.products?.items || [], shallowEqual)
  const isInWishlist = wishlist.some((item) => item.id === productDetails?.id)

  // Fetch product details when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id))

      // Track recently viewed product
      const stored = localStorage.getItem('recentlyViewed')
      let recentlyViewed = stored ? JSON.parse(stored) : []

      // Fetch the current product data to store
      // For now, we'll store minimal info and fetch full details later
      const productToStore = {
        id,
        _id: id,
      }

      // Remove if already exists, then add to beginning
      recentlyViewed = recentlyViewed.filter((p) => (p.id || p._id) !== id)
      recentlyViewed.unshift(productToStore)

      // Keep only last 20 viewed products
      recentlyViewed = recentlyViewed.slice(0, 20)

      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!productDetails || !productDetails.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  // Parse product data
  const price =
    typeof productDetails.price === 'string'
      ? parseFloat(productDetails.price)
      : productDetails.price
  const rating =
    typeof productDetails.ratings === 'string'
      ? parseFloat(productDetails.ratings)
      : productDetails.ratings || 0
  const images = productDetails.images || []
  const mainImage = images[selectedImage]?.url || images[0]?.url || null

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: images[0]?.url || mainImage,
        quantity: quantity,
      }),
    )
    toast.success(`${quantity} item(s) added to cart!`)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: images[0]?.url || mainImage,
        quantity: quantity,
      }),
    )
    toast.success(`${quantity} item(s) added! Proceeding to checkout...`)
    setTimeout(() => {
      navigate('/payment')
    }, 500)
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
        .catch(() => {
          // Share failed, fallback to copy
          copyToClipboard(shareUrl)
        })
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard!')
    })
  }

  const handleAddToComparison = () => {
    // Get similar products from same category
    const similar = products
      .filter((p) => p.category === productDetails.category && (p._id || p.id) !== id)
      .slice(0, 2)

    setComparisonProducts([productDetails, ...similar])
    setShowComparison(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header - Fixed at top */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-card border-b border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate flex-1 mx-3">
            {productDetails?.name}
          </h2>
          <button
            onClick={handleWishlist}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist ? 'fill-red-600 text-red-600' : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Breadcrumb - Hide on mobile, show on desktop */}
      <div className="hidden md:block">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            {
              label: productDetails?.category,
              href: `/products?category=${productDetails?.category}`,
            },
            { label: productDetails?.name, href: '#' },
          ]}
        />
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        products={comparisonProducts}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
          </div>
        </div>
      ) : !productDetails || !productDetails.id ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-20 md:pt-0 pb-24 md:pb-0">
          {/* Back Button - Desktop only */}
          <div className="hidden md:block container mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </div>

          {/* Main Content */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl sm:px-4 py-4 md:py-8">
            {/* Mobile Layout: Stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Image Gallery - Full width on mobile */}
              <div className="order-1">
                <ImageGallery
                  images={images.length > 0 ? images : mainImage ? [{ url: mainImage }] : []}
                />
              </div>

              {/* Product Info - Full width on mobile */}
              <div className="order-2 space-y-4 md:space-y-6">
                {/* Category & Wishlist Badge - Mobile */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {productDetails.category}
                    </span>
                  </div>
                </div>

                {/* Product Name & Rating */}
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    {productDetails.name}
                  </h1>

                  {/* Rating - Prominent on mobile */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {rating.toFixed(1)} ({productDetails.review_count || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Price - Large and prominent */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 md:p-6">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                    ৳{price.toFixed(2)}
                  </p>
                  {productDetails.original_price && productDetails.original_price > price && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg line-through text-gray-500">
                        ৳{productDetails.original_price.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                        Save ৳{(productDetails.original_price - price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing Psychology Component */}
                <PricingPsychology
                  price={price}
                  originalPrice={productDetails.original_price}
                  discount={
                    productDetails.original_price
                      ? Math.round(
                          ((productDetails.original_price - price) /
                            productDetails.original_price) *
                            100,
                        )
                      : 0
                  }
                  hasFlashSale={productDetails.is_flash_sale || false}
                  flashSaleEndsAt={productDetails.flash_sale_ends_at}
                />

                {/* Dynamic Free Shipping Badge - From Settings */}
                {settings?.shipping?.freeShippingEnabled &&
                  price >= settings.shipping.freeShippingThreshold && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-semibold flex items-center gap-2">
                        <span className="text-lg">✓</span> Free Shipping on this order!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Orders over ৳{settings.shipping.freeShippingThreshold.toLocaleString()} get
                        free shipping
                      </p>
                    </div>
                  )}

                {/* Stock Indicator */}
                <div>
                  <StockIndicator stock={productDetails.stock} maxStock={20} />
                </div>

                {/* Dynamic Low Stock Warning - From Settings */}
                {productDetails.stock > 0 &&
                  productDetails.stock <= settings?.inventory?.lowStockThreshold && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-orange-800 text-sm font-semibold">
                        ⚠️ Only {productDetails.stock} items left - Order soon!
                      </p>
                    </div>
                  )}

                {/* Dynamic Backorder Info - From Settings */}
                {productDetails.stock <= 0 && settings?.inventory?.allowBackorders && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 font-semibold">
                      📦 Available for pre-order
                      <br />
                      <span className="text-sm">
                        Estimated delivery: {settings.inventory.backorderDays} days
                      </span>
                    </p>
                  </div>
                )}

                {/* Urgency Widget - Creates FOMO */}
                <UrgencyWidget
                  stockLevel={productDetails.stock}
                  maxStock={20}
                  soldLast24Hours={Math.floor(Math.random() * 50) + 10}
                  viewingNow={Math.floor(Math.random() * 10) + 2}
                  category={productDetails.category}
                />

                {/* Quick Info Cards - Mobile friendly */}
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {/* Dynamic: Free Shipping Cost */}
                  <div className="bg-card rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {settings?.shipping?.freeShippingEnabled &&
                      price >= settings.shipping.freeShippingThreshold
                        ? 'Free Shipping'
                        : `৳${settings?.shipping?.standardShippingCost || 100}`}
                    </p>
                  </div>
                  {/* Dynamic: Return Window */}
                  <div className="bg-card rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <RotateCcw className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-foreground">
                      {settings?.returns?.returnEnabled
                        ? `${settings.returns.returnWindowDays}-Day Return`
                        : 'No Returns'}
                    </p>
                  </div>
                  {/* Dynamic: Currency Display */}
                  <div className="bg-card rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <Shield className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-foreground">
                      {settings?.pricing?.currency || 'BDT'}
                    </p>
                  </div>
                </div>

                {/* Trust Badges Section */}
                <TrustBadgesSection
                  rating={rating}
                  reviewCount={productDetails.review_count || 0}
                  hasReturnGuarantee={true}
                  hasFreeShipping={true}
                  isVerifiedSeller={true}
                  secureCheckout={true}
                />

                {/* Quantity Selector - Larger on mobile */}
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Quantity:</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-6 font-semibold text-gray-900 dark:text-white text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        disabled={quantity >= productDetails.stock}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Stock: {productDetails.stock}
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Optimized for mobile */}
                <div className="space-y-3">
                  {/* Primary CTAs - Full width stacked on mobile */}
                  <div className="space-y-2 md:space-y-0 md:flex md:gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={productDetails.stock <= 0}
                      className={`w-full md:flex-1 py-3 sm:py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition text-base sm:text-lg ${
                        productDetails.stock > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      Add to Cart
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={productDetails.stock <= 0}
                      className={`w-full md:flex-1 py-3 sm:py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition text-base sm:text-lg ${
                        productDetails.stock > 0
                          ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                      Buy Now
                    </button>
                  </div>

                  {/* Secondary Actions - Icon buttons on mobile, text on desktop */}
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={handleWishlist}
                      className={`flex-1 md:flex-none md:p-3 p-3 border-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold ${
                        isInWishlist
                          ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-600 dark:hover:border-red-400 text-gray-600 dark:text-gray-400'
                      }`}
                      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${isInWishlist ? 'fill-current' : ''}`}
                      />
                      <span className="md:hidden text-sm">Wishlist</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex-1 md:flex-none md:p-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition flex items-center justify-center gap-2 font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Share this product"
                    >
                      <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="md:hidden text-sm">Share</span>
                    </button>

                    <button
                      onClick={handleAddToComparison}
                      className="flex-1 md:flex-none md:p-3 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-600 dark:hover:border-purple-400 transition flex items-center justify-center gap-2 font-semibold text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                      title="Compare with similar products"
                    >
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="md:hidden text-sm">Compare</span>
                    </button>
                  </div>
                </div>

                {/* Product Info Details */}
                <div className="hidden md:block">
                  <ProductInfoDetails productDetails={productDetails} />
                </div>
              </div>
            </div>

            {/* Product Description Section */}
            <div className="mt-12">
              <ProductDescriptionSection description={productDetails.description} />
            </div>

            {/* Frequently Bought Together - Bundle Recommendations */}
            <div className="mt-12">
              <FrequentlyBoughtTogether
                mainProductId={productDetails.id}
                mainProductPrice={price}
                allProducts={products}
                onAddBundle={() => {
                  toast.success('বান্ডেল কার্টে যোগ করা হয়েছে!')
                }}
              />
            </div>

            {/* Complete The Look - Styled Collections */}
            <div className="mt-12">
              <CompleteTheLook
                productCategory={productDetails.category}
                onProductSelect={() => {}}
                allProducts={products}
              />
            </div>

            {/* Trust Signals Section */}
            <div className="mt-12">
              <TrustSignals />
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Customer Reviews
              </h2>

              {/* Review Marketing Components */}
              {productDetails.reviews && productDetails.reviews.length > 0 && (
                <>
                  {/* Review Rating Breakdown */}
                  <div className="mb-8">
                    <ReviewRatingBreakdown reviews={productDetails.reviews} />
                  </div>

                  {/* Review Highlights - Top reviews with sentiment */}
                  <div className="mb-8">
                    <ReviewHighlights reviews={productDetails.reviews} />
                  </div>

                  {/* Buyers Also Appreciated - Sentiment-based themes */}
                  <div className="mb-8">
                    <BuyersAlsoAppreciated reviews={productDetails.reviews} />
                  </div>
                </>
              )}

              {/* Review Form and List */}
              <ReviewForm productId={id} onReviewAdded={() => {}} userName={''} />
              <ReviewsList
                productId={id}
                refreshTrigger={id}
                initialReviews={productDetails.reviews || []}
              />
            </div>

            {/* Related Products Section */}
            <div className="mt-12">
              <RelatedProducts
                currentProductId={productDetails.id}
                category={productDetails.category}
                limit={6}
              />
            </div>

            {/* Customers Also Viewed - Trading Up Recommendations */}
            <div className="mt-12">
              <CustomersAlsoViewed
                currentProduct={productDetails}
                allProducts={products.filter(
                  (p) =>
                    p.category === productDetails.category && (p._id || p.id) !== productDetails.id,
                )}
                onProductClick={(product) => navigate(`/product/${product.id || product._id}`)}
              />
            </div>
          </div>

          {/* Sticky Bottom Action - Mobile Only */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-gray-200 dark:border-gray-700 md:hidden">
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl py-3">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={productDetails.stock <= 0}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition ${
                    productDetails.stock > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={productDetails.stock <= 0}
                  className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition ${
                    productDetails.stock > 0
                      ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
