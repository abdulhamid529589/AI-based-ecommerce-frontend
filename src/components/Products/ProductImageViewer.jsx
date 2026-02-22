import React, { useState, useRef } from 'react'
import './ProductImageViewer.css'

/**
 * Advanced Product Image Viewer Component
 * Features: Zoom, pan, thumbnails, fullscreen
 */
const ProductImageViewer = ({ images = [], productName = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mainImageRef = useRef(null)

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (!isZoomed) return

    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  // Navigate to previous image
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // Navigate to next image
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Toggle fullscreen
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const currentImage = images[currentIndex]

  if (!currentImage || !currentImage.url) {
    return (
      <div className="product-image-viewer empty">
        <div className="placeholder">
          <span>No image available</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`product-image-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Main Image */}
      <div
        className="main-image-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        ref={mainImageRef}
      >
        <img
          src={currentImage.url}
          alt={productName}
          className={`main-image ${isZoomed ? 'zoomed' : ''}`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="nav-button prev"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              ❮
            </button>
            <button className="nav-button next" onClick={handleNext} aria-label="Next image">
              ❯
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Fullscreen Button */}
        <button className="fullscreen-button" onClick={handleFullscreen} aria-label="Fullscreen">
          ⛶
        </button>

        {/* Zoom Indicator */}
        {isZoomed && <div className="zoom-indicator">🔍 Zoom enabled</div>}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image.url} alt={`${productName} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Info */}
      <div className="zoom-info">{isZoomed ? '🔍 Hover to zoom' : '🔍 Hover on image to zoom'}</div>
    </div>
  )
}

export default ProductImageViewer
