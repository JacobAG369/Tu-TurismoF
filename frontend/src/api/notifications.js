import api from './axios';

export const notificationsApi = {
  /**
   * Get all notifications for authenticated user
   */
  getNotifications: async () => {
    const response = await api.get('/notificaciones');
    return response.data.data || [];
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notificaciones/${notificationId}/read`);
    return response.data.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await api.patch('/notificaciones/read-all');
    return response.data.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notificaciones/${notificationId}`);
    return response.data.data;
  },

  /**
   * Delete all notifications
   */
  deleteAllNotifications: async () => {
    const response = await api.delete('/notificaciones');
    return response.data.data;
  },
};
