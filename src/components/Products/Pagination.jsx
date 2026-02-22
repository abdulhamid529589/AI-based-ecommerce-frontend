import React, { useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
}) => {
  // Add SEO meta tags for pagination
  useEffect(() => {
    // Update canonical link for current page
    let canonicalUrl = window.location.origin + window.location.pathname
    if (currentPage > 1) {
      canonicalUrl += `?page=${currentPage}`
      if (window.location.search) {
        const params = new URLSearchParams(window.location.search)
        params.set('page', currentPage)
        canonicalUrl = window.location.origin + window.location.pathname + '?' + params.toString()
      }
    }

    // Remove or update canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    // Add rel="prev" link if not on first page
    let prevLink = document.querySelector('link[rel="prev"]')
    if (currentPage > 1) {
      if (!prevLink) {
        prevLink = document.createElement('link')
        prevLink.rel = 'prev'
        document.head.appendChild(prevLink)
      }
      const params = new URLSearchParams(window.location.search)
      params.set('page', currentPage - 1)
      prevLink.href = window.location.origin + window.location.pathname + '?' + params.toString()
    } else if (prevLink) {
      prevLink.remove()
    }

    // Add rel="next" link if not on last page
    let nextLink = document.querySelector('link[rel="next"]')
    if (currentPage < totalPages) {
      if (!nextLink) {
        nextLink = document.createElement('link')
        nextLink.rel = 'next'
        document.head.appendChild(nextLink)
      }
      const params = new URLSearchParams(window.location.search)
      params.set('page', currentPage + 1)
      nextLink.href = window.location.origin + window.location.pathname + '?' + params.toString()
    } else if (nextLink) {
      nextLink.remove()
    }
  }, [currentPage, totalPages])
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5 // 3 pages on mobile, 5 on desktop

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 1) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        const start = currentPage - Math.floor(maxPagesToShow / 2)
        for (let i = start; i < start + maxPagesToShow; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  const pages = getPageNumbers()

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems || totalPages * itemsPerPage)

  return (
    <nav className="py-8" aria-label="Pagination navigation">
      {/* Pagination Info - Accessible text */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex}</span>{' '}
          to <span className="font-semibold text-gray-900 dark:text-white">{endIndex}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalItems || totalPages * itemsPerPage}
          </span>{' '}
          products
        </p>
      </div>

      {/* Desktop Pagination */}
      <div
        className="hidden sm:flex items-center justify-center gap-2"
        role="group"
        aria-label="Page navigation"
      >
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition text-blue-600 dark:text-blue-200 font-medium"
          aria-label="Go to previous page"
          aria-disabled={currentPage === 1}
          rel="prev"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400 dark:text-gray-500">
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
              className={`h-10 w-10 rounded-lg font-semibold text-sm transition ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition text-blue-600 dark:text-blue-200 font-medium"
          aria-label="Go to next page"
          aria-disabled={currentPage === totalPages}
          rel="next"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Pagination */}
      <div
        className="sm:hidden flex flex-col items-center gap-4"
        role="group"
        aria-label="Mobile pagination controls"
      >
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 disabled:opacity-40 transition"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 disabled:opacity-40 transition"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-card text-foreground"
          aria-label="Jump to page"
        >
          {[...Array(totalPages)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Page {i + 1} of {totalPages}
            </option>
          ))}
        </select>
      </div>

      {/* Page Info */}
      <div
        className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Page{' '}
        <span className="font-semibold text-gray-900 dark:text-white" aria-current="page">
          {currentPage}
        </span>{' '}
        of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
      </div>
    </nav>
  )
}

export default Pagination
