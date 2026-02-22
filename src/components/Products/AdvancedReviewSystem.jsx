import { useState, useCallback, useMemo } from 'react'
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageCircle,
  Search,
  Filter,
  TrendingUp,
  Loader,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  fetchProductReviews,
  voteReview,
  flagReview,
  fetchReviewStatistics,
} from '../../services/reviewAPI'
import '../../styles/advanced-review-system.css'

/**
 * Advanced Review System Component
 * Insane-level features: advanced filtering, sorting, voting, flagging, replies, analytics
 */
const AdvancedReviewSystem = ({ productId, onReviewsLoad }) => {
  // State
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('newest')
  const [filter, setFilter] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userVotes, setUserVotes] = useState({})

  // Load reviews with filters
  const loadReviews = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    try {
      const response = await fetchProductReviews(productId, {
        page,
        limit: 10,
        sort,
        filter,
        verified_only: verifiedOnly,
        search: searchQuery,
      })

      if (response.success) {
        setReviews(response.data || [])
        setStats(response.stats)
        onReviewsLoad?.(response)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [productId, page, sort, filter, verifiedOnly, searchQuery])

  // Handle vote
  const handleVote = useCallback(async (reviewId, voteType) => {
    try {
      const response = await voteReview(reviewId, voteType)
      if (response.success) {
        setUserVotes((prev) => ({
          ...prev,
          [reviewId]: voteType,
        }))
        // Update review counts
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  helpful_count: response.data.helpful_count,
                  unhelpful_count: response.data.unhelpful_count,
                }
              : r,
          ),
        )
        toast.success('Vote recorded')
      }
    } catch (error) {
      toast.error('Failed to record vote')
    }
  }, [])

  // Handle flag
  const handleFlag = useCallback(async (reviewId) => {
    const reason = prompt('Select reason:\n1. Spam\n2. Offensive\n3. Irrelevant\n4. Fake\n5. Other')
    if (!reason) return

    try {
      await flagReview(reviewId, reason, '')
      toast.success('Review flagged for moderation')
    } catch (error) {
      toast.error('Failed to flag review')
    }
  }, [])

  // Render rating distribution
  const renderRatingDistribution = () => {
    if (!stats) return null

    const { distribution } = stats
    const total = Object.values(distribution).reduce((a, b) => a + b, 0)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">
                {stats.avgRating}
              </div>
              <div className="flex justify-center gap-1 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.round(stats.avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {stats.total} reviews ({stats.verifiedCount} verified)
              </p>
            </div>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0
              const percentage = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-yellow-400"
                      transition={{ delay: stars * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    )
  }

  // Render filters and search
  const renderFilterBar = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
          <option value="trending">Trending</option>
        </select>

        {/* Filter by Rating */}
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        {/* Verified Only */}
        <button
          onClick={() => {
            setVerifiedOnly(!verifiedOnly)
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            verifiedOnly
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <Filter size={16} className="inline mr-2" />
          Verified Only
        </button>
      </div>
    </motion.div>
  )

  // Render individual review
  const renderReview = (review) => {
    const userVote = userVotes[review.id]
    const helpfulScore = review.helpful_count - review.unhelpful_count

    return (
      <motion.div
        key={review.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{review.reviewer_name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {review.verified_purchase && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                  ✓ Verified Purchase
                </span>
              )}
              {review.is_featured && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <TrendingUp size={12} /> Featured
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Title and Content */}
        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h5>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{review.content}</p>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {review.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Review ${idx}`}
                className="w-20 h-20 rounded object-cover"
              />
            ))}
          </div>
        )}

        {/* Helpful Votes */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleVote(review.id, 'helpful')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
              userVote === 'helpful'
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsUp size={16} />
            <span className="text-sm">{review.helpful_count}</span>
          </button>

          <button
            onClick={() => handleVote(review.id, 'unhelpful')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
              userVote === 'unhelpful'
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsDown size={16} />
            <span className="text-sm">{review.unhelpful_count}</span>
          </button>

          {review.reply_count > 0 && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <MessageCircle size={16} />
              <span className="text-sm">{review.reply_count} replies</span>
            </div>
          )}

          <button
            onClick={() => handleFlag(review.id)}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
          >
            <Flag size={16} />
            <span className="text-sm">Report</span>
          </button>
        </div>
      </motion.div>
    )
  }

  // Pagination
  const renderPagination = (pagination) => {
    if (pagination.pages <= 1) return null

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white"
        >
          Previous
        </button>
        {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
          const pageNum = i + 1
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-2 rounded-lg ${
                page === pageNum
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 dark:border-gray-600 dark:text-white'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
        <button
          onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
          disabled={page === pagination.pages}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white"
        >
          Next
        </button>
      </div>
    )
  }

  // Load reviews on effect
  useState(() => {
    loadReviews()
  }, [loadReviews])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>

      {renderRatingDistribution()}
      {renderFilterBar()}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <Star className="text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <>
          {reviews.map((review) => renderReview(review))}
          {stats && renderPagination(stats.pagination)}
        </>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No reviews yet. Be the first to review!
          </p>
        </div>
      )}
    </div>
  )
}

export default AdvancedReviewSystem
