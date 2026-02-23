import { useState } from 'react'
import { Send, Image as ImageIcon, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { createReview } from '../../services/reviewAPI'
import RatingStars from './RatingStars'
import { getOperationErrorMessage } from '../../utils/errorHandler'

const ReviewForm = ({ productId, onReviewAdded, userName = '' }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check authentication first
    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('Please log in to post a review')
      console.warn('❌ No access token found. User needs to log in.')
      return
    }

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (!comment.trim()) {
      toast.error('Please enter your review')
      return
    }

    setSubmitting(true)

    try {
      // Send as plain JSON object instead of FormData
      const reviewData = {
        rating: parseInt(rating, 10),
        title: comment.substring(0, 100),
        content: comment.trim(),
      }

      console.log(`📝 [REVIEW SUBMIT] Sending review:`, {
        productId,
        reviewData,
        hasToken: !!token,
      })

      const response = await createReview(productId, reviewData)

      if (response.success) {
        toast.success('Review posted successfully!')
        setRating(0)
        setComment('')
        setImage(null)
        setImagePreview(null)
        setShowForm(false)

        // Call onReviewAdded with a slight delay to ensure backend has persisted
        console.log('✅ Review created successfully, triggering refresh after delay...')
        setTimeout(() => {
          console.log('🔄 Calling onReviewAdded to refresh reviews')
          console.log('📝 [REVIEW FORM] Review object:', response.data)
          onReviewAdded?.()
        }, 1200)
      }
    } catch (error) {
      console.error('Review submission error:', error)

      // Extract detailed error message
      let errorMessage = 'Unable to create item. Please try again.'

      if (error.response?.status === 401) {
        errorMessage = 'Please log in to post a review'
      } else if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to post a review'
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response?.data?.message || 'Please fill all required fields (rating, title, review)'
        console.error('❌ Validation error:', error.response?.data?.received)
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      console.error('📋 Full error details:', {
        status: error.response?.status,
        code: error.response?.data?.code,
        data: error.response?.data,
        message: errorMessage,
      })

      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (!showForm) {
    return (
      <motion.button
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
      >
        Write a Review
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
        >
          ✕
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating with Enhanced UI */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            How would you rate this product? <span className="text-red-500">*</span> (required)
          </label>
          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className="transition-all"
                >
                  <Star
                    size={28}
                    className={`transition-all cursor-pointer ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {rating > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2"
                >
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Review Comment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Review <span className="text-red-500">*</span> (required)
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell other customers about this product..."
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
          <p
            className={`text-xs mt-1 ${comment.length > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {comment.length}/500
          </p>
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Add Photo <span className="text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="review-image"
            />
            <motion.label
              htmlFor="review-image"
              whileHover={{ borderColor: '#f97316' }}
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {imagePreview ? 'Change image' : 'Click to upload'}
              </span>
            </motion.label>
          </div>

          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-3 relative inline-block"
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-700 shadow-lg"
                >
                  ×
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Review'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setShowForm(false)}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default ReviewForm
