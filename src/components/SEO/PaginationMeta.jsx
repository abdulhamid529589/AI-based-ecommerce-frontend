import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * PaginationMeta Component
 * Handles SEO best practices for paginated pages:
 * - Canonical tags to avoid duplicate content
 * - rel="prev" and rel="next" for pagination discovery
 * - Proper meta description for each page
 * - Structured data for search engine crawling
 *
 * This is a lightweight component that directly manipulates DOM
 * to add SEO meta tags without external dependencies
 */
const PaginationMeta = ({
  currentPage = 1,
  totalPages = 1,
  pageTitle = 'Products',
  pageDescription = 'Browse our collection of products',
  itemsPerPage = 10,
  totalItems = 0,
}) => {
  const location = useLocation()
  const baseUrl = window.location.origin + location.pathname

  useEffect(() => {
    // Generate canonical URL
    const getCanonicalUrl = () => {
      if (currentPage === 1) {
        return baseUrl
      }
      const params = new URLSearchParams(location.search)
      params.set('page', currentPage)
      return `${baseUrl}?${params.toString()}`
    }

    // Generate prev page URL
    const getPrevUrl = () => {
      if (currentPage <= 1) return null
      if (currentPage === 2) {
        const params = new URLSearchParams(location.search)
        params.delete('page')
        return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
      }
      const params = new URLSearchParams(location.search)
      params.set('page', currentPage - 1)
      return `${baseUrl}?${params.toString()}`
    }

    // Generate next page URL
    const getNextUrl = () => {
      if (currentPage >= totalPages) return null
      const params = new URLSearchParams(location.search)
      params.set('page', currentPage + 1)
      return `${baseUrl}?${params.toString()}`
    }

    const canonicalUrl = getCanonicalUrl()
    const prevUrl = getPrevUrl()
    const nextUrl = getNextUrl()

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    // Update prev link
    let prevLink = document.querySelector('link[rel="prev"]')
    if (prevUrl) {
      if (!prevLink) {
        prevLink = document.createElement('link')
        prevLink.rel = 'prev'
        document.head.appendChild(prevLink)
      }
      prevLink.href = prevUrl
    } else if (prevLink) {
      prevLink.remove()
    }

    // Update next link
    let nextLink = document.querySelector('link[rel="next"]')
    if (nextUrl) {
      if (!nextLink) {
        nextLink = document.createElement('link')
        nextLink.rel = 'next'
        document.head.appendChild(nextLink)
      }
      nextLink.href = nextUrl
    } else if (nextLink) {
      nextLink.remove()
    }

    // Update page title
    const startIndex = (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems || totalPages * itemsPerPage)
    const fullTitle = `${pageTitle}${currentPage > 1 ? ` - Page ${currentPage}` : ''} | BEDTEX`
    document.title = fullTitle

    // Update meta description
    const metaDescription = `${pageDescription} - Page ${currentPage} of ${totalPages}${
      totalItems > 0 ? ` (showing ${startIndex}-${endIndex} of ${totalItems} items)` : ''
    }`

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = metaDescription

    // Update Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = fullTitle

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.content = metaDescription

    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.content = canonicalUrl

    // Add structured data for search engines
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        name: `${pageTitle} - Page ${currentPage}`,
        numberOfItems: endIndex - startIndex + 1,
        itemListElement: [],
      },
    }

    // Remove old structured data
    const oldScript = document.querySelector(
      'script[type="application/ld+json"][data-pagination="true"]',
    )
    if (oldScript) {
      oldScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-pagination', 'true')
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
  }, [
    currentPage,
    totalPages,
    pageTitle,
    pageDescription,
    itemsPerPage,
    totalItems,
    location,
    baseUrl,
  ])

  // This component doesn't render anything - it only manages meta tags
  return null
}

export default PaginationMeta
