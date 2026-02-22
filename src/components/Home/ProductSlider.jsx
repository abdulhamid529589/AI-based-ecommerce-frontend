import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart } from '../../store/slices/cartSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ProductSlider = ({ title, products }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    const productId = product._id || product.id
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const image = product.images?.[0]?.url || ''

    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        quantity: 1,
      }),
    )
    toast.success('Added to cart!')
  }

  const handleBuyNow = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    const productId = product._id || product.id
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const image = product.images?.[0]?.url || null

    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: price,
        image: image,
        quantity: 1,
      }),
    )
    toast.success('Added to cart! Proceeding to checkout...')
    setTimeout(() => {
      navigate('/payment')
    }, 500)
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="py-8 sm:py-10 md:py-12 px-0">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <Link
          to="/products"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-xs sm:text-sm transition"
        >
          View All →
        </Link>
      </div>

      <div className="relative group">
        {/* Scroll Buttons - Desktop only */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-card shadow-lg hover:shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition active:scale-90 items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-card shadow-lg hover:shadow-xl rounded-full p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition active:scale-90 items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Products Container - Mobile optimized */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-4 sm:px-0"
        >
          {products.map((product) => {
            const productId = product._id || product.id
            const price =
              typeof product.price === 'string' ? parseFloat(product.price) : product.price
            const rating =
              typeof product.ratings === 'string'
                ? parseFloat(product.ratings)
                : product.ratings || 0
            const image = product.images?.[0]?.url || null

            return (
              <Link
                key={productId}
                to={`/product/${productId}`}
                className="flex-shrink-0 w-40 sm:w-52 md:w-64 snap-start snap-always"
              >
                <div className="bg-card rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col active:shadow-xl">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-32 sm:h-40 md:h-44">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 active:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Out of Stock</span>
                      </div>
                    )}
                    {product.stock > 10 && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        Stock
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    {/* Category */}
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {product.category}
                    </span>

                    {/* Name */}
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mt-1.5 sm:mt-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-1.5 sm:mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between gap-2">
                      <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        ৳{price.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock <= 0}
                          className={`p-2 rounded-lg transition active:scale-90 flex-shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center ${
                            product.stock > 0
                              ? 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800 dark:active:bg-blue-700'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                          title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, product)}
                          disabled={product.stock <= 0}
                          className={`p-2 rounded-lg transition active:scale-90 flex-shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center ${
                            product.stock > 0
                              ? 'bg-green-600 hover:bg-green-700 text-white active:bg-green-800 dark:active:bg-green-700'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                          title={product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                        >
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          ← Swipe to see more →
        </div>
      </div>
    </div>
  )
}

export default ProductSlider
