import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Star, Send, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { postProductReview, deleteReview } from '../../store/slices/productSlice'

const ReviewsContainer = ({ productId, reviews = [] }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedReviewId, setSelectedReviewId] = useState(null)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { isPostingReview, isReviewDeleting } = useSelector((state) => state.product, shallowEqual)

  // Check if user has already reviewed
  const userReview = reviews.find((r) => r.user_id === user?.id)

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login to post a review')
      return
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      await dispatch(
        postProductReview({
          productId,
          rating,
          comment,
        }),
      ).unwrap()

      setComment('')
      setRating(5)
      toast.success(userReview ? 'Review updated successfully!' : 'Review posted successfully!')
    } catch (error) {
      toast.error(error || 'Failed to post review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      toast.error('Please login to delete a review')
      return
    }

    if (window.confirm('Are you sure you want to delete your review?')) {
      setSelectedReviewId(reviewId)
      try {
        await dispatch(deleteReview(productId)).unwrap()
        setComment('')
        setRating(5)
        toast.success('Review deleted successfully!')
      } catch (error) {
        toast.error(error || 'Failed to delete review')
      } finally {
        setSelectedReviewId(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Write Review Section */}
      {user ? (
        <div className="bg-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {userReview ? 'Update Your Review' : 'Write a Review'}
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition"
                  >
                    <Star
                      size={28}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review (Required)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows="4"
                maxLength="500"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPostingReview || !comment.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition"
            >
              <Send size={18} />
              {isPostingReview ? 'Posting...' : userReview ? 'Update Review' : 'Post Review'}
            </button>

            {/* Purchase Notice */}
            {!userReview && (
              <div className="flex gap-2 items-start p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle
                  size={18}
                  className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You can only review products you've purchased
                </p>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-blue-700 dark:text-blue-300">
            <strong>Want to write a review?</strong> Please{' '}
            <a
              href="/login"
              className="underline font-semibold hover:text-blue-800 dark:hover:text-blue-200"
            >
              login
            </a>{' '}
            to share your experience
          </p>
        </div>
      )}

      {/* Reviews List Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Reviews{' '}
          {reviews.length > 0 && <span className="text-gray-500">({reviews.length})</span>}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
              >
                {/* Review Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.user_name || 'Anonymous User'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < (parseFloat(review.rating) || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(parseFloat(review.rating) || 0).toFixed(1)} out of 5
                      </span>
                    </div>
                  </div>

                  {/* Delete Button - Only for own review */}
                  {user?.id === review.user_id && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={isReviewDeleting || selectedReviewId === review.id}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition"
                      title="Delete review"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-3">{review.comment}</p>

                {/* Review Date */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsContainer
