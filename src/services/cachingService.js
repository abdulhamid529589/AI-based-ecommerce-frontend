/**
 * Advanced Caching Service
 * Implements multi-level caching strategy (Memory, localStorage, IndexedDB, HTTP)
 */

import { compress, decompress } from 'lz-string'

const CACHE_VERSION = 'v1'
const MEMORY_CACHE = new Map()
const CACHE_EXPIRY = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 7 days
}

const DB_NAME = 'ecommerce-cache'
const STORE_NAME = 'cache-store'

/**
 * Initialize IndexedDB for caching
 */
const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
  })
}

/**
 * Set cache with multi-level strategy
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {string} level - Cache level (memory, local, indexed, http)
 * @param {number} ttl - Time to live in milliseconds
 */
export const setCache = async (key, value, level = 'all', ttl = CACHE_EXPIRY.MEDIUM) => {
  const cacheEntry = {
    key,
    value,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl,
  }

  try {
    // Level 1: Memory Cache (fastest, but lost on reload)
    if (level === 'all' || level === 'memory') {
      MEMORY_CACHE.set(key, cacheEntry)
    }

    // Level 2: localStorage (persistent, ~10MB limit)
    if (level === 'all' || level === 'local') {
      const compressed = compress(JSON.stringify(cacheEntry))
      localStorage.setItem(`${CACHE_VERSION}:${key}`, compressed)
    }

    // Level 3: IndexedDB (persistent, large storage)
    if (level === 'all' || level === 'indexed') {
      const db = await initIndexedDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const compressed = compress(JSON.stringify(cacheEntry))
      store.put({ key, data: compressed })
    }
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error)
  }
}

/**
 * Get cache from multi-level storage
 * @param {string} key - Cache key
 * @returns {Promise<any>} Cached value or null
 */
export const getCache = async (key) => {
  try {
    // Check memory first (fastest)
    const memoryEntry = MEMORY_CACHE.get(key)
    if (memoryEntry && !isCacheExpired(memoryEntry)) {
      return memoryEntry.value
    }
    MEMORY_CACHE.delete(key)

    // Check localStorage
    const localEntry = localStorage.getItem(`${CACHE_VERSION}:${key}`)
    if (localEntry) {
      const decompressed = decompress(localEntry)
      const entry = JSON.parse(decompressed)
      if (!isCacheExpired(entry)) {
        // Restore to memory cache
        MEMORY_CACHE.set(key, entry)
        return entry.value
      }
      localStorage.removeItem(`${CACHE_VERSION}:${key}`)
    }

    // Check IndexedDB
    const db = await initIndexedDB()
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onsuccess = () => {
        if (request.result) {
          const decompressed = decompress(request.result.data)
          const entry = JSON.parse(decompressed)
          if (!isCacheExpired(entry)) {
            MEMORY_CACHE.set(key, entry)
            resolve(entry.value)
          } else {
            deleteIndexedDBEntry(key)
            resolve(null)
          }
        } else {
          resolve(null)
        }
      }

      request.onerror = () => resolve(null)
    })
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error)
    return null
  }
}

/**
 * Check if cache entry is expired
 */
const isCacheExpired = (entry) => {
  return entry.expiresAt && Date.now() > entry.expiresAt
}

/**
 * Delete cache entry
 */
export const deleteCache = async (key) => {
  try {
    // Delete from memory
    MEMORY_CACHE.delete(key)

    // Delete from localStorage
    localStorage.removeItem(`${CACHE_VERSION}:${key}`)

    // Delete from IndexedDB
    await deleteIndexedDBEntry(key)
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error)
  }
}

/**
 * Delete IndexedDB entry
 */
const deleteIndexedDBEntry = async (key) => {
  try {
    const db = await initIndexedDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.delete(key)
  } catch (error) {
    console.error(`IndexedDB delete error:`, error)
  }
}

/**
 * Clear all cache
 */
export const clearAllCache = async () => {
  try {
    // Clear memory
    MEMORY_CACHE.clear()

    // Clear localStorage
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_VERSION)) {
        localStorage.removeItem(key)
      }
    })

    // Clear IndexedDB
    const db = await initIndexedDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
  } catch (error) {
    console.error('Clear cache error:', error)
  }
}

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  const stats = {
    memorySize: MEMORY_CACHE.size,
    localStorageSize: 0,
    entries: [],
  }

  // Calculate localStorage size
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (key.startsWith(CACHE_VERSION)) {
      stats.localStorageSize += localStorage.getItem(key)?.length || 0
      stats.entries.push({
        key: key.replace(`${CACHE_VERSION}:`, ''),
        source: 'localStorage',
        size: localStorage.getItem(key)?.length || 0,
      })
    }
  })

  return stats
}

/**
 * Cache wrapper for API calls
 * @param {string} key - Cache key
 * @param {Function} fetcher - Function that fetches data
 * @param {number} ttl - Cache TTL
 */
export const cacheWithFetcher = async (key, fetcher, ttl = CACHE_EXPIRY.MEDIUM) => {
  // Try to get from cache first
  const cached = await getCache(key)
  if (cached !== null) {
    return cached
  }

  // Fetch and cache
  try {
    const data = await fetcher()
    await setCache(key, data, 'all', ttl)
    return data
  } catch (error) {
    console.error(`Fetch error for ${key}:`, error)
    throw error
  }
}

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = async () => {
  try {
    const keys = Object.keys(localStorage)
    let cleared = 0

    for (const key of keys) {
      if (key.startsWith(CACHE_VERSION)) {
        const entry = localStorage.getItem(key)
        if (entry) {
          try {
            const decompressed = decompress(entry)
            const parsed = JSON.parse(decompressed)
            if (isCacheExpired(parsed)) {
              localStorage.removeItem(key)
              cleared++
            }
          } catch (e) {
            // If decompression fails, remove the entry
            localStorage.removeItem(key)
            cleared++
          }
        }
      }
    }

    console.log(`Cleared ${cleared} expired cache entries`)
  } catch (error) {
    console.error('Clear expired cache error:', error)
  }
}

/**
 * Preload critical data into cache
 */
export const preloadCriticalData = async (dataFetchers = {}) => {
  try {
    const promises = Object.entries(dataFetchers).map(async ([key, fetcher]) => {
      try {
        const data = await fetcher()
        await setCache(key, data, 'all', CACHE_EXPIRY.LONG)
        console.log(`Preloaded cache: ${key}`)
      } catch (error) {
        console.error(`Error preloading ${key}:`, error)
      }
    })

    await Promise.all(promises)
  } catch (error) {
    console.error('Preload cache error:', error)
  }
}

export default {
  CACHE_EXPIRY,
  setCache,
  getCache,
  deleteCache,
  clearAllCache,
  getCacheStats,
  cacheWithFetcher,
  clearExpiredCache,
  preloadCriticalData,
}
