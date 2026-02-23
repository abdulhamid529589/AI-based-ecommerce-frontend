import { useSocket } from '../hooks/useSocket'
import { useCallback, useEffect } from 'react'

/**
 * Hook for real-time category synchronization on frontend
 * Automatically refreshes categories when they change on the server
 *
 * Usage in SettingsContext:
 * const { setupCategorySync } = useCategorySync(setCategories)
 * setupCategorySync(socket)
 */
export const useCategorySync = (setCategories) => {
  const setupCategorySync = useCallback(
    (socket) => {
      if (!socket) return

      // Listen for category updates from dashboard
      socket.on('categories:updated', (data) => {
        console.log('📦 [Frontend] Categories updated via Socket.IO:', data)
        setCategories(data.categories || [])
      })

      // Listen for individual category changes
      socket.on('categories:changed', (data) => {
        console.log(`📦 [Frontend] Category ${data.action}:`, data.category)
        // Category list will be re-fetched, this is just a notification
        // In a more advanced implementation, you could update state directly
      })

      return () => {
        socket.off('categories:updated')
        socket.off('categories:changed')
      }
    },
    [setCategories],
  )

  return { setupCategorySync }
}

/**
 * Hook for real-time product synchronization on frontend
 * Updates product list when products change
 */
export const useProductSync = (setProducts) => {
  const setupProductSync = useCallback(
    (socket) => {
      if (!socket) return

      // Listen for product updates
      socket.on('products:changed', (data) => {
        console.log(`📦 [Frontend] Product ${data.action}:`, data.product)
        // Trigger product list refresh
        // In a real app, you'd dispatch Redux action to refresh products
      })

      // Listen for stock updates
      socket.on('stock:updated', (data) => {
        console.log(`📦 [Frontend] Stock updated for product ${data.productId}:`, data.newStock)
      })

      return () => {
        socket.off('products:changed')
        socket.off('stock:updated')
      }
    },
    [setProducts],
  )

  return { setupProductSync }
}

/**
 * Hook for real-time order notifications on frontend
 * Notifies customers when their order status changes
 */
export const useOrderNotifications = () => {
  const handleOrderNotification = useCallback((data) => {
    console.log('🛍️ [Frontend] Order notification:', data)
    // Show toast notification to user
    // toast.info(`Your order #${data.orderId} is ${data.status}`)
  }, [])

  const setupOrderNotifications = useCallback(
    (socket) => {
      if (!socket) return

      socket.on('order:notification', handleOrderNotification)

      return () => {
        socket.off('order:notification')
      }
    },
    [handleOrderNotification],
  )

  return { setupOrderNotifications, handleOrderNotification }
}

/**
 * Hook for generic real-time notifications
 */
export const useNotifications = () => {
  const handleNotification = useCallback((data) => {
    console.log('🔔 [Frontend] Notification:', data.message)
    // Show notification to user
  }, [])

  const setupNotifications = useCallback(
    (socket) => {
      if (!socket) return

      socket.on('notification:new', handleNotification)

      return () => {
        socket.off('notification:new')
      }
    },
    [handleNotification],
  )

  return { setupNotifications }
}

export default {
  useCategorySync,
  useProductSync,
  useOrderNotifications,
  useNotifications,
}
