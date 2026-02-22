import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import '../../styles/ImageGallery.css'

const ImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const currentImage = images[selectedIndex]?.url || images[0]?.url || null

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setIsLightboxOpen(false)
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div className="image-gallery">
        {/* Main Image Viewer */}
        <div className="gallery-main-container">
          <div
            className={`gallery-main ${isZoomed ? 'gallery-zoomed' : ''}`}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
            style={
              isZoomed && currentImage
                ? {
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundImage: `url(${currentImage})`,
                  }
                : {}
            }
          >
            {!isZoomed && currentImage && (
              <img
                src={currentImage}
                alt={`Product view ${selectedIndex + 1}`}
                className="gallery-img"
              />
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="gallery-nav gallery-nav-prev"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="gallery-nav gallery-nav-next"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Zoom Button */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="gallery-zoom-btn"
              title={isZoomed ? 'Reset Zoom' : 'Zoom In'}
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="gallery-counter">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Zoom Instructions */}
          {images.length > 0 && (
            <p className="gallery-instructions">
              {isZoomed
                ? '🔍 Move mouse to explore • Press ESC to reset'
                : '🖱️ Click to zoom • Click image for fullscreen'}
            </p>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="gallery-thumbnails">
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="thumbnail-scroll-btn thumbnail-scroll-prev"
              aria-label="Scroll thumbnails left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="thumbnails-container">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`thumbnail ${selectedIndex === index ? 'active' : ''}`}
                  title={`View image ${index + 1}`}
                >
                  <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="thumbnail-scroll-btn thumbnail-scroll-next"
              aria-label="Scroll thumbnails right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="lightbox-close"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="lightbox-nav lightbox-nav-prev"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {currentImage && (
              <img src={currentImage} alt="Lightbox view" className="lightbox-img" />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="lightbox-nav lightbox-nav-next"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="lightbox-counter">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
