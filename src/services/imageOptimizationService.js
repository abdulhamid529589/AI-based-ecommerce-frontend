/**
 * Image Optimization Service
 * Handles responsive image loading, WebP conversion, and lazy loading
 */

import axiosInstance from './axiosInstance'

/**
 * Get optimized image URL with specified dimensions and format
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @param {string} format - Output format (webp, jpeg, png)
 * @param {number} quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl,
  width = 400,
  height = 400,
  format = 'webp',
  quality = 80,
) => {
  if (!imageUrl) return '/placeholder.jpg'

  // If URL is already a CDN URL with transformation, return as-is
  if (imageUrl.includes('cloudinary') || imageUrl.includes('imgix')) {
    return imageUrl
  }

  // For local images, add transformation parameters
  const params = new URLSearchParams()
  params.append('w', width)
  params.append('h', height)
  params.append('format', format)
  params.append('q', quality)

  return `/api/v1/images/optimize?url=${encodeURIComponent(imageUrl)}&${params.toString()}`
}

/**
 * Get responsive image srcset for different screen sizes
 * @param {string} imageUrl - Original image URL
 * @param {string} format - Image format
 * @returns {string} srcset string for img tag
 */
export const getResponsiveImageSrcset = (imageUrl, format = 'webp') => {
  if (!imageUrl) return ''

  const sizes = [320, 640, 960, 1280, 1920]
  const srcset = sizes
    .map(
      (width) =>
        `${getOptimizedImageUrl(imageUrl, width, Math.round(width * 0.75), format, 80)} ${width}w`,
    )
    .join(', ')

  return srcset
}

/**
 * Get image sizes attribute for responsive loading
 * @returns {string} sizes attribute value
 */
export const getImageSizes = () => {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}

/**
 * Check if browser supports WebP format
 * @returns {Promise<boolean>}
 */
export const supportsWebP = async () => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => resolve(webP.height === 2)
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAAB9AQACQ2xvdWQK'
  })
}

/**
 * Preload images for better performance
 * @param {string[]} imageUrls - Array of image URLs
 */
export const preloadImages = (imageUrls = []) => {
  imageUrls.forEach((url) => {
    if (url && url.trim()) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      document.head.appendChild(link)
    }
  })
}

/**
 * Prefetch DNS for external domains
 * @param {string[]} domains - Array of domain URLs
 */
export const prefetchDNS = (domains = []) => {
  domains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
  })
}

/**
 * Preconnect to external domains
 * @param {string[]} domains - Array of domain URLs
 */
export const preconnect = (domains = []) => {
  domains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    document.head.appendChild(link)
  })
}

/**
 * Batch optimize multiple images
 * @param {Array<{url: string, width: number, height: number}>} images
 * @returns {Promise<Array>} Array of optimized images
 */
export const batchOptimizeImages = async (images = []) => {
  try {
    const response = await axiosInstance.post('/images/batch-optimize', {
      images,
    })
    return response.data.optimizedImages || []
  } catch (error) {
    console.error('Error batch optimizing images:', error)
    return images.map((img) => ({
      ...img,
      optimizedUrl: img.url,
    }))
  }
}

/**
 * Get image metadata (dimensions, format, size)
 * @param {string} imageUrl - Image URL
 * @returns {Promise<Object>} Image metadata
 */
export const getImageMetadata = async (imageUrl) => {
  try {
    const response = await axiosInstance.get('/images/metadata', {
      params: { url: imageUrl },
    })
    return response.data
  } catch (error) {
    console.error('Error getting image metadata:', error)
    return null
  }
}

/**
 * Calculate aspect ratio for images
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Aspect ratio
 */
export const calculateAspectRatio = (width, height) => {
  if (!width || !height) return 1
  return width / height
}

/**
 * Generate blur placeholder (LQIP - Low Quality Image Placeholder)
 * @param {string} imageUrl - Image URL
 * @returns {string} Data URL of blurred image
 */
export const generateBlurPlaceholder = (imageUrl) => {
  // This would typically be generated on the server and cached
  // For now, we return a simple gradient placeholder
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3C/svg%3E'
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default {
  getOptimizedImageUrl,
  getResponsiveImageSrcset,
  getImageSizes,
  supportsWebP,
  preloadImages,
  prefetchDNS,
  preconnect,
  batchOptimizeImages,
  getImageMetadata,
  calculateAspectRatio,
  generateBlurPlaceholder,
  formatFileSize,
}
