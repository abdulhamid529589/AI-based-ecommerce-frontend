/**
 * Responsive Design Utilities & Helpers
 * Mobile-first approach for E-Commerce Frontend
 */

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '320px', // Extra small devices
  sm: '640px', // Small devices (phones)
  md: '768px', // Medium devices (tablets)
  lg: '1024px', // Large devices (desktops)
  xl: '1280px', // Extra large (wide screens)
  '2xl': '1536px', // 2X large (ultra-wide screens)
}

export const breakpointNumbers = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// ============================================
// RESPONSIVE HOOKS
// ============================================

import { useState, useEffect } from 'react'

/**
 * Hook to determine current screen size
 * @returns {string} Current breakpoint ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('md')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth

      if (width < 640) setBreakpoint('xs')
      else if (width < 768) setBreakpoint('sm')
      else if (width < 1024) setBreakpoint('md')
      else if (width < 1280) setBreakpoint('lg')
      else if (width < 1536) setBreakpoint('xl')
      else setBreakpoint('2xl')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

/**
 * Hook to check if screen size is mobile
 * @returns {boolean}
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

/**
 * Hook to check if screen size is tablet
 * @returns {boolean}
 */
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= 768 && width < 1024)
    }

    checkTablet()
    window.addEventListener('resize', checkTablet)
    return () => window.removeEventListener('resize', checkTablet)
  }, [])

  return isTablet
}

/**
 * Hook to check if screen size is desktop
 * @returns {boolean}
 */
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return isDesktop
}

// ============================================
// RESPONSIVE GRID HELPERS
// ============================================

/**
 * Get responsive grid columns
 * @param {number} defaultCols - Default columns for mobile
 * @returns {object} Tailwind grid class mapping
 */
export const getResponsiveGridCols = (defaultCols = 2) => {
  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  return {
    mobile: gridMap[defaultCols] || 'grid-cols-2',
    tablet: 'md:grid-cols-3',
    desktop: 'lg:grid-cols-4',
    wide: 'xl:grid-cols-5',
  }
}

/**
 * Get responsive padding
 * @returns {object} Padding classes for different breakpoints
 */
export const getResponsivePadding = () => {
  return {
    container: 'px-4 sm:px-6 md:px-8 lg:px-0',
    section: 'py-8 sm:py-12 md:py-16 lg:py-20',
    card: 'p-4 sm:p-5 md:p-6 lg:p-8',
  }
}

/**
 * Get responsive font sizes
 * @returns {object} Font size classes for different breakpoints
 */
export const getResponsiveFontSizes = () => {
  return {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    body: 'text-sm sm:text-base md:text-lg lg:text-lg',
    small: 'text-xs sm:text-sm md:text-base lg:text-base',
  }
}

/**
 * Get responsive spacing (gap/margin)
 * @returns {object} Spacing classes for different breakpoints
 */
export const getResponsiveSpacing = () => {
  return {
    xs: 'gap-2 sm:gap-3 md:gap-4',
    sm: 'gap-3 sm:gap-4 md:gap-6',
    md: 'gap-4 sm:gap-6 md:gap-8',
    lg: 'gap-6 sm:gap-8 md:gap-12',
  }
}

// ============================================
// RESPONSIVE IMAGE HELPERS
// ============================================

/**
 * Get responsive image dimensions
 * @param {number} mobileWidth - Width for mobile (px)
 * @returns {object} Image dimensions for different breakpoints
 */
export const getResponsiveImageDimensions = (mobileWidth = 300) => {
  return {
    mobile: `${mobileWidth}px`,
    tablet: `${mobileWidth * 1.5}px`,
    desktop: `${mobileWidth * 2}px`,
  }
}

/**
 * Get responsive aspect ratios
 * @returns {object} Common aspect ratios
 */
export const getResponsiveAspectRatios = () => {
  return {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    thumbnail: 'aspect-[4/3]',
  }
}

// ============================================
// RESPONSIVE FORM HELPERS
// ============================================

