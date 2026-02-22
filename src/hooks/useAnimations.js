import { useEffect, useRef, useState } from 'react'

/**
 * Hook for scroll-based animations
 * Triggers animation when element enters viewport
 */
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

/**
 * Hook for fade-in animation
 */
export const useFadeIn = (duration = 0.5) => {
  const ref = useRef(null)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    setShouldShow(true)
  }, [])

  return [
    ref,
    {
      opacity: shouldShow ? 1 : 0,
      transition: `opacity ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
    },
  ]
}

/**
 * Hook for detecting if element is in viewport
 */
export const useInView = (threshold = 0.1, rootMargin = '0px') => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold, rootMargin },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, isInView]
}

/**
 * Hook for debounced scroll events
 */
export const useScrollDirection = (debounceMs = 250) => {
  const [scrollDirection, setScrollDirection] = useState('up')
  const lastScrollY = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }

      lastScrollY.current = currentScrollY

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        lastScrollY.current = currentScrollY
      }, debounceMs)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [debounceMs])

  return scrollDirection
}

/**
 * Hook for parallax scroll effect
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const elementTop = ref.current.getBoundingClientRect().top
        setOffset(elementTop * speed)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return [ref, { transform: `translateY(${offset}px)` }]
}

/**
 * Hook for debounced callback
 */
export const useDebounce = (callback, delay = 500) => {
  const timeoutRef = useRef(null)

  const debouncedCallback = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }

  const flush = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return [debouncedCallback, flush]
}

/**
 * Hook for throttled callback
 */
export const useThrottle = (callback, delay = 500) => {
  const lastRunRef = useRef(Date.now())

  const throttledCallback = (...args) => {
    const now = Date.now()

    if (now - lastRunRef.current >= delay) {
      callback(...args)
      lastRunRef.current = now
    }
  }

  return throttledCallback
}

/**
 * Hook for hover animation
 */
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false)

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onTouchStart: () => setIsHovered(true),
    onTouchEnd: () => setIsHovered(false),
  }

  return [isHovered, handlers]
}

/**
 * Hook for click-outside detection
 */
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback, ref])
}

/**
 * Hook for keyboard shortcuts
 */
export const useKeyPress = (targetKey, callback) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === targetKey || event.code === targetKey) {
        callback(event)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [targetKey, callback])
}

/**
 * Hook for local storage with state
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Hook for media query
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

/**
 * Hook for detecting mobile device
 */
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)')
}

/**
 * Hook for detecting tablet device
 */
export const useIsTablet = () => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

/**
 * Hook for detecting desktop device
 */
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1025px)')
}

/**
 * Hook for async data loading with debounce
 */
export const useAsyncData = (asyncFunction, dependencies = [], debounceMs = 300) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await asyncFunction()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, dependencies)

  return [data, loading, error]
}

/**
 * Hook for previous value
 */
export const usePrevious = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Hook for toggle
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = (newValue) => {
    setValue((prev) => (newValue !== undefined ? newValue : !prev))
  }

  return [value, toggle, setValue]
}

/**
 * Hook for counter
 */
export const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount((prev) => prev + step)
  const decrement = () => setCount((prev) => prev - step)
  const reset = () => setCount(initialValue)
  const set = (value) => setCount(value)

  return [count, { increment, decrement, reset, set }]
}

export default {
  useScrollAnimation,
  useFadeIn,
  useInView,
  useScrollDirection,
  useParallax,
  useDebounce,
  useThrottle,
  useHoverAnimation,
  useClickOutside,
  useKeyPress,
  useLocalStorage,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useAsyncData,
  usePrevious,
  useToggle,
  useCounter,
}
