/**
 * 🎯 Gesture Controller - Advanced Touch Gestures
 * Handles: Swipe, Pull-to-refresh, Double-tap, Long-press, Pinch
 */

import React, { useRef, useEffect } from 'react'

export const useGestureController = () => {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const lastTapTime = useRef(0)

  const detectSwipe = (callback) => {
    return {
      onTouchStart: (e) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
        touchStartTime.current = Date.now()
      },
      onTouchEnd: (e) => {
        const touchEndX = e.changedTouches[0].clientX
        const touchEndY = e.changedTouches[0].clientY
        const diffX = touchStartX.current - touchEndX
        const diffY = touchStartY.current - touchEndY
        const timeDiff = Date.now() - touchStartTime.current

        // Must be quick swipe (< 500ms) and move more horizontally than vertically
        if (Math.abs(diffX) > Math.abs(diffY) && timeDiff < 500) {
          if (diffX > 50) {
            callback('LEFT')
            triggerHaptic()
          } else if (diffX < -50) {
            callback('RIGHT')
            triggerHaptic()
          }
        }

        // Vertical swipe for pull-to-refresh
        if (diffY < -100 && timeDiff < 500) {
          callback('DOWN')
          triggerHaptic()
        }
      },
    }
  }

  const detectDoubleTap = (callback) => {
    return {
      onTouchEnd: () => {
        const now = Date.now()
        if (now - lastTapTime.current < 300) {
          callback()
          triggerHaptic('medium')
        }
        lastTapTime.current = now
      },
    }
  }

  const triggerHaptic = (intensity = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20, 10, 20],
        heavy: [30, 10, 30],
      }
      navigator.vibrate(patterns[intensity] || patterns.light)
    }
  }

  return {
    detectSwipe,
    detectDoubleTap,
    triggerHaptic,
  }
}

/**
 * Pull-to-Refresh Hook
 */
export const usePullToRefresh = (onRefresh) => {
  const scrollableRef = useRef(null)
  const pullDistance = useRef(0)
  const isPulling = useRef(false)

  useEffect(() => {
    const element = scrollableRef.current
    if (!element) return

    const handleTouchStart = () => {
      if (element.scrollTop === 0) {
        isPulling.current = true
        pullDistance.current = 0
      }
    }

    const handleTouchMove = (e) => {
      if (!isPulling.current) return

      pullDistance.current = e.touches[0].clientY
      const indicator = element.querySelector('.pull-to-refresh-indicator')
      if (indicator) {
        indicator.style.opacity = Math.min(pullDistance.current / 100, 1)
        indicator.style.transform = `translateY(${Math.min(pullDistance.current, 60)}px)`
      }
    }

    const handleTouchEnd = () => {
      if (isPulling.current && pullDistance.current > 60) {
        onRefresh()
      }
      isPulling.current = false
      pullDistance.current = 0
    }

    element.addEventListener('touchstart', handleTouchStart)
    element.addEventListener('touchmove', handleTouchMove)
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh])

  return scrollableRef
}

/**
 * Swipe Navigation Hook
 */
export const useSwipeNavigation = (onSwipe) => {
  const containerRef = useRef(null)
  const touches = useRef({})

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const handleTouchStart = (e) => {
      touches.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      }
    }

    const handleTouchEnd = (e) => {
      const touch = touches.current
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const timeDiff = Date.now() - touch.time

      // Minimum swipe distance: 30px, Maximum time: 500ms
      if (timeDiff > 500) return

      const diffX = touch.x - endX
      const diffY = touch.y - endY

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        if (diffX > 0) {
          onSwipe('left')
        } else {
          onSwipe('right')
        }
      }
    }

    element.addEventListener('touchstart', handleTouchStart)
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipe])

  return containerRef
}

/**
 * Long Press Hook
 */
export const useLongPress = (onLongPress, duration = 500) => {
  const timerRef = useRef(null)

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      onLongPress()
    }, duration)
  }

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseUp: handleTouchEnd,
  }
}

export default useGestureController
