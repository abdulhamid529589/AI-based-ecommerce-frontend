import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios'

export const useSystemSettings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/content/global')
        const data = response.data?.data || {}

        setSettings({
          shipping: data.shipping || {
            freeShippingEnabled: true,
            freeShippingThreshold: 5000,
            standardShippingCost: 100,
            expressShippingCost: 200,
            shippingZones: [
              { id: 1, name: 'Dhaka', cost: 50, deliveryDays: '1-2 days' },
              { id: 2, name: 'Other Cities', cost: 150, deliveryDays: '3-5 days' },
            ],
          },
          pricing: data.pricing || {
            currency: 'BDT',
            taxRate: 15,
            taxMode: 'inclusive',
          },
          inventory: data.inventory || {
            lowStockThreshold: 10,
            allowBackorders: true,
            backorderDays: 7,
            minOrderQuantity: 1,
            maxOrderQuantity: 100,
          },
          paymentMethods: data.paymentMethods || [
            { id: 'bkash', name: 'bKash', enabled: true },
            { id: 'nagad', name: 'Nagad', enabled: true },
            { id: 'rocket', name: 'Rocket', enabled: false },
            { id: 'cod', name: 'Cash on Delivery', enabled: true },
          ],
          returns: data.returns || {
            returnEnabled: true,
            returnWindowDays: 30,
            refundProcessingDays: 5,
            restockingFee: 5,
          },
          promotions: data.promotions || [],
        })
        setError(null)
      } catch (error) {
        console.error('Failed to fetch system settings:', error)
        setError(error.message)
        // Set default settings on error
        setSettings({
          shipping: {
            freeShippingEnabled: true,
            freeShippingThreshold: 5000,
            standardShippingCost: 100,
            expressShippingCost: 200,
          },
          pricing: {
            currency: 'BDT',
            taxRate: 15,
            taxMode: 'inclusive',
          },
          inventory: {
            lowStockThreshold: 10,
            allowBackorders: true,
            backorderDays: 7,
          },
          paymentMethods: [],
          returns: {
            returnEnabled: true,
            returnWindowDays: 30,
            refundProcessingDays: 5,
            restockingFee: 5,
          },
          promotions: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}

export default useSystemSettings
