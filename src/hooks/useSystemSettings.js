import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'

// Default fallback settings
const DEFAULT_SETTINGS = {
  shipping: {
    freeShippingEnabled: false,
    freeShippingThreshold: 5000,
    standardShippingCost: 100,
    expressShippingCost: 200,
    shippingZones: [
      { id: 1, name: 'Chattogram', cost: 60, deliveryDays: '2-3 days' },
      { id: 2, name: 'All Other Districts', cost: 100, deliveryDays: '3-5 days' },
    ],
  },
  pricing: {
    currency: 'BDT',
    taxRate: 0,
    taxMode: 'exclusive',
  },
  inventory: {
    lowStockThreshold: 10,
    allowBackorders: true,
    backorderDays: 7,
    minOrderQuantity: 1,
    maxOrderQuantity: 100,
  },
  paymentMethods: [
    { id: 'bkash', name: 'bKash', enabled: true },
    { id: 'nagad', name: 'Nagad', enabled: true },
    { id: 'rocket', name: 'Rocket', enabled: false },
    { id: 'cod', name: 'Cash on Delivery', enabled: true },
  ],
  returns: {
    returnEnabled: true,
    returnWindowDays: 30,
    refundProcessingDays: 5,
    restockingFee: 5,
  },
  promotions: [],
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        // Add cache-bust parameter to always get fresh settings
        const response = await axiosInstance.get(`/admin/settings/shipping?_t=${Date.now()}`)
        const data = response.data?.data || {}

        console.log('✅ [useSystemSettings] Settings loaded:', {
          taxRate: data.pricing?.taxRate,
          freeShipping: data.shipping?.freeShippingEnabled,
          standardCost: data.shipping?.standardShippingCost,
        })

        // Merge fetched data with defaults to ensure all required fields exist
        const mergedSettings = {
          shipping: {
            ...DEFAULT_SETTINGS.shipping,
            ...data.shipping,
          },
          pricing: {
            ...DEFAULT_SETTINGS.pricing,
            ...data.pricing,
          },
          inventory: {
            ...DEFAULT_SETTINGS.inventory,
            ...data.inventory,
          },
          paymentMethods: data.paymentMethods || DEFAULT_SETTINGS.paymentMethods,
          returns: {
            ...DEFAULT_SETTINGS.returns,
            ...data.returns,
          },
          promotions: data.promotions || DEFAULT_SETTINGS.promotions,
        }

        setSettings(mergedSettings)
        setError(null)
      } catch (error) {
        console.error('❌ [useSystemSettings] Failed to fetch settings:', error?.message)
        console.warn('⚠️ [useSystemSettings] Using default settings as fallback')
        setError(error?.message || 'Failed to fetch settings')
        // Use defaults on error
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}

export default useSystemSettings
