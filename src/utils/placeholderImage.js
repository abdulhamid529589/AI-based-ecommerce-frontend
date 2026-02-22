/**
 * Placeholder image utility
 * Uses a data URI SVG placeholder instead of external service
 * This avoids DNS resolution issues and is more reliable
 */

export const getPlaceholderImage = (width = 300, height = 300, text = 'No Image') => {
  const encodedText = encodeURIComponent(text.substring(0, 15))

  // SVG placeholder that doesn't require external service
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif">
        ${text}
      </text>
    </svg>
  `

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Image error handler - called when image fails to load
 * Sets placeholder as fallback
 */
export const handleImageError = (e, placeholder = 'No Image') => {
  if (e && e.target) {
    e.target.src = getPlaceholderImage(300, 300, placeholder)
    e.target.classList.add('placeholder-image')
  }
}

/**
 * Get image source with fallback
 * Tries: actual image → placeholder SVG
 */
export const getImageSrc = (imageUrl, fallbackText = 'No Image') => {
  return imageUrl && imageUrl.trim() ? imageUrl : getPlaceholderImage(300, 300, fallbackText)
}

export default {
  getPlaceholderImage,
  handleImageError,
  getImageSrc,
}
