import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'

/**
 * Notifications Redux Slice
 * Manages backend notifications (order updates, promotions, system messages)
 */

// Fetch user notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications')
      // Handle both paginated and non-paginated responses
      if (response.data.data?.notifications) {
        return response.data.data.notifications || []
      }
      return response.data.data || []
    } catch (error) {
      // Return empty array on error instead of rejecting
      console.warn(
        '⚠️ Failed to fetch notifications:',
        error.response?.data?.message || error.message,
      )
      return []
    }
  },
)

// Fetch notification stats
export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications/stats')
      return response.data.data
    } catch (error) {
      // Return default stats on error
      console.warn(
        '⚠️ Failed to fetch notification stats:',
        error.response?.data?.message || error.message,
      )
      return { total: 0, unread: 0 }
    }
  },
)

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`)
      return notificationId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read')
    }
  },
)

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.put('/notifications/read-all')
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  },
)

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/notifications/${notificationId}`)
      return notificationId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification')
    }
  },
)

const initialState = {
  notifications: [],
  stats: {
    total: 0,
    unread: 0,
    read: 0,
  },
  loading: false,
  error: null,
  lastFetch: null,
  pollInterval: 30000, // Poll every 30 seconds
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add local notification (from toast/UI)
    addLocalNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      state.notifications.unshift(notification)
      state.stats.total += 1
      state.stats.unread += 1
    },
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = []
      state.stats = { total: 0, unread: 0, read: 0 }
    },
    // Set poll interval
    setPollInterval: (state, action) => {
      state.pollInterval = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.lastFetch = new Date().toISOString()

        // Calculate stats
        const unreadCount = action.payload.filter((n) => !n.is_read).length
        state.stats.total = action.payload.length
        state.stats.unread = unreadCount
        state.stats.read = action.payload.length - unreadCount
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch stats
    builder.addCase(fetchNotificationStats.fulfilled, (state, action) => {
      state.stats = action.payload
    })

    // Mark as read
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.is_read = true
        state.stats.unread = Math.max(0, state.stats.unread - 1)
        state.stats.read += 1
      }
    })

    // Mark all as read
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications.forEach((n) => {
        n.is_read = true
      })
      state.stats.unread = 0
      state.stats.read = state.stats.total
    })

    // Delete notification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload)
      if (index !== -1) {
        const wasUnread = !state.notifications[index].is_read
        state.notifications.splice(index, 1)
        state.stats.total -= 1
        if (wasUnread) state.stats.unread -= 1
        else state.stats.read -= 1
      }
    })
  },
})

export const { addLocalNotification, clearAllNotifications, setPollInterval } =
  notificationSlice.actions
export default notificationSlice.reducer
