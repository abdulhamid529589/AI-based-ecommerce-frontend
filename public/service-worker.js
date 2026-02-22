/**
 * Service Worker for Progressive Web App (PWA) Support
 * - Offline support
 * - Cache strategies
 * - Background sync
 * - Push notifications
 */

const CACHE_NAME = 'ecommerce-v1'
const STATIC_ASSETS = ['/', '/index.html', '/favicon.ico', '/logo.png']

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // API requests - network first, then cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone)
            })
          }
          return response
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((response) => response || cacheOfflineResponse())
        }),
    )
    return
  }

  // HTML pages - network first
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone)
            })
          }
          return response
        })
        .catch(() => caches.match(request).then((response) => response || cacheOfflineResponse())),
    )
    return
  }

  // Assets - cache first, fallback to network
  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone)
            })
          }
          return response
        })
      })
      .catch(() => cacheOfflineResponse()),
  )
})

// Offline response
function cacheOfflineResponse() {
  return new Response(
    '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your connection.</p></body></html>',
    {
      headers: { 'Content-Type': 'text/html' },
    },
  )
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
    event.ports[0].postMessage({ success: true })
  }

  if (event.data?.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ size })
    })
  }
})

// Get cache size
async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME)
  const keys = await cache.keys()
  let size = 0

  for (const request of keys) {
    const response = await cache.match(request)
    if (response) {
      const blob = await response.blob()
      size += blob.size
    }
  }

  return size
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart())
  }

  if (event.tag === 'sync-wishlist') {
    event.waitUntil(syncWishlist())
  }
})

// Sync cart items
async function syncCart() {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cartData = await cache.match('/cart-data')
    if (cartData) {
      const data = await cartData.json()
      await fetch('/api/v1/cart/sync', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    }
  } catch (error) {
    console.error('Cart sync error:', error)
  }
}

// Sync wishlist items
async function syncWishlist() {
  try {
    const cache = await caches.open(CACHE_NAME)
    const wishlistData = await cache.match('/wishlist-data')
    if (wishlistData) {
      const data = await wishlistData.json()
      await fetch('/api/v1/wishlist/sync', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    }
  } catch (error) {
    console.error('Wishlist sync error:', error)
  }
}

console.log('Service Worker loaded')
