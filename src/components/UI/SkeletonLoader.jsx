import React from 'react'
import { motion } from 'framer-motion'

/**
 * SkeletonLoader Component
 * Displays animated skeleton placeholders while content is loading
 * Supports multiple skeleton types
 */
const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const cardSkeleton = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      {/* Image Skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 animate-shimmer mb-4" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-3/4" />

        {/* Text lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer" />
          <div className="h-4 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-5/6" />
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer mt-4" />
      </div>
    </motion.div>
  )

  const lineSkeleton = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-3 ${className}`}
    >
      <div className="h-4 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-full" />
      <div className="h-4 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-5/6" />
      <div className="h-4 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-4/6" />
    </motion.div>
  )

  const tableSkeleton = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-3 ${className}`}
    >
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer flex-1" />
          <div className="h-10 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer flex-1" />
          <div className="h-10 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer flex-1" />
        </div>
      ))}
    </motion.div>
  )

  const avatarSkeleton = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-full animate-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-1/2" />
        <div className="h-3 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-200 dark:via-gray-500 to-gray-300 dark:to-gray-600 rounded-lg animate-shimmer w-1/3" />
      </div>
    </motion.div>
  )

  const skeletons = {
    card: cardSkeleton,
    line: lineSkeleton,
    table: tableSkeleton,
    avatar: avatarSkeleton,
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {skeletons[type]}
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader
