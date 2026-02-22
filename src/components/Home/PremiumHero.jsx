import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../contexts/SettingsContext'
import './PremiumHero.css'

/**
 * PROFESSIONAL E-COMMERCE HERO SLIDER - FULLY RESPONSIVE
 * Mobile-first design with touch support, dynamic content, and insane UX
 * Optimized for all devices: 320px (mobile) to 4K displays
 */

export const PremiumHero = ({ onExplore }) => {
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [showArrows, setShowArrows] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const sliderRef = useRef(null)
  const { heroSlides, loading } = useSettings()

  // Use dashboard slides if available, otherwise use defaults
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : getDefaultSlides()

  // Auto-play functionality with pause control
  useEffect(() => {
    if (isAutoPlayPaused || slides.length <= 1) return

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length, isAutoPlayPaused])

  // Touch handling for swipe gestures
  const handleTouchStart = (e) => {
    if (!e.targetTouches) return
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (!e.changedTouches) return
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
      setSwipeDirection('left')
    } else if (isRightSwipe) {
      prevSlide()
      setSwipeDirection('right')
    }

    // Clear swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 400)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }

  const goToSlide = (index) => {
    setActiveSlide(index)
  }

  const currentSlide = slides[activeSlide]

  return (
    <div
      ref={sliderRef}
      className="premium-hero relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[280px] sm:min-h-[380px] md:min-h-[450px] lg:min-h-[550px] xl:min-h-[600px]"
      onMouseEnter={() => {
        setShowArrows(true)
        setIsAutoPlayPaused(true)
      }}
      onMouseLeave={() => {
        setShowArrows(false)
        setIsAutoPlayPaused(false)
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured products slider"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-purple-600/30 z-10" />

        {/* Animated Blobs */}
        <div className="absolute -inset-40 opacity-30 overflow-hidden">
          <div className="animate-blob absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        {/* Slides Container */}
        <div className="absolute inset-0 z-5">
          {slides.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              role="img"
              aria-label={`Slide ${index + 1}: ${slide.title}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative w-full h-full z-10 flex flex-col lg:flex-row items-center justify-between min-h-[280px] sm:min-h-[380px] md:min-h-[450px] lg:min-h-[550px] xl:min-h-[600px]">
        {/* Left Content */}
        <div className="premium-hero-content w-full lg:w-1/2 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-4 xs:py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col justify-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 xs:gap-2 w-fit mb-2 xs:mb-3 sm:mb-4 md:mb-6">
            <span className="inline-block w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-emerald-300 whitespace-nowrap truncate max-w-[200px]">
              {currentSlide.badge || 'New Arrival'}
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title text-lg xs:text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-2 xs:mb-3 sm:mb-4 md:mb-6 break-words">
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-xs xs:text-xs sm:text-base md:text-lg lg:text-xl text-white/80 mb-4 xs:mb-6 sm:mb-8 md:mb-10 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {currentSlide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 md:gap-6 mb-6 xs:mb-8 sm:mb-10 md:mb-12 w-full xs:w-auto">
            <button
              onClick={() => navigate(currentSlide.link || '/products')}
              className="group relative px-3 xs:px-5 sm:px-8 md:px-10 lg:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-white text-xs xs:text-sm sm:text-base md:text-lg
                bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                shadow-lg shadow-blue-500/50 hover:shadow-blue-600/70
                transition-all duration-300 overflow-hidden
                flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-auto hover:scale-105 active:scale-95 flex-shrink-0 touch-manipulation"
              aria-label={currentSlide.ctaText || 'Shop Now'}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative whitespace-nowrap">
                {currentSlide.ctaText || 'Shop Now'}
              </span>
              <ChevronRight
                size={16}
                className="relative group-hover:translate-x-1 transition-transform xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0"
                aria-hidden="true"
              />
            </button>

            <button
              onClick={() => setShowVideo(true)}
              className="hidden xs:flex group px-3 xs:px-5 sm:px-8 md:px-10 lg:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-white text-xs xs:text-sm sm:text-base md:text-lg
                bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 hover:border-white/50
                transition-all duration-300 items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-auto hover:scale-105 active:scale-95 flex-shrink-0 touch-manipulation"
              aria-label="Watch demo video"
            >
              <Play
                size={16}
                className="group-hover:scale-110 transition-transform xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="hidden sm:inline whitespace-nowrap">Watch Demo</span>
            </button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-6 md:gap-8 text-white/80 text-[9px] xs:text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-1.5 xs:gap-2 whitespace-nowrap">
              <div className="flex-shrink-0 w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-green-400 text-[8px] xs:text-xs">
                ✓
              </div>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2 whitespace-nowrap">
              <div className="flex-shrink-0 w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-green-400 text-[8px] xs:text-xs">
                ✓
              </div>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Right Content - Desktop Only */}
        <div className="relative hidden lg:flex w-1/2 h-full items-center justify-center px-6 py-12 lg:py-16 z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
          <div className="relative w-full max-w-sm h-80 lg:h-96 bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 flex items-end justify-center p-6 lg:p-8 overflow-hidden hover:border-white/40 transition-all duration-300 group">
            <div className="absolute top-6 lg:top-8 right-6 lg:right-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-5 text-white shadow-2xl shadow-orange-500/40 transform group-hover:scale-110 transition-transform z-20">
              <p className="text-xs lg:text-sm font-medium opacity-90">Limited Time</p>
              <p className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2">
                {currentSlide.discount || '30%'}
              </p>
              <p className="text-[9px] lg:text-xs mt-1 lg:mt-2 opacity-80">Ends in 2 days</p>
            </div>
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-white/20 to-white/5 rounded-xl lg:rounded-2xl flex items-center justify-center text-white/40 text-xs lg:text-lg font-semibold">
              Product Image
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div
          className="flex gap-1.5 xs:gap-2 sm:gap-3 justify-center"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full touch-none min-h-[8px] min-w-[8px] hover:scale-125 ${
                index === activeSlide
                  ? 'w-7 xs:w-8 sm:w-10 h-1.5 xs:h-2 sm:h-2.5 bg-white shadow-lg'
                  : 'w-1.5 xs:w-2 sm:w-2.5 h-1.5 xs:h-2 sm:h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === activeSlide}
              role="tab"
            />
          ))}
        </div>
      </div>

      {/* Desktop Arrows - Hidden on Mobile, Shown on Hover */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 pointer-events-none group">
          <button
            onClick={prevSlide}
            className={`pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 min-h-[44px] min-w-[44px] sm:min-h-[52px] sm:min-w-[52px] md:min-h-[60px] md:min-w-[60px] flex items-center justify-center shadow-lg hover:shadow-xl ${
              showArrows ? 'opacity-100 visible' : 'opacity-0 invisible'
            } hidden sm:flex hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 touch-manipulation group-hover:opacity-100`}
            aria-label="Previous slide"
          >
            <ChevronLeft
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0"
              aria-hidden="true"
              strokeWidth={2.5}
            />
          </button>

          <button
            onClick={nextSlide}
            className={`pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 min-h-[44px] min-w-[44px] sm:min-h-[52px] sm:min-w-[52px] md:min-h-[60px] md:min-w-[60px] flex items-center justify-center shadow-lg hover:shadow-xl ${
              showArrows ? 'opacity-100 visible' : 'opacity-0 invisible'
            } hidden sm:flex hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 touch-manipulation group-hover:opacity-100`}
            aria-label="Next slide"
          >
            <ChevronRight
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0"
              aria-hidden="true"
              strokeWidth={2.5}
            />
          </button>
        </div>
      )}

      {/* Mobile Swipe Indicators - Bottom with Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 sm:hidden z-20">
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Counter and Swipe Indicator */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 backdrop-blur-md bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold">{activeSlide + 1}</span>
              <div className="w-0.5 h-4 bg-white/40" />
              <span className="text-white/70 text-sm">{slides.length}</span>
            </div>

            {/* Swipe Indicator Arrows */}
            <div className="flex items-center gap-2 text-white/60 text-xs font-semibold">
              {swipeDirection === 'right' && <span className="animate-pulse">← Swiped</span>}
              {swipeDirection === 'left' && <span className="animate-pulse">Swiped →</span>}
              {!swipeDirection && (
                <span className="flex items-center gap-1 opacity-50">
                  <span>←</span>
                  <span className="hidden xs:inline">Swipe</span>
                  <span>→</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-3 xs:p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full h-full max-w-2xl sm:max-w-4xl max-h-[80vh] sm:max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 -right-2 xs:right-0 text-white hover:text-gray-300 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close video modal"
            >
              <X size={28} className="xs:w-7 xs:h-7" aria-hidden="true" />
            </button>
            <div className="aspect-video rounded-lg sm:rounded-2xl overflow-hidden bg-black flex-1">
              <div className="w-full h-full flex items-center justify-center text-white/40 text-sm xs:text-base sm:text-lg font-semibold">
                Video Player (Integration Ready)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getDefaultSlides() {
  return [
    {
      id: 1,
      title: 'Discover Premium Quality',
      subtitle: 'Exclusive collection of handpicked products just for you',
      image: '/images/hero-1.jpg',
      link: '/products',
      ctaText: 'Shop Now',
      badge: 'New Arrival',
      discount: '30%',
    },
    {
      id: 2,
      title: 'Limited Time Offer',
      subtitle: 'Up to 50% discount on selected items this week only',
      image: '/images/hero-2.jpg',
      link: '/products',
      ctaText: 'Explore Deal',
      badge: 'Hot Deal',
      discount: '50%',
    },
    {
      id: 3,
      title: 'Free Shipping',
      subtitle: 'On orders above ৳500 in Dhaka and surrounding areas',
      image: '/images/hero-3.jpg',
      link: '/products',
      ctaText: 'Shop Collection',
      badge: 'Free Shipping',
      discount: 'FREE',
    },
  ]
}

export default PremiumHero
