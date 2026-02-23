/**
 * 🚀 FULLY RESPONSIVE HERO SLIDER
 * Mobile-first design that scales beautifully to desktop
 * Features: Smooth animations, swipe gestures, auto-play, keyboard navigation
 * Optimized for 320px phones to 4K displays
 */

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios'
import { useSwipeNavigation } from '../Mobile/GestureController'
import './ResponsiveHeroSlider.css'

const API_BASE_URL = ''

const ResponsiveHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [hoveredDot, setHoveredDot] = useState(null)
  const autoPlayTimer = useRef(null)
  const sliderRef = useSwipeNavigation(handleSwipe)

  const defaultSlides = [
    {
      id: 1,
      title: 'Premium Bedding Sets',
      subtitle: 'Luxury comfort awaits',
      description: 'Up to 50% off on premium collections',
      image: './electronics.jpg',
      cta: 'Shop Now',
      url: '/products?category=Bedding',
      color: 'from-blue-600 to-blue-900',
    },
    {
      id: 2,
      title: 'Organic Cotton Sheets',
      subtitle: 'Sleep like never before',
      description: 'Premium quality at unbeatable prices',
      image: './fashion.jpg',
      cta: 'Explore',
      url: '/products?category=Sheets',
      color: 'from-green-600 to-green-900',
    },
    {
      id: 3,
      title: 'Designer Pillows',
      subtitle: 'Comfort redefined',
      description: 'Ergonomic designs for perfect support',
      image: './furniture.jpg',
      cta: 'Discover',
      url: '/products?category=Pillows',
      color: 'from-purple-600 to-purple-900',
    },
  ]

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch hero slides from API
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

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlay || slides.length === 0) return

    autoPlayTimer.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(autoPlayTimer.current)
  }, [isAutoPlay, slides.length])

  function handleSwipe(direction) {
    if (direction === 'left') {
      nextSlide()
    } else if (direction === 'right') {
      prevSlide()
    }
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 6000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    resetAutoPlay()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    resetAutoPlay()
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    resetAutoPlay()
  }

  const resetAutoPlay = () => {
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 6000)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const slide = slides[currentSlide]

  if (!slide || loading) {
    return (
      <div className="responsive-hero-skeleton">
        <div className="skeleton-placeholder">
          <div className="skeleton-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="responsive-hero-container">
      {/* Main Slider */}
      <div
        ref={sliderRef}
        className="responsive-hero-slider"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
        role="region"
        aria-label="Featured products carousel"
      >
        {/* Background Slides */}
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${s.image})`,
            }}
          >
            {/* Multi-layer overlay for text readability */}
            <div className="hero-overlay" />

            {/* Responsive Content */}
            <div className="hero-content-wrapper">
              <div className="hero-content">
                {/* Slide tag/badge */}
                <div className="hero-tag animate-fadeIn">⭐ Limited Time Offer</div>

                {/* Title - Responsive sizing */}
                <h2 className="hero-title animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                  {s.title}
                </h2>

                {/* Subtitle */}
                <p className="hero-subtitle animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                  {s.subtitle}
                </p>

                {/* Description - Hide on very small screens */}
                <p
                  className="hero-description animate-slideInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  {s.description}
                </p>

                {/* CTA Button */}
                <div
                  className="hero-cta-wrapper animate-slideInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <Link to={s.url || '/products'} className="hero-cta-button">
                    {s.cta || 'Shop Now'}
                    <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative shapes - Desktop only */}
            <div className="hero-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="hero-nav-btn hero-nav-prev"
          aria-label="Previous slide"
          title="Previous (or use arrow key)"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="hero-nav-btn hero-nav-next"
          aria-label="Next slide"
          title="Next (or use arrow key)"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="hero-dots-container">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''} ${
                hoveredDot === index ? 'hovered' : ''
              }`}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setHoveredDot(index)}
              onMouseLeave={() => setHoveredDot(null)}
              aria-label={`Go to slide ${index + 1}`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Toggle - Mobile */}
        {isMobile && (
          <button
            className="hero-autoplay-toggle"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            aria-label={isAutoPlay ? 'Pause auto-play' : 'Resume auto-play'}
            title={isAutoPlay ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}

        {/* Slide Counter */}
        <div className="hero-counter">
          {currentSlide + 1} / {slides.length}
        </div>

        {/* Progress Indicator */}
        <div className="hero-progress">
          <div
            className="hero-progress-bar"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ResponsiveHeroSlider
