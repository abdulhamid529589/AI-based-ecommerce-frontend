import React, { useEffect, useRef, useState } from 'react'
import { imageOptimizationService } from '../../services/imageOptimizationService'

/**
 * Optimized Image Component with Lazy Loading
 * - Supports WebP with fallback
 * - Lazy loading with intersection observer
 * - Responsive images with srcset
 * - Blur-up effect placeholder
 */
const OptimizedImage = ({
  src,
  alt = 'Image',
  width = 400,
  height = 400,
  className = '',
  onLoad = () => {},
  onError = () => {},
  priority = false, // true to preload
}) => {
  const imgRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(priority)
  const [error, setError] = useState(false)
  const [webpSupport, setWebpSupport] = useState(false)

  // Check WebP support
  useEffect(() => {
    imageOptimizationService.supportsWebP().then(setWebpSupport)
  }, [])

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
      },
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad()
  }

  const handleError = () => {
    setError(true)
    onError()
  }

  const format = webpSupport ? 'webp' : 'jpeg'
  const srcSet = isLoaded ? imageOptimizationService.getResponsiveImageSrcset(src, format) : ''
  const sizes = imageOptimizationService.getImageSizes()
  const optimizedSrc = isLoaded
    ? imageOptimizationService.getOptimizedImageUrl(src, width, height, format, 80)
    : ''
  const placeholder = imageOptimizationService.generateBlurPlaceholder(src)

  if (error) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* Placeholder - shows while loading */}
      {!isLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Main image - loads when intersecting or priority */}
      {isLoaded && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}

export default OptimizedImage
