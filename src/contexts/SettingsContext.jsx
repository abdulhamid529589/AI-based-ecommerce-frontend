import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import api from '../lib/axios'
import io from 'socket.io-client'

/**
 * Settings Context for Global App Configuration
 * Manages hero slides, shop info, and system settings loaded from dashboard
 * Now includes real-time updates via Socket.io
 */

export const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState([])
  const [categories, setCategories] = useState([])
  const [shopInfo, setShopInfo] = useState({
    shopName: 'BedTex Bangladesh',
    email: 'contact@bedtex.bd',
    phone: '+880 1234 567890',
    address: 'Dhaka, Bangladesh',
    description: 'Premium bedding and home textile store',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    logo: '/logo.png',
    favicon: '/favicon.png',
  })
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    orderNotifications: true,
    stockAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    analyticsTracking: true,
    socialMediaIntegration: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load settings from backend
   */
  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Load all settings in parallel with error handling
      const bannersRes = await api.get('/content/banners').catch((err) => {
        console.warn('⚠️ Failed to fetch banners:', err.response?.status, err.message)
        return { data: { data: [] } }
      })

      const globalRes = await api.get('/content/global').catch((err) => {
        console.warn('⚠️ Failed to fetch global settings:', err.response?.status, err.message)
        return { data: { data: {} } }
      })

      const categoriesRes = await api
        .get(`/content/categories-with-subcategories?_t=${Date.now()}`)
        .catch((err) => {
          console.warn(
            '⚠️ Failed to fetch categories with subcategories:',
            err.response?.status,
            err.message,
          )
          return { data: { data: [] } }
        })

      // Parse hero slides from banners - only active ones
      const bannersData = bannersRes.data?.data || []
      if (Array.isArray(bannersData)) {
        const activeSlides = bannersData
          .filter((banner) => banner.is_active)
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((banner) => ({
            id: banner.id,
            title: banner.title,
            subtitle: banner.description || '',
            image: banner.image_url || '/images/hero-default.jpg',
            link: banner.link || '/products',
            ctaText: 'Shop Now',
            badge: 'Featured',
            discount: 'Special Offer',
          }))

        setHeroSlides(activeSlides.length > 0 ? activeSlides : getDefaultSlides())
      }

      // Parse categories from settings (now includes subcategories)
      const categoriesData = categoriesRes.data?.data || categoriesRes.data || []
      console.log('✅ [SettingsContext] Categories loaded with subcategories:', categoriesData)
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])

      // Parse global settings
      const globalData = globalRes.data?.data || {}
      setShopInfo({
        shopName: globalData.site_name || 'BedTex Bangladesh',
        email: globalData.email || 'contact@bedtex.bd',
        phone: globalData.phone || '+880 1234 567890',
        address: globalData.address || 'Dhaka, Bangladesh',
        description: globalData.description || 'Premium bedding and home textile store',
        currency: globalData.currency || 'BDT',
        timezone: globalData.timezone || 'Asia/Dhaka',
        logo: globalData.site_logo || '/logo.png',
        favicon: globalData.site_favicon || '/favicon.png',
      })

      setSystemSettings({
        maintenanceMode: globalData.maintenance_mode || false,
        orderNotifications: globalData.order_notifications !== false,
        stockAlerts: globalData.stock_alerts !== false,
        emailNotifications: globalData.email_notifications !== false,
        smsNotifications: globalData.sms_notifications || false,
        analyticsTracking: globalData.analytics_tracking !== false,
        socialMediaIntegration: globalData.social_media_integration !== false,
      })

      // Check if maintenance mode is enabled
      if (globalData.maintenance_mode) {
        console.warn('⚠️ Maintenance Mode is ENABLED - Limited access active')
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError(err.message)
      // Use default slides as fallback
      setHeroSlides(getDefaultSlides())
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Refresh settings - useful for real-time sync
   */
  const refreshSettings = useCallback(async () => {
    await loadSettings()
  }, [loadSettings])

  /**
   * Set up Socket.io for real-time category updates
   * Also keep polling as fallback (every 30 seconds)
   */
  useEffect(() => {
    loadSettings()

    // Initialize Socket.io for real-time category updates
    let socket = null
    try {
      const socketUrl = import.meta.env.VITE_SOCKET_URL
      if (!socketUrl) {
        console.warn('⚠️ VITE_SOCKET_URL not configured, using polling only')
      } else {
        socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          upgrade: true, // Allow upgrade from polling to websocket
          forceNew: false, // Reuse connection
          withCredentials: true, // Send cookies for authentication
          multiplex: true, // Allow multiple connections
        })

        socket.on('connect', () => {
          console.log('✅ [SettingsContext] Connected to Socket.IO:', socket.id)
          // Identify as frontend client
          socket.emit('identify', { role: 'frontend' })
          // Also emit client-type for compatibility
          socket.emit('client-type', 'frontend')
        })

        socket.on('categories:updated', (data) => {
          console.log('🔄 [SettingsContext] Received category update:', data)
          // Handle both array of category objects and array of category names
          let updatedCategories = []
          if (Array.isArray(data.categories)) {
            updatedCategories = data.categories
          } else if (Array.isArray(data)) {
            updatedCategories = data
          }
          setCategories(updatedCategories)
        })

        socket.on('categories:changed', (data) => {
          console.log('🔄 [SettingsContext] Categories changed:', data)
          let updatedCategories = []
          if (Array.isArray(data.categories)) {
            updatedCategories = data.categories
          } else if (Array.isArray(data)) {
            updatedCategories = data
          }
          setCategories(updatedCategories)
        })

        socket.on('disconnect', () => {
          console.warn('⚠️ [SettingsContext] Socket.IO disconnected, will retry polling')
        })

        socket.on('connect_error', (error) => {
          console.warn('⚠️ [SettingsContext] Socket.IO connection error:', error?.message)
        })

        socket.on('error', (error) => {
          console.warn('⚠️ [SettingsContext] Socket.IO error:', error)
        })
      }
    } catch (error) {
      console.warn('⚠️ Socket.io initialization failed:', error.message)
    }

    // Keep polling as fallback (every 30 seconds)
    const pollInterval = setInterval(loadSettings, 30000)

    return () => {
      if (pollInterval) clearInterval(pollInterval)
      if (socket) {
        socket.off('categories:updated')
        socket.off('categories:changed')
        socket.off('connect')
        socket.off('disconnect')
        socket.off('connect_error')
        socket.off('error')
        socket.disconnect()
      }
    }
  }, [loadSettings])

  const value = {
    heroSlides,
    categories,
    shopInfo,
    systemSettings,
    loading,
    error,
    refreshSettings,
    loadSettings,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/**
 * Default hero slides for fallback
 */
function getDefaultSlides() {
  return [
    {
      id: 1,
      title: 'Discover Premium Quality',
      subtitle: 'Exclusive collection of handpicked products',
      image: '/images/hero-1.jpg',
      link: '/products',
      ctaText: 'Shop Now',
      badge: 'New Arrival',
      discount: '30% OFF',
    },
    {
      id: 2,
      title: 'Limited Time Offer',
      subtitle: 'Up to 50% discount on selected items',
      image: '/images/hero-2.jpg',
      link: '/products',
      ctaText: 'Explore Deal',
      badge: 'Hot Deal',
      discount: '50% OFF',
    },
    {
      id: 3,
      title: 'Free Shipping',
      subtitle: 'On orders above ৳500 in Dhaka',
      image: '/images/hero-3.jpg',
      link: '/products',
      ctaText: 'Shop Collection',
      badge: 'Free Shipping',
      discount: 'Free',
    },
  ]
}

/**
 * Custom hook to use settings context
 */
export const useSettings = () => {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
