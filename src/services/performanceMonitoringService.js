/**
 * Performance Monitoring Service
 * Tracks performance metrics and sends to monitoring backend
 */

import axiosInstance from './axiosInstance'

const METRICS = {
  pageLoadTime: 0,
  firstContentfulPaint: 0,
  largestContentfulPaint: 0,
  cumulativeLayoutShift: 0,
  firstInputDelay: 0,
  timeToInteractive: 0,
  domContentLoaded: 0,
  navigationStart: 0,
}

const THRESHOLDS = {
  'good-fcp': 1800, // milliseconds
  'good-lcp': 2500,
  'good-cls': 0.1,
  'good-fid': 100,
}

/**
 * Initialize Web Vitals monitoring
 */
export const initWebVitalsMonitoring = () => {
  // Observe Largest Contentful Paint
  observeLCP()

  // Observe Cumulative Layout Shift
  observeCLS()

  // Observe First Input Delay
  observeFID()

  // Measure Core Web Vitals
  measureCoreWebVitals()

  // Monitor performance on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      sendMetrics()
    }
  })

  // Send metrics before unload
  window.addEventListener('beforeunload', () => {
    sendMetrics()
  })
}

/**
 * Observe Largest Contentful Paint
 */
const observeLCP = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        METRICS.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.error('LCP observation error:', error)
    }
  }
}

/**
 * Observe Cumulative Layout Shift
 */
const observeCLS = () => {
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            METRICS.cumulativeLayoutShift = clsValue
          }
        }
      })

      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.error('CLS observation error:', error)
    }
  }
}

/**
 * Observe First Input Delay
 */
const observeFID = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          METRICS.firstInputDelay = entry.processingDuration
        }
      })

      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.error('FID observation error:', error)
    }
  }
}

/**
 * Measure Core Web Vitals manually
 */
const measureCoreWebVitals = () => {
  // Measure First Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            METRICS.firstContentfulPaint = entry.startTime
          }
        }
      })

      observer.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.error('FCP observation error:', error)
    }
  }

  // Measure traditional page load time
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      const timing = window.performance.timing
      METRICS.pageLoadTime = timing.loadEventEnd - timing.navigationStart
      METRICS.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
      METRICS.navigationStart = timing.navigationStart
    })
  }
}

/**
 * Get current metrics
 */
export const getMetrics = () => {
  return { ...METRICS }
}

/**
 * Send metrics to backend
 */
export const sendMetrics = async (customData = {}) => {
  try {
    const payload = {
      ...METRICS,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      thresholds: THRESHOLDS,
      customData,
      // Additional metrics
      memory: getMemoryMetrics(),
      navigation: getNavigationMetrics(),
      resources: getResourceMetrics(),
    }

    await axiosInstance.post('/monitoring/metrics', payload, {
      timeout: 5000,
    })

    console.log('Metrics sent:', payload)
  } catch (error) {
    console.error('Error sending metrics:', error)
    // Queue for later retry
    queueMetricsForRetry(customData)
  }
}

/**
 * Get memory metrics
 */
const getMemoryMetrics = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      heapUsagePercent:
        (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
    }
  }
  return null
}

/**
 * Get navigation metrics
 */
const getNavigationMetrics = () => {
  const timing = window.performance?.timing
  if (!timing) return null

  return {
    dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
    tcpConnection: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.navigationStart,
    responseTime: timing.responseEnd - timing.responseStart,
    domParsing: timing.domInteractive - timing.domLoading,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
    scriptExecution: timing.loadEventStart - timing.domInteractive,
  }
}

/**
 * Get resource metrics
 */
const getResourceMetrics = () => {
  if (!window.performance?.getEntriesByType) return null

  const resources = window.performance.getEntriesByType('resource')
  const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
  const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0)

  return {
    totalResources: resources.length,
    totalSize,
    averageSize: totalSize / resources.length,
    totalDuration,
    averageDuration: totalDuration / resources.length,
  }
}

/**
 * Measure component render time
 */
export const measureComponentRender = (componentName, startTime) => {
  const endTime = performance.now()
  const renderTime = endTime - startTime

  console.log(`Component ${componentName} render time: ${renderTime.toFixed(2)}ms`)

  return {
    component: componentName,
    renderTime,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Measure function execution time
 */
export const measureFunctionExecution = async (functionName, fn) => {
  const startTime = performance.now()

  try {
    const result = await fn()
    const endTime = performance.now()
    const executionTime = endTime - startTime

    console.log(`Function ${functionName} execution time: ${executionTime.toFixed(2)}ms`)

    return { result, executionTime }
  } catch (error) {
    const endTime = performance.now()
    const executionTime = endTime - startTime

    console.error(`Function ${functionName} error after ${executionTime.toFixed(2)}ms:`, error)
    throw error
  }
}

/**
 * Measure API request duration
 */
export const measureApiCall = (apiName, duration) => {
  console.log(`API call ${apiName} took ${duration.toFixed(2)}ms`)

  return {
    api: apiName,
    duration,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Queue metrics for retry
 */
const queueMetricsForRetry = (customData) => {
  try {
    const queue = JSON.parse(localStorage.getItem('metrics-queue') || '[]')
    queue.push({
      ...METRICS,
      customData,
      timestamp: new Date().toISOString(),
    })

    // Keep only last 50 items
    const trimmed = queue.slice(-50)
    localStorage.setItem('metrics-queue', JSON.stringify(trimmed))
  } catch (error) {
    console.error('Error queueing metrics:', error)
  }
}

/**
 * Retry queued metrics
 */
export const retryQueuedMetrics = async () => {
  try {
    const queue = JSON.parse(localStorage.getItem('metrics-queue') || '[]')

    if (queue.length === 0) return

    for (const metrics of queue) {
      try {
        await axiosInstance.post('/monitoring/metrics', metrics)
      } catch (error) {
        console.error('Error retrying metric:', error)
      }
    }

    localStorage.removeItem('metrics-queue')
  } catch (error) {
    console.error('Error retrying queued metrics:', error)
  }
}

/**
 * Check if metrics are within good thresholds
 */
export const checkMetricsHealth = () => {
  const health = {
    fcp: METRICS.firstContentfulPaint <= THRESHOLDS['good-fcp'] ? 'good' : 'poor',
    lcp: METRICS.largestContentfulPaint <= THRESHOLDS['good-lcp'] ? 'good' : 'poor',
    cls: METRICS.cumulativeLayoutShift <= THRESHOLDS['good-cls'] ? 'good' : 'poor',
    fid: METRICS.firstInputDelay <= THRESHOLDS['good-fid'] ? 'good' : 'poor',
    overall:
      health.fcp === 'good' &&
      health.lcp === 'good' &&
      health.cls === 'good' &&
      health.fid === 'good'
        ? 'good'
        : 'needs-improvement',
  }

  return health
}

/**
 * Report to performance monitoring service
 */
export const reportPerformanceIssue = async (issue, severity = 'warning') => {
  try {
    await axiosInstance.post('/monitoring/issues', {
      issue,
      severity,
      metrics: METRICS,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    })
  } catch (error) {
    console.error('Error reporting performance issue:', error)
  }
}

export default {
  initWebVitalsMonitoring,
  getMetrics,
  sendMetrics,
  measureComponentRender,
  measureFunctionExecution,
  measureApiCall,
  retryQueuedMetrics,
  checkMetricsHealth,
  reportPerformanceIssue,
}