/**
 * Get responsive form input classes
 * @returns {string} Tailwind classes for responsive inputs
 */
export const getResponsiveInputClasses = () => {
  return 'w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-base rounded-lg border transition min-h-[44px]'
}

/**
 * Get responsive button classes
 * @returns {string} Tailwind classes for responsive buttons
 */
export const getResponsiveButtonClasses = () => {
  return 'px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base font-medium rounded-lg transition min-h-[44px] min-w-[44px]'
}

// ============================================
// RESPONSIVE LAYOUT HELPERS
// ============================================

/**
 * Get responsive flex direction
 * @returns {string} Tailwind classes for responsive flex
 */
export const getResponsiveFlexDirection = () => {
  return 'flex flex-col sm:flex-col md:flex-row lg:flex-row'
}

/**
 * Get responsive grid auto layout
 * @returns {string} Tailwind classes for auto-fit grid
 */
export const getResponsiveAutoGrid = (minWidth = '250px') => {
  return `grid gap-4 auto-cols-max`
}

// ============================================
// TOUCH TARGET HELPERS
// ============================================

/**
 * Ensure touch-friendly button size (minimum 44x44px)
 * @returns {string} Tailwind classes
 */
export const getTouchFriendlySize = () => {
  return 'min-h-[44px] min-w-[44px]'
}

/**
 * Ensure touch-friendly spacing between interactive elements
 * @returns {string} Tailwind classes
 */
export const getTouchFriendlySpacing = () => {
  return 'p-2 sm:p-2.5 md:p-3'
}

// ============================================
// SAFE AREA HELPERS (for notched devices)
// ============================================

/**
 * Get safe area padding for notched devices
 * @returns {string} CSS for safe areas
 */
export const getSafeAreaPadding = () => {
  return {
    top: 'pt-safe',
    bottom: 'pb-safe',
    left: 'pl-safe',
    right: 'pr-safe',
  }
}

// ============================================
// RESPONSIVE CONTAINER QUERIES
// ============================================

/**
 * Get container query classes
 * @returns {object} Container query classes
 */
export const getContainerQueries = () => {
  return {
    sm: '@container sm:',
    md: '@container md:',
    lg: '@container lg:',
  }
}

// ============================================
// MEDIA QUERY DETECTION
// ============================================

/**
 * Check if prefers-reduced-motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if prefers-color-scheme dark
 * @returns {boolean}
 */
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Check if prefers-color-scheme light
 * @returns {boolean}
 */
export const prefersLightMode = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: light)').matches
}

/**
 * Check if device is in portrait orientation
 * @returns {boolean}
 */
export const isPortrait = () => {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(orientation: portrait)').matches
}

/**
 * Check if device is in landscape orientation
 * @returns {boolean}
 */
export const isLandscape = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(orientation: landscape)').matches
}

/**
 * Check if user prefers high contrast
 * @returns {boolean}
 */
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: more)').matches
}

// ============================================
// DEVICE TYPE DETECTION
// ============================================

/**
 * Detect user agent device type
 * @returns {string} Device type: 'mobile' | 'tablet' | 'desktop'
 */
export const detectDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth

  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * Check if touch device
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false

  return (
    (typeof window !== 'undefined' && window.ontouchstart !== undefined) ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

export default {
  breakpoints,
  breakpointNumbers,
  useResponsive,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  getResponsiveGridCols,
  getResponsivePadding,
  getResponsiveFontSizes,
  getResponsiveSpacing,
  getResponsiveImageDimensions,
  getResponsiveAspectRatios,
  getResponsiveInputClasses,
  getResponsiveButtonClasses,
  getResponsiveFlexDirection,
  getTouchFriendlySize,
  getTouchFriendlySpacing,
  getSafeAreaPadding,
  getContainerQueries,
  prefersReducedMotion,
  prefersDarkMode,
  prefersLightMode,
  isPortrait,
  isLandscape,
  prefersHighContrast,
  detectDeviceType,
  isTouchDevice,
}
