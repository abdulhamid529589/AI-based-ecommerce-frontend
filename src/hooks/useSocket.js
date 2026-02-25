import { useEffect, useRef, useCallback } from 'react'
import io from 'socket.io-client'

/**
 * Custom hook for Socket.io connection management
 * Handles real-time updates for categories, products, orders, etc.
 *
 * Usage:
 * const { socket, isConnected } = useSocket('frontend')
 *
 * // Listen for updates
 * socket.on('categories:updated', (data) => {
 *   console.log('Categories updated:', data)
 * })
 */
export const useSocket = (clientType = 'frontend') => {
  const socketRef = useRef(null)
  const isConnectedRef = useRef(false)

  useEffect(() => {
    // Determine socket server URL
    const socketUrl = import.meta.env.VITE_SOCKET_URL || `${window.location.origin}`

    console.log(`[useSocket] Connecting to ${socketUrl} as ${clientType}`)

    // Create socket connection
    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    // Connection events
    socket.on('connect', () => {
      console.log(`[useSocket] ✅ Connected to Socket.IO server`)
      isConnectedRef.current = true

      // Identify client type to server
      socket.emit('client-type', clientType)
    })

    socket.on('connection-success', (data) => {
      console.log(`[useSocket] 🎉 Connection established:`, data)
    })

    socket.on('disconnect', () => {
      console.log(`[useSocket] ❌ Disconnected from Socket.IO server`)
      isConnectedRef.current = false
    })

    socket.on('error', (error) => {
      console.error(`[useSocket] ⚠️ Socket error:`, error)
    })

    socketRef.current = socket

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [clientType])

  // Get current connection status
  const isConnected = isConnectedRef.current

  // Emit event to server
  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }, [])

  // Listen for event
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }, [])

  // Unlisten for event
  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  }
}

export default useSocket
