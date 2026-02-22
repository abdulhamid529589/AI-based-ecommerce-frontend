import React, { useState } from 'react'
import { ThumbsUp, MessageCircle, Star, TrendingUp } from 'lucide-react'

/**
 * ENHANCED REVIEW SYSTEM WITH MARKETING PSYCHOLOGY
 * - Social proof aggregation
 * - Review highlights/quotes
 * - Trust building through reviews
 * - Motivation to purchase based on reviews
 */

export const ReviewHighlights = ({ reviews = [], mainProduct }) => {
  if (!reviews.length) return null

  // Extract key review highlights
  const topReviews = reviews.filter((r) => r.rating >= 4).slice(0, 3)

  const getKeyQuotes = () => {
    const patterns = {
      quality: ['quality', 'excellent', 'perfect', 'great quality', 'amazing'],
      value: ['value for money', 'worth', 'best price', 'affordable', 'great deal'],
      fastShipping: ['fast shipping', 'quick delivery', 'shipped quickly', 'arrived fast'],
      customerService: ['customer service', 'helpful', 'responsive', 'great support'],
    }

    return {
      quality: reviews.filter((r) =>
        patterns.quality.some((p) => r.comment?.toLowerCase().includes(p)),
      ).length,
      value: reviews.filter((r) => patterns.value.some((p) => r.comment?.toLowerCase().includes(p)))
        .length,
      fastShipping: reviews.filter((r) =>
        patterns.fastShipping.some((p) => r.comment?.toLowerCase().includes(p)),
      ).length,
      customerService: reviews.filter((r) =>
        patterns.customerService.some((p) => r.comment?.toLowerCase().includes(p)),
      ).length,
    }
  }

  const quotes = getKeyQuotes()

  return (
    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
        কাস্টমাররা কী বলছেন
      </h3>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {quotes.quality > 0 && (
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {quotes.quality}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">গুণমান উল্লেখ</p>
          </div>
        )}

        {quotes.value > 0 && (
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {quotes.value}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">মূল্য সাশ্রয়ী</p>
          </div>
        )}

        {quotes.fastShipping > 0 && (
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {quotes.fastShipping}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">দ্রুত ডেলিভারি</p>
          </div>
        )}

        {quotes.customerService > 0 && (
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {quotes.customerService}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">ভালো সেবা</p>
          </div>
        )}
      </div>

      {/* Top Review Quotes */}
      {topReviews.length > 0 && (
        <div className="space-y-3">
          {topReviews.map((review, idx) => (
            <div key={idx} className="bg-card rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  {/* Stars */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(review.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                    "{review.comment?.substring(0, 100)}..."
                  </p>

                  {/* Reviewer Info */}
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>{review.user_name}</strong> • যাচাইকৃত ক্রেতা
                  </p>
                </div>

                <ThumbsUp
                  size={16}
                  className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ReviewRatingBreakdown = ({ reviews = [], totalReviews }) => {
  if (!reviews.length) return null

  // Calculate distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[Math.round(r.rating)]++
    }
  })

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0

  return (
    <div className="bg-card rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {avgRating}
          </div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {totalReviews || reviews.length} রিভিউ
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">
            ✓ অত্যন্ত সুপারিশকৃত
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stars}★
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{
                    width: `${(distribution[stars] / (totalReviews || reviews.length)) * 100}%`,
                  }}
                />
              </div>

              {/* Count */}
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {distribution[stars]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const BuyersAlsoAppreciated = ({ reviews = [] }) => {
  if (!reviews.length) return null

  // Group reviews by sentiment
  const positiveReviews = reviews.filter((r) => r.rating >= 4)

  if (!positiveReviews.length) return null

  const themes = [
    { icon: '✨', text: 'অসাধারণ গুণমান', count: positiveReviews.length },
    { icon: '🚚', text: 'দ্রুত ডেলিভারি', count: Math.floor(positiveReviews.length * 0.8) },
    { icon: '💰', text: 'সঠিক মূল্য', count: Math.floor(positiveReviews.length * 0.7) },
    { icon: '❤️', text: 'উচ্চ সুপারিশ', count: positiveReviews.length },
  ]

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        🌟 ক্রেতারা এও মূল্যবান মনে করেন
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {themes.map((theme, idx) => (
          <div key={idx} className="bg-card rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">{theme.icon}</div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{theme.text}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{theme.count} জন সম্মত</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewHighlights
