// Mobile Responsive Design System - Utility Functions
// Provides helpers and hooks for implementing responsive designs across the application

import { useState, useEffect } from 'react'

/**
 * Responsive Breakpoints Definition
 * Mobile-first approach with progressive enhancement
 */
const BREAKPOINTS = {
  xs: 320, // Extra small - Mobile phones
  sm: 640, // Small - Small phones
  md: 768, // Medium - Tablets
  lg: 1024, // Large - Desktops
  xl: 1280, // Extra large - Wide desktops
  '2xl': 1536, // Ultra wide screens
}

/**
 * Custom Hook: useResponsiveBreakpoint
 * Returns current breakpoint name based on window width
 */
export const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('xs')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= BREAKPOINTS['2xl']) setBreakpoint('2xl')
      else if (width >= BREAKPOINTS.xl) setBreakpoint('xl')
      else if (width >= BREAKPOINTS.lg) setBreakpoint('lg')
      else if (width >= BREAKPOINTS.md) setBreakpoint('md')
      else if (width >= BREAKPOINTS.sm) setBreakpoint('sm')
      else setBreakpoint('xs')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

/**
 * Custom Hook: useMobileDetection
 * Returns device type detection
 */
export const useMobileDetection = () => {
  const [deviceType, setDeviceType] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.md) setDeviceType('mobile')
      else if (width < BREAKPOINTS.lg) setDeviceType('tablet')
      else setDeviceType('desktop')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    deviceType,
  }
}

/**
 * Custom Hook: useIsMobile
 * Simple boolean for mobile detection
 */
export const useIsMobile = () => {
  const { isMobile } = useMobileDetection()
  return isMobile
}

/**
 * Custom Hook: useIsTablet
 * Simple boolean for tablet detection
 */
export const useIsTablet = () => {
  const { isTablet } = useMobileDetection()
  return isTablet
}

/**
 * Custom Hook: useIsDesktop
 * Simple boolean for desktop detection
 */
export const useIsDesktop = () => {
  const { isDesktop } = useMobileDetection()
  return isDesktop
}

/**
 * Get responsive grid columns based on current screen size
 * @param {string} breakpoint - Current breakpoint
 * @returns {number} Number of columns
 */
export const getResponsiveGridCols = (breakpoint) => {
  const gridMap = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    '2xl': 5,
  }
  return gridMap[breakpoint] || 3
}

/**
 * Get responsive padding based on breakpoint
 * @param {string} breakpoint - Current breakpoint
 * @returns {string} CSS padding value
 */
export const getResponsivePadding = (breakpoint) => {
  const paddingMap = {
    xs: '1rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    '2xl': '3rem',
  }
  return paddingMap[breakpoint] || '1.5rem'
}

/**
 * Get responsive gap for grids based on breakpoint
 * @param {string} breakpoint - Current breakpoint
 * @returns {string} CSS gap value
 */
export const getResponsiveGap = (breakpoint) => {
  const gapMap = {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2rem',
    '2xl': '2.5rem',
  }
  return gapMap[breakpoint] || '1.5rem'
}

/**
 * Get responsive font size based on breakpoint
 * @param {string} size - Size name (sm, base, lg, xl, 2xl)
 * @param {string} breakpoint - Current breakpoint
 * @returns {string} CSS font-size value
 */
