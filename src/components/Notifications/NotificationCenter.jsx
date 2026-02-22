import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react'
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} from '../../store/slices/notificationSlice'
import './NotificationCenter.css'

/**
 * NOTIFICATION CENTER
 * Displays backend notifications with toast animations
 * Also maintains global window.showNotification for client-side toasts
 */

export const NotificationCenter = () => {
  const dispatch = useDispatch()
  const { notifications, stats, loading } = useSelector((state) => state.notifications)
  const { user } = useSelector((state) => state.auth)
  const [localToasts, setLocalToasts] = useState([])
  const [showPanel, setShowPanel] = useState(false)

  // Fetch notifications on mount and when user logs in
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications())
    }
  }, [dispatch, user?.id])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user?.id) return

    const pollInterval = setInterval(() => {
      dispatch(fetchNotifications())
    }, 30000)

    return () => clearInterval(pollInterval)
  }, [dispatch, user?.id])

  // Show a local toast notification (client-side only)
  const showNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now()
    const notification = { id, message, type }

    setLocalToasts((prev) => [...prev, notification])

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    return id
  }

  // Dismiss local toast
  const dismissToast = (id) => {
    setLocalToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Handle notification click - mark as read
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      dispatch(markNotificationAsRead(notification.id))
    }
  }

  // Handle delete
  const handleDelete = (notificationId, e) => {
    e.stopPropagation()
    dispatch(deleteNotification(notificationId))
  }

  // Expose global notification function for backward compatibility
  useEffect(() => {
    window.showNotification = showNotification
    return () => {
      delete window.showNotification
    }
  }, [])

  return (
    <>
      {/* Notification Bell Icon (Header) */}
      <div className="notification-bell-container">
        <button
          className="notification-bell"
          onClick={() => setShowPanel(!showPanel)}
          title="Notifications"
        >
          <Bell size={20} />
          {stats.unread > 0 && <span className="notification-badge">{stats.unread}</span>}
        </button>
      </div>

      {/* Notification Panel */}
      {showPanel && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <h3>Notifications ({stats.unread} unread)</h3>
            {stats.unread > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={() => dispatch(markAllNotificationsAsRead())}
              >
                Mark all as read
              </button>
            )}
            <button className="close-panel-btn" onClick={() => setShowPanel(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="notification-list">
            {loading && <div className="notification-loading">Loading...</div>}

            {!loading && notifications.length === 0 && (
              <div className="notification-empty">
                <Info size={32} />
                <p>No notifications yet</p>
              </div>
            )}

            {!loading &&
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onDelete={(e) => handleDelete(notification.id, e)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Local Toast Notifications (Client-side) */}
      <div className="notification-container fixed top-4 right-4 z-50 pointer-events-none">
        {localToasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </>
  )
}

/**
 * Individual Notification Item for Panel
 */
const NotificationItem = ({ notification, onClick, onDelete }) => {
  const getIcon = () => {
    const typeMap = {
      order: <CheckCircle size={20} />,
      promotion: <AlertTriangle size={20} />,
      warning: <AlertCircle size={20} />,
      info: <Info size={20} />,
    }
    return typeMap[notification.type] || <Info size={20} />
  }

  const typeClass = notification.type || 'info'
  const readClass = notification.is_read ? 'read' : 'unread'

  return (
    <div className={`notification-item ${typeClass} ${readClass}`} onClick={onClick}>
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        <h4>{notification.title || 'Notification'}</h4>
        <p>{notification.message}</p>
        <span className="notification-time">
          {new Date(notification.created_at).toLocaleString()}
        </span>
      </div>
      <button className="notification-delete" onClick={onDelete} title="Delete">
        <X size={16} />
      </button>
    </div>
  )
}

/**
 * Individual Toast Component (Local/Client-side)
 */
const Toast = ({ id, message, type = 'info', onDismiss }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'warning':
        return <AlertTriangle size={20} />
      case 'info':
      default:
        return <Info size={20} />
    }
  }

  const getStyles = () => {
    const baseStyles = 'px-4 py-3 rounded-xl backdrop-blur-sm flex items-center gap-3 '
    const shadowStyles = 'shadow-lg hover:shadow-xl transition-shadow'

    switch (type) {
      case 'success':
        return baseStyles + 'bg-green-500/90 dark:bg-green-600/90 text-white ' + shadowStyles
      case 'error':
        return baseStyles + 'bg-red-500/90 dark:bg-red-600/90 text-white ' + shadowStyles
      case 'warning':
        return baseStyles + 'bg-orange-500/90 dark:bg-orange-600/90 text-white ' + shadowStyles
      case 'info':
      default:
        return baseStyles + 'bg-blue-500/90 dark:bg-blue-600/90 text-white ' + shadowStyles
    }
  }

  return (
    <div
      key={id}
      className={`toast-notification ${type} pointer-events-auto mb-3 animate-slide-in`}
    >
      <div className={getStyles()}>
        <div className="flex-shrink-0 text-xl">{getIcon()}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-1
            transition-colors duration-200"
          aria-label="Dismiss notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default NotificationCenter
