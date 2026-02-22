import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios'

const API_BASE_URL = ''

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  const defaultSlides = [
    {
      id: 1,
      title: 'Premium Electronics',
      subtitle: 'Discover the latest tech innovations',
      description: 'Up to 50% off on premium headphones, smartwatches, and more',
      image: './electronics.jpg',
      cta: 'Shop Electronics',
      url: '/products?category=Electronics',
    },
    {
      id: 2,
      title: 'Fashion Forward',
      subtitle: 'Style meets comfort',
      description: 'New arrivals in designer clothing and accessories',
      image: './fashion.jpg',
      cta: 'Explore Fashion',
      url: '/products?category=Fashion',
    },
    {
      id: 3,
      title: 'Home & Garden',
      subtitle: 'Transform your space',
      description: 'Beautiful furniture and decor for every home',
      image: './furniture.jpg',
      cta: 'Shop Home',
      url: `/products?category=Home & Garden`,
    },
  ]

  useEffect(() => {
    fetchHeroSlides()
  }, [])

  const fetchHeroSlides = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/product/settings/hero-slides`)
      if (response.data.slides && response.data.slides.length > 0) {
        setSlides(response.data.slides)
      } else {
        setSlides(defaultSlides)
      }
    } catch (error) {
      console.warn('Failed to fetch hero slides, using defaults:', error)
      setSlides(defaultSlides)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [slides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  // Show loading or empty state if no slides loaded yet
  if (!slide || loading) {
    return (
      <div className="relative h-48 xs:h-56 sm:h-56 md:h-72 lg:h-64 overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-48 xs:h-56 sm:h-56 md:h-72 lg:h-64 overflow-hidden rounded-lg shadow-lg">
      {/* Single Active Slide */}
      <div className="relative h-full">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${slide?.image})` }}
        />
        {/* Enhanced Multi-layer Gradient Overlay - Better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        <div className="absolute inset-0 glass" />

        {/* Content Container - Optimized mobile layout */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-3 xs:py-4 sm:py-6 md:py-8 lg:py-12">
          <div className="max-w-md xs:max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl animate-fade-in-up w-full space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4">
            {/* Subtitle Badge - Mobile first sizing */}
            <div className="inline-block">
              <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 bg-blue-600/30 border border-blue-300/60 rounded-full text-[10px] xs:text-xs sm:text-sm md:text-base font-bold text-blue-200 backdrop-blur-md">
                {slide?.subtitle || ''}
              </span>
            </div>

            {/* Title - Optimized for mobile readability */}
            <h1 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-5xl font-black text-white leading-tight drop-shadow-xl tracking-tight">
              {slide?.title || 'Welcome'}
            </h1>

            {/* Description - Progressive scaling */}
            <p className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-gray-50 max-w-xl mx-auto line-clamp-1 xs:line-clamp-2 md:line-clamp-3 drop-shadow-lg font-medium">
              {slide?.description || ''}
            </p>

            {/* CTA Button - Mobile accessible (44px minimum height) */}
            <div className="pt-2 xs:pt-3 sm:pt-4">
              <Link
                to={slide?.url || '/products'}
                className="inline-flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3 md:py-4 gradient-primary text-white rounded-lg hover:glow-on-hover active:scale-95 transition-all duration-200 font-bold text-[12px] xs:text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl whitespace-nowrap touch-none min-h-[44px] sm:min-h-auto flex"
              >
                {slide?.cta || 'Shop Now'}
                <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Indicator - Non-intrusive */}
      <div className="absolute top-3 right-3 sm:hidden bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-semibold flex items-center gap-1.5">
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse animation-delay-100" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse animation-delay-200" />
        </div>
        <span className="hidden xs:inline">Swipe</span>
      </div>

      {/* Navigation Arrows - Hide on XS screens, show on SM+ */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-2 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 p-2 md:p-3 lg:p-4 glass-card hover:glow-on-hover hover:bg-white/20 active:scale-90 transition-all duration-150 z-10 items-center justify-center rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-2 md:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 p-2 md:p-3 lg:p-4 glass-card hover:glow-on-hover hover:bg-white/20 active:scale-90 transition-all duration-150 z-10 items-center justify-center rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
      </button>

      {/* Dots Navigation - Mobile optimized with touch targets */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-0.75 sm:gap-1.5 md:gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-300 transform hover:scale-110 active:scale-90 ${
              index === currentSlide
                ? 'w-1.5 h-1.5 sm:w-3 sm:h-3 bg-white shadow-md glow-primary'
                : 'w-1 h-1 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>

      {/* Slide Counter - Clean and minimal on mobile */}
      <div className="absolute top-3 left-3 sm:left-4 md:left-6 text-white text-[10px] xs:text-xs sm:text-sm font-bold bg-black/50 backdrop-blur-sm px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-full">
        {currentSlide + 1}/{slides.length}
      </div>
    </div>
  )
}

export default HeroSlider
