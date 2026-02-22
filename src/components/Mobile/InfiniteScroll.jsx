import React, { useEffect, useRef, useState } from 'react'
import { Loader } from 'lucide-react'

const InfiniteScroll = ({ children, onLoadMore, hasMore, isLoading, threshold = 100 }) => {
  const observerTarget = useRef(null)
  const [hasObserver] = useState(() => 'IntersectionObserver' in window)

  useEffect(() => {
    if (!hasObserver || !hasMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          onLoadMore()
        }
      },
      { rootMargin: `${threshold}px` },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold, hasObserver])

  return (
    <>
      {children}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="infinite-scroll-target" />

      {/* Loading indicator */}
      {isLoading && hasMore && (
        <div className="infinite-scroll-loader">
          <Loader size={24} className="animate-spin" />
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading more...</p>
        </div>
      )}

      {/* End of list */}
      {!hasMore && (
        <div className="infinite-scroll-end">
          <p className="text-gray-500 dark:text-gray-400">You've reached the end!</p>
        </div>
      )}
    </>
  )
}

export default InfiniteScroll
