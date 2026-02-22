import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useScrollAnimation } from '../../hooks/useAnimations'

/**
 * Page Transition Wrapper
 * Wraps page content to provide smooth enter/exit animations
 */
export const PageTransition = ({ children }) => {
  const [displayLocation, setDisplayLocation] = React.useState(children.key)
  const [transitionStage, setTransitionStage] = React.useState('enter')
  const location = useLocation()

  useEffect(() => {
    if (displayLocation !== children.key) {
      setTransitionStage('exit')
    }
  }, [children.key, displayLocation])

  useEffect(() => {
    if (transitionStage === 'exit') {
      const timer = setTimeout(() => {
        setDisplayLocation(children.key)
        setTransitionStage('enter')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [transitionStage, children.key])

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === 'exit'
          ? 'opacity-0 transform translate-y-2'
          : 'opacity-100 transform translate-y-0'
      }`}
    >
      {children}
    </div>
  )
}

/**
 * Fade In On Load Component
 * Automatically fades in content when component mounts
 */
export const FadeInOnLoad = ({ children, delay = 0, duration = 0.5, className = '', ...props }) => {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Stagger Container
 * Automatically staggers children with delay
 */
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }) => {
  return (
    <div
      className={`animate-stagger ${className}`}
      style={{ '--stagger-delay': `${staggerDelay}s` }}
    >
      {children}
    </div>
  )
}

/**
 * Hover Lift Component
 * Lifts element on hover with smooth animation
 */
export const HoverLift = ({ children, scale = 1.05, lift = 4, className = '' }) => {
  return (
    <div
      className={`hover-lift ${className}`}
      style={{
        '--hover-lift': `${lift}px`,
        '--hover-scale': scale,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Shimmer Loading Component
 * Shows shimmer effect while loading
 */
export const ShimmerLoader = ({ width = 'w-full', height = 'h-4', count = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer`}
        />
      ))}
    </div>
  )
}

/**
 * Lazy Image Component
 * Loads image with blur-in effect
 */
export const LazyImage = ({ src, alt, placeholder = 'blur', className = '', onLoad, ...props }) => {
  const [isLoaded, setIsLoaded] = React.useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'blur-in' : 'blur-md'
        }`}
        onLoad={handleLoad}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
      )}
    </div>
  )
}

/**
 * Scroll to View Animation
 * Animates element when scrolled into view
 */
export const ScrollToViewAnimation = ({
  children,
  animation = 'slide-up',
  threshold = 0.1,
  className = '',
}) => {
  const [ref, isInView] = useScrollAnimation(threshold)

  const animationClasses = {
    'slide-up': 'animate-slide-up',
    'fade-in': 'animate-fade-in',
    'scale-in': 'animate-scale-in',
    'fade-scale-in': 'animate-fade-scale-in',
  }

  return (
    <div
      ref={ref}
      className={`${isInView ? animationClasses[animation] : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Bottom Sheet Component
 * Mobile-optimized bottom sheet for actions/modals
 */
export const BottomSheet = ({ isOpen, onClose, children, title, className = '' }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-elegant animate-slide-up ${className}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto safe-bottom">{children}</div>
      </div>
    </>
  )
}

/**
 * Modal Backdrop Component
 * Reusable modal with glass morphism
 */
export const GlassModal = ({ isOpen, onClose, children, title, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-elegant border border-white/20 dark:border-gray-700/50 animate-scale-in ${sizeClasses[size]} ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/**
 * Floating Action Button
 * FAB with animations
 */
export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  label,
  primary = true,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-elegant flex items-center justify-center transition-all duration-300 hover-lift hover:shadow-hover btn-pulse group ${
        primary ? 'bg-gradient-primary text-white' : 'bg-gradient-secondary text-white'
      } ${className}`}
      title={label}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
    </button>
  )
}

/**
 * Toast Notification
 * Custom toast with animations
 */
export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-elegant animate-slide-up ${typeStyles[type]}`}
    >
      <p className="text-sm font-semibold">{message}</p>
    </div>
  )
}

export default {
  PageTransition,
  FadeInOnLoad,
  StaggerContainer,
  HoverLift,
  ShimmerLoader,
  LazyImage,
  ScrollToViewAnimation,
  BottomSheet,
  GlassModal,
  FloatingActionButton,
  Toast,
}
