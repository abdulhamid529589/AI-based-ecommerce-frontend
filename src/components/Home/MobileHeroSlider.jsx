/**
 * 🚀 AMAZING HERO SLIDER - Works Beautifully on All Devices!
 * Mobile, Tablet, Desktop, 4K - fully responsive with gesture controls
 * Features: Gesture controls, swipe navigation, auto-play, smooth animations
 */

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios'
import { useSwipeNavigation } from '../Mobile/GestureController'
import './MobileHeroSlider.css'

const API_BASE_URL = ''

const MobileHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const autoPlayTimer = useRef(null)
  const sliderRef = useSwipeNavigation(handleSwipe)

  // Auto-play interval: 6 seconds on mobile, 8 seconds on desktop (more time to read)
  const AUTO_PLAY_INTERVAL = window.innerWidth < 1024 ? 6000 : 8000

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    }, AUTO_PLAY_INTERVAL) // Auto-advance every 6s (mobile) or 8s (desktop)

    return () => clearInterval(autoPlayTimer.current)
  }, [isAutoPlay, slides.length, AUTO_PLAY_INTERVAL])

  function handleSwipe(direction) {
    if (direction === 'left') {
      nextSlide()
    } else if (direction === 'right') {
      prevSlide()
    }
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 3000) // Resume auto-play after 3 seconds
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
    setTimeout(() => setIsAutoPlay(true), AUTO_PLAY_INTERVAL)
  }

  const slide = slides[currentSlide]

  if (!slide || loading) {
    return (
      <div className="mobile-hero-slider-skeleton">
        <div className="skeleton-placeholder">
          <div className="skeleton-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-hero-slider-container">
      {/* Main Slider */}
      <div
        ref={sliderRef}
        className="mobile-hero-slider"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Slides */}
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${s.image})`,
            }}
          >
            {/* Multi-layer gradient overlay for text readability */}
            <div className="hero-overlay" />

            {/* Mobile-optimized content */}
            <div className="hero-content">
              {/* Small tag */}
              <div className="hero-tag animate-fadeIn">⭐ Limited Time Offer</div>

              {/* Main title - larger on mobile */}
              <h2 className="hero-title animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                {s.title}
              </h2>

              {/* Subtitle */}
              <p className="hero-subtitle animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                {s.subtitle}
              </p>

              {/* Description - hidden on small mobile */}
              <p className="hero-description animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                {s.description}
              </p>

              {/* CTA Button */}
              <Link
                to={s.url}
                className="hero-cta-button animate-slideInUp"
                style={{ animationDelay: '0.4s' }}
              >
                <span>{s.cta}</span>
                <span className="arrow">→</span>
              </Link>
            </div>

            {/* Decorative shapes (mobile-optimized) */}
            <div className="hero-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="hero-controls">
        {/* Previous button */}
        <button
          className="hero-nav-btn hero-nav-prev"
          onClick={prevSlide}
          aria-label="Previous slide"
          title="Previous (or swipe right)"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dot indicators */}
        <div className="hero-dots-container">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          className="hero-nav-btn hero-nav-next"
          onClick={nextSlide}
          aria-label="Next slide"
          title="Next (or swipe left)"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Auto-play toggle (mobile) */}
      {isMobile && (
        <button
          className="hero-autoplay-toggle"
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          title={isAutoPlay ? 'Pause auto-play' : 'Resume auto-play'}
        >
          {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      {/* Slide counter (mobile) */}
      <div className="hero-counter">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Progress indicator */}
      <div className="hero-progress">
        <div
          className="hero-progress-bar"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

export default MobileHeroSlider
