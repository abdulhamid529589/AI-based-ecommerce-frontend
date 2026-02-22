import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Heart, ShoppingCart, Trash2, ArrowRight, Zap } from 'lucide-react'
import { removeFromWishlist, clearWishlist } from '../store/slices/wishlistSlice'
import { removeFromWishlistOnServer, fetchWishlistFromServer } from '../store/thunks/wishlistThunks'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { formatBDT } from '../lib/currencyFormatter'
import './Wishlist.css'

const Wishlist = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const wishlistState = useSelector((state) => state.wishlist)
  const wishlistItems = wishlistState?.items || []
  const isLoading = wishlistState?.loading || false

  // Fetch wishlist from server on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(fetchWishlistFromServer())
    }
  }, [dispatch])

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      }),
    )
    dispatch(removeFromWishlist(item.id))
    // Sync with backend
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(removeFromWishlistOnServer(item.id))
    }
  }

  const handleBuyNow = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      }),
    )
    dispatch(removeFromWishlist(item.id))
    // Sync with backend
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(removeFromWishlistOnServer(item.id))
    }
    toast.success('Added to cart! Proceeding to checkout...')
    setTimeout(() => {
      navigate('/payment')
    }, 500)
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromWishlist(itemId))
    // Sync with backend
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(removeFromWishlistOnServer(itemId))
    }
  }

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist())
      // Note: Backend clear-wishlist endpoint would need to be added
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="empty-state">
          <Heart className="w-20 h-20 text-gray-300" />
          <h2 className="empty-title">Your Wishlist is Empty</h2>
          <p className="empty-message">
            Add items to your wishlist to save them for later. You can add items from product pages.
          </p>
          <Link to="/products" className="btn-continue-shopping">
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  const totalItems = wishlistItems.length

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <div className="header-content">
          <div className="header-title">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1>My Wishlist</h1>
          </div>
          <p className="item-count">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button onClick={handleClearWishlist} className="btn-clear">
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </button>
        )}
      </div>

      <div className="wishlist-content">
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image-wrapper">
                <Link to={`/product/${item.id}`} className="item-image-link">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="item-image"
                  />
                </Link>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="btn-remove"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="item-details">
                <Link to={`/product/${item.id}`} className="item-name">
                  {item.name}
                </Link>

                {item.category && <p className="item-category">{item.category}</p>}

                <div className="item-rating">
                  {item.ratings && (
                    <>
                      <span className="stars">★★★★★</span>
                      <span className="rating-text">({item.ratings} reviews)</span>
                    </>
                  )}
                </div>

                <div className="item-price">
                  <span className="current-price">{formatBDT(item.price)}</span>
                  {item.originalPrice && (
                    <>
                      <span className="original-price">{formatBDT(item.originalPrice)}</span>
                      <span className="discount">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}
                        % off
                      </span>
                    </>
                  )}
                </div>

                <div className="item-meta">
                  <p className="added-date">Added {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>

                <div className="item-actions">
                  <button onClick={() => handleAddToCart(item)} className="btn-add-to-cart">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button onClick={() => handleBuyNow(item)} className="btn-buy-now">
                    <Zap className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wishlist-footer">
        <Link to="/products" className="btn-continue-shopping">
          Continue Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default Wishlist