export const getResponsiveFontSize = (size, breakpoint) => {
  const fontSizeMap = {
    sm: { xs: '13px', sm: '14px', md: '14px', lg: '14px' },
    base: { xs: '14px', sm: '14px', md: '16px', lg: '16px' },
    lg: { xs: '16px', sm: '18px', md: '20px', lg: '20px' },
    xl: { xs: '18px', sm: '20px', md: '24px', lg: '24px' },
    '2xl': { xs: '20px', sm: '24px', md: '28px', lg: '32px' },
    '3xl': { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
  }

  return fontSizeMap[size]?.[breakpoint] || '16px'
}

/**
 * Get responsive button classes based on device type
 * @param {boolean} isMobile - Is mobile device
 * @returns {string} Tailwind classes for button
 */
export const getResponsiveButtonClasses = (isMobile = false) => {
  return isMobile ? 'py-2.5 px-3 text-sm rounded-lg' : 'py-3 px-4 text-base rounded-lg'
}

/**
 * Get responsive input classes based on device type
 * @param {boolean} isMobile - Is mobile device
 * @returns {string} Tailwind classes for input
 */
export const getResponsiveInputClasses = (isMobile = false) => {
  return isMobile ? 'py-2.5 px-3 text-sm rounded-lg' : 'py-3 px-4 text-base rounded-lg'
}

/**
 * Get responsive container padding
 * @param {string} breakpoint - Current breakpoint
 * @returns {string} Tailwind padding classes
 */
export const getResponsiveContainerPadding = (breakpoint) => {
  const paddingMap = {
    xs: 'px-4',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-8',
    xl: 'px-4 sm:px-6 lg:px-8',
    '2xl': 'px-4 sm:px-6 lg:px-8',
  }
  return paddingMap[breakpoint] || 'px-4 sm:px-6 lg:px-8'
}

/**
 * Check if device prefers reduced motion
 * @returns {boolean} Prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if device prefers dark mode
 * @returns {boolean} Prefers dark mode
 */
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Check if device is touch-enabled
 * @returns {boolean} Is touch device
 */
export const isTouchDevice = () => {
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Check device orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export const getDeviceOrientation = () => {
  return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
}

/**
 * Custom Hook: useOrientation
 * Returns device orientation
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(getDeviceOrientation())
    }

    handleOrientationChange()
    window.addEventListener('orientationchange', handleOrientationChange)
    return () => window.removeEventListener('orientationchange', handleOrientationChange)
  }, [])

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  }
}

/**
 * Get safe area insets for notched devices
 * @returns {object} Safe area values
 */
export const getSafeAreaInsets = () => {
  return {
    top: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top'),
    right: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right'),
    bottom: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom'),
    left: getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left'),
  }
}

/**
 * Generate responsive grid template columns
 * @param {string} breakpoint - Current breakpoint
 * @returns {string} CSS grid-template-columns value
 */
export const getResponsiveGridTemplate = (breakpoint) => {
  const cols = getResponsiveGridCols(breakpoint)
  return `repeat(${cols}, minmax(0, 1fr))`
}

/**
 * Media query helper for max-width
 * @param {number} maxWidth - Maximum width in pixels
 * @returns {boolean} Is window width less than maxWidth
 */
export const useMaxWidth = (maxWidth) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`)
    setMatches(mediaQuery.matches)

    const handler = () => setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [maxWidth])

  return matches
}

/**
 * Media query helper for min-width
 * @param {number} minWidth - Minimum width in pixels
 * @returns {boolean} Is window width greater than minWidth
 */
export const useMinWidth = (minWidth) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`)
    setMatches(mediaQuery.matches)

    const handler = () => setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [minWidth])

  return matches
}

/**
 * Get vertical viewport units considering mobile address bar
 * @returns {number} Viewport height
 */
export const getViewportHeight = () => {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

/**
 * Responsive spacing scale
 * Maps breakpoints to spacing values
 */
export const RESPONSIVE_SPACING = {
  xs: {
    padding: '1rem',
    gap: '0.75rem',
    margin: '0.75rem',
    borderRadius: '0.375rem',
    borderWidth: '1px',
  },
  sm: {
    padding: '1.25rem',
    gap: '1rem',
    margin: '1rem',
    borderRadius: '0.5rem',
    borderWidth: '1px',
  },
  md: {
    padding: '1.5rem',
    gap: '1.5rem',
    margin: '1.5rem',
    borderRadius: '0.75rem',
    borderWidth: '1px',
  },
  lg: {
    padding: '2rem',
    gap: '2rem',
    margin: '2rem',
    borderRadius: '1rem',
    borderWidth: '1px',
  },
}

/**
 * Get responsive styles object for inline styles
 * @param {string} breakpoint - Current breakpoint
 * @returns {object} Style object
 */
export const getResponsiveStyles = (breakpoint) => {
  return {
    padding: getResponsivePadding(breakpoint),
    gap: getResponsiveGap(breakpoint),
    fontSize: getResponsiveFontSize('base', breakpoint),
  }
}

/**
 * Debounce window resize events
 * @param {function} callback - Callback function
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Cleanup function
 */
export const useResponsiveResize = (callback, delay = 250) => {
  const [resizeTimer, setResizeTimer] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      const timer = setTimeout(callback, delay)
      setResizeTimer(timer)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [callback, delay, resizeTimer])
}

export default {
  BREAKPOINTS,
  useResponsiveBreakpoint,
  useMobileDetection,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  getResponsiveGridCols,
  getResponsivePadding,
  getResponsiveGap,
  getResponsiveFontSize,
  getResponsiveButtonClasses,
  getResponsiveInputClasses,
  getResponsiveContainerPadding,
  prefersReducedMotion,
  prefersDarkMode,
  isTouchDevice,
  getDeviceOrientation,
  useOrientation,
  getSafeAreaInsets,
  getResponsiveGridTemplate,
  useMaxWidth,
  useMinWidth,
  getViewportHeight,
  RESPONSIVE_SPACING,
  getResponsiveStyles,
  useResponsiveResize,
}
