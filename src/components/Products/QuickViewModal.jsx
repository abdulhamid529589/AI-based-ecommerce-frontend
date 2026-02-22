import { useState } from 'react'
import { X, ShoppingCart, Heart, Zap, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice'
import { toast } from 'react-toastify'
import { getImageSrc, handleImageError } from '../../utils/placeholderImage'
import '../../styles/QuickViewModal.css'

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist.items)
  const isInWishlist = wishlist.some((item) => item.id === product?.id)

  if (!isOpen || !product) return null

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const rating =
    typeof product.ratings === 'string' ? parseFloat(product.ratings) : product.ratings || 0
  const image = getImageSrc(product.images?.[0]?.url, 'No Image')

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: image,
        quantity: quantity,
      }),
    )
    toast.success(`${quantity} item(s) added to cart!`)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: image,
        quantity: quantity,
      }),
    )
    toast.success('Proceeding to checkout...')
    onClose()
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
      toast.info('Removed from wishlist')
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: price,
          image: image,
          category: product.category,
        }),
      )
      toast.success('Added to wishlist!')
    }
  }

  return (
    <>
      <div className="qvm-backdrop" onClick={onClose} />
      <div className="qvm-container">
        <div className="qvm-content">
          {/* Close Button */}
          <button className="qvm-close" onClick={onClose} aria-label="Close">
            <X className="w-6 h-6" />
          </button>

          <div className="qvm-grid">
            {/* Product Image */}
            <div className="qvm-image">
              <img
                src={image}
                alt={product.name}
                onError={(e) => handleImageError(e, 'No Image')}
              />
              {product.stock <= 0 && <div className="qvm-overlay">Out of Stock</div>}
            </div>

            {/* Product Details */}
            <div className="qvm-details">
              {/* Category */}
              <span className="qvm-category">{product.category}</span>

              {/* Name */}
              <h2 className="qvm-name">{product.name}</h2>

              {/* Rating */}
              <div className="qvm-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="qvm-rating-text">
                  {rating.toFixed(1)} ({product.review_count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="qvm-price">
                <span className="qvm-price-amount">৳{price.toFixed(2)}</span>
              </div>

              {/* Stock Status */}
              <div className="qvm-stock">
                {product.stock > 0 ? (
                  <span className="in-stock">✓ {product.stock} in stock</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              {/* Description - Short */}
              {product.description && (
                <p className="qvm-description">{product.description.substring(0, 100)}...</p>
              )}

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="qvm-quantity">
                  <label>Quantity:</label>
                  <div className="qvm-qty-control">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)),
                        )
                      }
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="qvm-actions">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="qvm-btn add-to-cart"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="qvm-btn buy-now"
                  title="Buy Now"
                >
                  <Zap className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={handleWishlist}
                  className={`qvm-btn wishlist ${isInWishlist ? 'active' : ''}`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* View Details Link */}
              <a href={`/product/${product.id}`} className="qvm-view-details" onClick={onClose}>
                View Full Details →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuickViewModal
