/**
 * Performance Optimization Initialization Module
 * Sets up all performance optimization features on app startup
 */

import {
  initWebVitalsMonitoring,
  sendMetrics,
  checkMetricsHealth,
} from './performanceMonitoringService'
import { preloadCriticalData, CACHE_EXPIRY, clearExpiredCache } from './cachingService'
import { prefetchDNS, preconnect } from './imageOptimizationService'

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  console.log('🚀 Initializing performance optimizations...')

  // 1. Register Service Worker for offline support
  registerServiceWorker()

  // 2. Initialize Web Vitals monitoring
  initWebVitalsMonitoring()

  // 3. Prefetch DNS for critical domains
  prefetchCriticalDomains()

  // 4. Preconnect to critical resources
  preconnectCriticalResources()

  // 5. Preload critical data
  preloadCriticalResources()

  // 6. Setup periodic cache cleanup
  setupCacheCleanup()

  // 7. Setup metrics reporting
  setupMetricsReporting()

  // 8. Initialize code splitting
  setupCodeSplitting()

  // 9. Setup resource hints
  setupResourceHints()

  // 10. Monitor performance issues
  setupPerformanceMonitoring()

  console.log('✅ Performance optimizations initialized')
}

/**
 * Register Service Worker
 */
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000)
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })
    })
  }
}

/**
 * Prefetch DNS for critical domains
 */
const prefetchCriticalDomains = () => {
  const domains = [
    'https://api.example.com',
    'https://cdn.example.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]

  prefetchDNS(domains)
  console.log('📡 DNS prefetching configured')
}

/**
 * Preconnect to critical resources
 */
const preconnectCriticalResources = () => {
  const resources = ['https://api.example.com', 'https://cdn.example.com']

  preconnect(resources)
  console.log('🔗 Preconnect configured')
}

/**
 * Preload critical data
 */
const preloadCriticalResources = () => {
  const dataFetchers = {
    'featured-products': async () => {
      // TODO: Replace with actual API call
      return fetch('/api/v1/products/featured').then((r) => r.json())
    },
    categories: async () => {
      // TODO: Replace with actual API call
      return fetch('/api/v1/categories').then((r) => r.json())
    },
    'user-profile': async () => {
      // Only preload if user is authenticated
      if (localStorage.getItem('accessToken')) {
        return fetch('/api/v1/user/profile').then((r) => r.json())
      }
      return null
    },
  }

  preloadCriticalData(dataFetchers)
  console.log('📦 Critical data preloading configured')
}

/**
 * Setup periodic cache cleanup
 */
const setupCacheCleanup = () => {
  // Clear expired cache every 30 minutes
  setInterval(
    () => {
      clearExpiredCache()
    },
    30 * 60 * 1000,
  )

  console.log('🧹 Cache cleanup configured')
}

/**
 * Setup metrics reporting
 */
const setupMetricsReporting = () => {
  // Report metrics when page becomes hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const health = checkMetricsHealth()
      sendMetrics({ health })
    }
  })

  // Report metrics on page unload
  window.addEventListener('beforeunload', () => {
    const health = checkMetricsHealth()
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/v1/monitoring/metrics',
        JSON.stringify({
          metrics: getMetrics(),
          health,
        }),
      )
    }
  })

  console.log('📊 Metrics reporting configured')
}

/**
 * Setup code splitting
 */
const setupCodeSplitting = () => {
  // Dynamic imports for route-based code splitting
  // This is handled by bundler configuration (webpack, vite, etc.)
  // Make sure lazy() and Suspense are used in routes

  console.log('📦 Code splitting configured')
}

/**
 * Setup resource hints
 */
const setupResourceHints = () => {
  // Add preload for critical CSS/JS files
  const linkPreload = document.createElement('link')
  linkPreload.rel = 'preload'
  linkPreload.as = 'style'
  linkPreload.href = '/styles/critical.css'
  document.head.appendChild(linkPreload)

  // Add prefetch for next page resources
  const linkPrefetch = document.createElement('link')
  linkPrefetch.rel = 'prefetch'
  linkPrefetch.as = 'script'
  linkPrefetch.href = '/js/next-page.js'
  document.head.appendChild(linkPrefetch)

  console.log('🎯 Resource hints configured')
}

/**
 * Setup performance monitoring
 */
const setupPerformanceMonitoring = () => {
  // Warn if metrics are poor
  setTimeout(() => {
    const health = checkMetricsHealth()
    if (health.fcp === 'poor') {
      console.warn('⚠️ First Contentful Paint is slow')
    }
    if (health.lcp === 'poor') {
      console.warn('⚠️ Largest Contentful Paint is slow')
    }
    if (health.cls === 'poor') {
      console.warn('⚠️ Cumulative Layout Shift is high')
    }
  }, 5000)

  console.log('⚠️ Performance monitoring configured')
}

/**
 * Get current metrics
 */
const getMetrics = () => {
  const { getMetrics: getPerformanceMetrics } = require('./performanceMonitoringService')
  return getPerformanceMetrics()
}

/**
 * Enable debug mode for performance metrics
 */
export const enablePerformanceDebug = () => {
  console.log('🐛 Performance Debug Mode Enabled')

  // Log metrics every 5 seconds
  setInterval(() => {
    const metrics = getMetrics()
    console.table(metrics)
  }, 5000)

  // Log memory usage
  if (performance.memory) {
    setInterval(() => {
      console.log('Memory Usage:', {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
      })
    }, 10000)
  }
}

/**
 * Get performance recommendations
 */
export const getPerformanceRecommendations = () => {
  const metrics = getMetrics()
  const recommendations = []

  if (metrics.pageLoadTime > 3000) {
    recommendations.push({
      issue: 'Page load time is slow',
      metric: 'pageLoadTime',
      value: metrics.pageLoadTime,
      suggestion: 'Consider code splitting, lazy loading, and image optimization',
    })
  }

  if (metrics.firstContentfulPaint > 1800) {
    recommendations.push({
      issue: 'First Contentful Paint is slow',
      metric: 'firstContentfulPaint',
      value: metrics.firstContentfulPaint,
      suggestion: 'Optimize critical rendering path, remove render-blocking resources',
    })
  }

  if (metrics.largestContentfulPaint > 2500) {
    recommendations.push({
      issue: 'Largest Contentful Paint is slow',
      metric: 'largestContentfulPaint',
      value: metrics.largestContentfulPaint,
      suggestion: 'Optimize images, preload critical resources, reduce server response time',
    })
  }

  if (metrics.cumulativeLayoutShift > 0.1) {
    recommendations.push({
      issue: 'Cumulative Layout Shift is high',
      metric: 'cumulativeLayoutShift',
      value: metrics.cumulativeLayoutShift,
      suggestion:
        'Reserve space for dynamic content, avoid inserting content above existing content',
    })
  }

  return recommendations
}

export default {
  initializePerformanceOptimizations,
  enablePerformanceDebug,
  getPerformanceRecommendations,
}
