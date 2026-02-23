import io from 'socket.io-client'

/**
 * Socket.io client for real-time updates
 * Handles category updates and other real-time events
 */

let socket = null

/**
 * Initialize Socket.io connection
 * @param {string} url - Server URL (default: auto-detect)
 * @param {function} onCategoryUpdate - Callback when categories are updated
 */
export const initializeSocket = (url = null, onCategoryUpdate = null) => {
  // Auto-detect server URL if not provided
  const serverUrl =
    url ||
    `${window.location.protocol}//${window.location.hostname}:${window.location.port === '5174' ? '5000' : window.location.port}`

  if (socket && socket.connected) {
    console.log('🔌 Socket.io already connected')
    return socket
  }

  console.log(`🔌 Connecting to Socket.io at ${serverUrl}...`)

  socket = io(serverUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  })

  /**
   * Connection events
   */
  socket.on('connect', () => {
    console.log(`✅ Socket.io connected: ${socket.id}`)
  })

  socket.on('disconnect', (reason) => {
    console.warn(`⚠️ Socket.io disconnected: ${reason}`)
  })

  socket.on('connect_error', (error) => {
    console.error(`❌ Socket.io connection error:`, error)
  })

  /**
   * Real-time category updates
   */
  socket.on('categories:updated', (data) => {
    console.log('📢 [Socket.io] Categories updated from server:', data)
    if (onCategoryUpdate && typeof onCategoryUpdate === 'function') {
      onCategoryUpdate(data.categories)
    }
  })

  return socket
}

/**
 * Get current socket instance
 */
export const getSocket = () => {
  if (!socket) {
    console.warn('⚠️ Socket.io not initialized. Call initializeSocket() first.')
  }
  return socket
}

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect()
    console.log('🔌 Socket.io disconnected')
  }
}

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => {
  return socket && socket.connected
}

/**
 * Listen for custom events
 */
export const onSocketEvent = (eventName, callback) => {
  if (!socket) {
    console.warn('⚠️ Socket.io not initialized')
    return
  }
  socket.on(eventName, callback)
}

/**
 * Emit custom events
 */
export const emitSocketEvent = (eventName, data) => {
  if (!socket || !socket.connected) {
    console.warn('⚠️ Socket.io not connected')
    return
  }
  socket.emit(eventName, data)
}

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
  onSocketEvent,
  emitSocketEvent,
}
