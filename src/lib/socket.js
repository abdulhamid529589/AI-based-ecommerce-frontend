import io from 'socket.io-client'

/**
 * Socket.io client for real-time updates
 * Handles category updates and other real-time events
 * With comprehensive error handling and logging
 */

let socket = null

/**
 * Enhanced logging for frontend socket debugging
 */
const logSocket = {
  connect: (msg, data) => console.log(`✅ [Socket] ${msg}`, data || ''),
  error: (msg, error) => console.error(`❌ [Socket] ${msg}`, error || ''),
  warn: (msg, data) => console.warn(`⚠️ [Socket] ${msg}`, data || ''),
  debug: (msg, data) => console.debug(`🔍 [Socket] ${msg}`, data || ''),
}

/**
 * Initialize Socket.io connection
 * @param {string} url - Server URL (default: auto-detect)
 * @param {function} onCategoryUpdate - Callback when categories are updated
 */
export const initializeSocket = (url = null, onCategoryUpdate = null) => {
  // Use environment variable URL or auto-detect
  const serverUrl =
    url ||
    import.meta.env.VITE_SOCKET_URL ||
    `${window.location.protocol}//${window.location.hostname}:${window.location.port === '5174' ? '5000' : window.location.port}`

  if (socket && socket.connected) {
    logSocket.debug('Socket already connected', { socketId: socket.id })
    return socket
  }

  logSocket.connect(`Connecting to Socket.io at ${serverUrl}`, {
    url: serverUrl,
    env: import.meta.env.VITE_SOCKET_URL,
  })

  try {
    socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      forceNew: false,
      multiplex: true,
      withCredentials: true,
      timeout: 10000, // 10 second connection timeout
    })

    /**
     * Connection events
     */
    socket.on('connect', () => {
      logSocket.connect(`Connected to Socket.io`, { socketId: socket.id })
    })

    socket.on('connect_error', (error) => {
      logSocket.error(`Connection error`, {
        message: error.message,
        type: error.type,
        code: error.code,
      })
    })

    socket.on('disconnect', (reason) => {
      logSocket.warn(`Disconnected from Socket.io`, { reason })
    })

    socket.on('reconnect_attempt', () => {
      logSocket.debug('Attempting to reconnect')
    })

    socket.on('reconnect', () => {
      logSocket.connect('Successfully reconnected')
    })

    socket.on('error', (error) => {
      logSocket.error('Socket error', error)
    })

    /**
     * Real-time category updates
     */
    socket.on('categories:updated', (data) => {
      logSocket.debug('Categories update received', {
        count: data?.categories?.length,
        event: data?.event,
      })
      if (onCategoryUpdate && typeof onCategoryUpdate === 'function') {
        try {
          onCategoryUpdate(data.categories)
        } catch (error) {
          logSocket.error('Error in onCategoryUpdate callback', error)
        }
      }
    })

    socket.on('categories:changed', (data) => {
      logSocket.debug('Categories changed', {
        action: data?.action,
        category: data?.category?.name,
      })
      if (onCategoryUpdate && typeof onCategoryUpdate === 'function') {
        try {
          onCategoryUpdate(data)
        } catch (error) {
          logSocket.error('Error in onCategoryUpdate callback', error)
        }
      }
    })

    return socket
  } catch (error) {
    logSocket.error('Failed to initialize Socket.io', error)
    throw error
  }
}

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
