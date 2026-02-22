import React from 'react'
import { TrendingUp, AlertCircle, Eye, Clock } from 'lucide-react'

/**
 * MARKETING PSYCHOLOGY COMPONENT - Product Detail Page
 * Implements conversion optimization tactics:
 * - Urgency indicators (stock, demand, time limits)
 * - Social proof (sales, viewers, reviews)
 * - Scarcity signals
 * - FOMO triggers
 */

export const UrgencyWidget = ({ stock, sold24h, viewingNow, salesVelocity = 'medium' }) => {
  // Determine urgency level based on stock
  const getStockStatus = (s) => {
    if (s <= 0) return { status: 'out-of-stock', color: 'red', text: 'Out of Stock' }
    if (s <= 3) return { status: 'critical', color: 'red', text: `Only ${s} left in stock!` }
    if (s <= 10) return { status: 'low', color: 'orange', text: `Only ${s} available` }
    return { status: 'normal', color: 'green', text: 'In Stock' }
  }

  const stockStatus = getStockStatus(stock)

  return (
    <div className="space-y-3">
      {/* Stock Status */}
      <div
        className={`p-3 rounded-lg border-2 border-${stockStatus.color}-200 bg-${stockStatus.color}-50 dark:bg-${stockStatus.color}-900/20`}
      >
        <div className="flex items-center gap-2">
          <AlertCircle
            size={18}
            className={`text-${stockStatus.color}-600 dark:text-${stockStatus.color}-400`}
          />
          <span
            className={`font-bold text-${stockStatus.color}-700 dark:text-${stockStatus.color}-300`}
          >
            {stockStatus.text}
          </span>
        </div>
      </div>

      {/* Social Proof - Sales Velocity */}
      {sold24h > 0 && (
        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-600 dark:text-orange-400" />
            <span className="font-semibold text-orange-700 dark:text-orange-300">
              🔥 {sold24h} sold in last 24 hours
            </span>
          </div>
        </div>
      )}

      {/* People Viewing Now */}
      {viewingNow > 0 && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              👥 {viewingNow} people viewing this right now
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export const PricingPsychology = ({
  currentPrice,
  originalPrice,
  discount = null,
  savings = null,
  flashSaleEndsAt = null,
}) => {
  // Calculate savings
  const savingsAmount = originalPrice - currentPrice
  const savingsPercent = Math.round((savingsAmount / originalPrice) * 100)

  // Format time remaining
  const getTimeRemaining = (endTime) => {
    if (!endTime) return null
    const now = new Date()
    const end = new Date(endTime)
    const diff = end - now

    if (diff < 0) return null

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  const timeLeft = getTimeRemaining(flashSaleEndsAt)

  return (
    <div className="space-y-4">
      {/* Price Display with Psychology */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          {/* Current Price - Large, Bold, Primary Color */}
          <span className="text-4xl font-bold text-red-600 dark:text-red-400">
            ৳{currentPrice?.toLocaleString('bn-BD')}
          </span>

          {/* Original Price - Struck through, Gray */}
          {originalPrice > currentPrice && (
            <span className="text-xl text-gray-400 line-through">
              ৳{originalPrice?.toLocaleString('bn-BD')}
            </span>
          )}
        </div>

        {/* Savings Amount - Green, Bold */}
        {savingsAmount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              Save ৳{savingsAmount?.toLocaleString('bn-BD')} ({savingsPercent}%)
            </span>
            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-bold">
              -{savingsPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Flash Sale Timer */}
      {flashSaleEndsAt && timeLeft && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-red-600 dark:text-red-400 animate-pulse" />
            <div>
              <p className="font-bold text-red-700 dark:text-red-300">Flash Sale Ends Soon!</p>
              <p className="text-sm text-red-600 dark:text-red-400">{timeLeft}</p>
            </div>
          </div>
        </div>
      )}

      {/* Price Anchoring - Suggested Comparison */}
      {originalPrice * 1.2 < 10000 && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
          💡 Compare at ৳{Math.round(originalPrice * 1.2)?.toLocaleString('bn-BD')} in competitor
          stores
        </div>
      )}
    </div>
  )
}

export const TrustBadgesSection = ({ rating, reviewCount, isVerified, warranty, returns = 7 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Rating Badge */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          ⭐ {rating?.toFixed(1) || '4.8'}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          ({reviewCount?.toLocaleString('bn-BD') || '2,847'} reviews)
        </p>
      </div>

      {/* Free Returns */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 text-center">
        <div className="text-sm font-bold text-green-700 dark:text-green-300">✓ Returns</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{returns} days money-back</p>
      </div>

      {/* Secure Payment */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-center">
        <div className="text-sm font-bold text-blue-700 dark:text-blue-300">🔒 Secure</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">256-bit SSL</p>
      </div>

      {/* Verified Seller */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 text-center">
        <div className="text-sm font-bold text-purple-700 dark:text-purple-300">✓ Verified</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">50K+ customers</p>
      </div>
    </div>
  )
}

export const UrgencyCounter = ({ stock, maxStock = 20 }) => {
  if (stock > maxStock) return null

  const percentage = ((maxStock - stock) / maxStock) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Availability</span>
        <span className="text-sm font-bold text-red-600 dark:text-red-400">Only {stock} left!</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default UrgencyWidget
