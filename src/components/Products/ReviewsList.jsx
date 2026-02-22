import { useEffect, useState } from 'react'
import { Star, MessageCircle, Trash2, MoreVertical } from 'lucide-react'
import { toast } from 'react-toastify'
import { fetchProductReviews, deleteReview } from '../../services/reviewAPI'
import RatingStars from './RatingStars'

const ReviewsList = ({ productId, refreshTrigger, initialReviews = [] }) => {
  const [rawReviews, setRawReviews] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [averageRating, setAverageRating] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState({})

  const reviewsPerPage = 5

  useEffect(() => {
    console.log(
      '📋 [REVIEWS LIST] Effect triggered - refreshTrigger:',
      refreshTrigger,
      'productId:',
      productId,
    )
    loadReviews()
  }, [productId, refreshTrigger])

  // Re-process reviews when sort or filter changes
  useEffect(() => {
    if (rawReviews.length > 0) {
      console.log('🔄 [REVIEWS LIST] Sort/Filter changed, reprocessing')
      applyFiltersAndSort(rawReviews)
    }
  }, [sortBy, filterRating])

  // Fetch reviews from API
  const loadReviews = async () => {
    if (!productId) {
      console.warn('❌ [REVIEWS LIST] No productId provided')
      return
    }
    setLoading(true)
    try {
      console.log(
        `📋 [REVIEWS LIST] Fetching reviews for product:`,
        productId,
        'refreshTrigger:',
        refreshTrigger,
      )
      // Add cache-busting parameter
      const params = { limit: 100, _t: Date.now() }
      const response = await fetchProductReviews(productId, params)
      console.log(`📋 [REVIEWS LIST] Full API Response:`, response)

      if (response?.success && Array.isArray(response.data)) {
        console.log(`✅ [REVIEWS LIST] Got ${response.data.length} reviews from API`)
        normalizeAndStore(response.data)
      } else {
        console.warn(`⚠️ [REVIEWS LIST] Invalid response, got:`, response)
        normalizeAndStore(Array.isArray(initialReviews) ? initialReviews : [])
      }
    } catch (error) {
      console.error('❌ [REVIEWS LIST] Error loading reviews:', error)
      normalizeAndStore(Array.isArray(initialReviews) ? initialReviews : [])
    } finally {
      setLoading(false)
    }
  }

  // Normalize and store raw reviews, then apply filters/sort
  const normalizeAndStore = (reviewData = []) => {
    let normalized = [...(Array.isArray(reviewData) ? reviewData : [])]

    console.log(`🔄 [REVIEWS NORMALIZE] Processing reviews:`, {
      inputType: typeof reviewData,
      isArray: Array.isArray(reviewData),
      count: normalized.length,
      isEmpty: normalized.length === 0,
    })

    // Normalize reviews to handle both old and new format
    normalized = normalized.map((review) => ({
      ...review,
      // Handle field name differences
      reviewer_name: review.reviewer_name || review.user_name || 'Anonymous',
      content: review.content || review.comment || '',
      title: review.title || 'Review',
    }))

    // Store raw reviews
    setRawReviews(normalized)

    // Calculate average rating and distribution
    if (normalized.length > 0) {
      const avg = (
        normalized.reduce((sum, review) => sum + (review.rating || 0), 0) / normalized.length
      ).toFixed(1)
      setAverageRating(avg)

      // Calculate rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      normalized.forEach((review) => {
        if (review.rating) distribution[review.rating]++
      })
      setRatingDistribution(distribution)
    } else {
      console.warn('⚠️ No reviews found in processed data')
      setAverageRating(0)
      setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
    }

    // Apply filters and sort
    applyFiltersAndSort(normalized)
  }

  // Apply filters and sorting to raw reviews
  const applyFiltersAndSort = (reviewsToProcess) => {
    let processed = [...reviewsToProcess]

    // Sort reviews
    if (sortBy === 'newest') {
      processed = processed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'oldest') {
      processed = processed.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortBy === 'highest') {
      processed = processed.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'lowest') {
      processed = processed.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    } else if (sortBy === 'helpful') {
      processed = processed.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0))
    }

    // Filter by rating
    if (filterRating !== 'all') {
      processed = processed.filter((review) => review.rating === parseInt(filterRating))
    }

    console.log(`✅ [REVIEWS STATE] Final state:`, {
      totalProcessed: processed.length,
      filterApplied: filterRating,
      sortApplied: sortBy,
    })

    setReviews(processed)
    setCurrentPage(1)
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const response = await deleteReview(reviewId)
      if (response.success) {
        toast.success('Review deleted successfully')
        // Remove deleted review from local state
        setReviews(reviews.filter((r) => r.id !== reviewId))
        // Reload reviews
        await loadReviews()
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const totalReviews = reviews.length
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage,
  )
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  console.log(`📊 [REVIEWS RENDER] About to render:`, {
    totalReviews,
    loading,
    paginatedReviewsLength: paginatedReviews.length,
    willShowEmpty: !loading && paginatedReviews.length === 0,
    totalPages,
    reviews: reviews.slice(0, 3), // Show first 3 for debug
  })

  return (
    <div className="mt-8">
      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {averageRating}
                </div>
                <RatingStars rating={Math.round(averageRating * 2) / 2} size="md" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                      {stars}★
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>

          {/* Filter by Rating */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : paginatedReviews.length > 0 ? (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.reviewer_name || 'Anonymous'}
                      </h4>
                      {review.verified_purchase && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Menu Button */}
                <div className="relative group">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <RatingStars rating={review.rating} size="sm" />
              </div>

              {/* Title */}
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h5>

              {/* Review Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {review.content}
              </p>

              {/* Helpful Count */}
              {review.helpful_count > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {review.helpful_count} people found this helpful
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No reviews yet. Be the first to review!
          </p>
          <button
            onClick={() => loadReviews()}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 text-sm"
          >
            {loading ? 'Refreshing...' : 'Refresh Reviews'}
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewsList
