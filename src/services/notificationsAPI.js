import { axiosInstance } from '../lib/axios'

const API_PREFIX = '/notifications'

/**
 * Fetch all user notifications
 */
export const fetchNotificationsAPI = async (params = {}) => {
  try {
    const response = await axiosInstance.get(API_PREFIX, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

/**
 * Get notification statistics
 */
export const fetchNotificationStatsAPI = async () => {
  try {
    const response = await axiosInstance.get(`${API_PREFIX}/stats`)
    return response.data
  } catch (error) {
    console.error('Error fetching notification stats:', error)
    throw error
  }
}

/**
 * Mark a single notification as read
 */
export const markNotificationReadAPI = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`${API_PREFIX}/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Mark all notifications as read
 */
export const markAllNotificationsReadAPI = async () => {
  try {
    const response = await axiosInstance.put(`${API_PREFIX}/read-all`)
    return response.data
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Delete a notification
 */
export const deleteNotificationAPI = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(`${API_PREFIX}/${notificationId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

export default {
  fetchNotificationsAPI,
  fetchNotificationStatsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  deleteNotificationAPI,
}
