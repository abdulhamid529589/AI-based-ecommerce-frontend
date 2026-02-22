import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className="group">
      <div className="bg-card rounded-lg shadow overflow-hidden h-full flex flex-col animate-pulse">
        {/* Image Skeleton */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-48 sm:h-52" />

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-3">
          {/* Category Skeleton */}
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Name Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Rating Skeleton */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>

          {/* Price and Stock Skeleton */}
          <div className="mt-auto pt-3 space-y-2">
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-2 mt-4">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
