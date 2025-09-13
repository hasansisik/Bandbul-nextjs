import { createReducer } from "@reduxjs/toolkit";
import {
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
  createNotification,
} from "../actions/notificationActions";

interface NotificationState {
  notifications: any[];
  currentNotification: any;
  stats: any;
  loading: boolean;
  error: string | null;
  message: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
}

const initialState: NotificationState = {
  notifications: [],
  currentNotification: null,
  stats: null,
  loading: false,
  error: null,
  message: null,
  pagination: null,
};

export const notificationReducer = createReducer(initialState, (builder) => {
  builder
    // Get User Notifications
    .addCase(getUserNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getUserNotifications.fulfilled, (state, action) => {
      state.loading = false;
      // Only update notifications if payload is not null (304 response)
      if (action.payload !== null) {
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      }
      state.error = null;
    })
    .addCase(getUserNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Notification By ID
    .addCase(getNotificationById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getNotificationById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentNotification = action.payload.notification;
      state.error = null;
    })
    .addCase(getNotificationById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Mark As Read
    .addCase(markAsRead.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(markAsRead.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload;
      state.notifications = state.notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      );
      if (state.currentNotification && state.currentNotification._id === id) {
        state.currentNotification.isRead = true;
      }
      // Update stats
      if (state.stats) {
        state.stats.unread = Math.max(0, state.stats.unread - 1);
        state.stats.read = state.stats.read + 1;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(markAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Mark All As Read
    .addCase(markAllAsRead.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(markAllAsRead.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      if (state.currentNotification) {
        state.currentNotification.isRead = true;
      }
      // Update stats
      if (state.stats) {
        state.stats.unread = 0;
        state.stats.read = state.stats.total;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(markAllAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Delete Notification
    .addCase(deleteNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteNotification.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = state.notifications.filter(notification => notification._id !== action.payload.id);
      if (state.currentNotification && state.currentNotification._id === action.payload.id) {
        state.currentNotification = null;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Notification Stats
    .addCase(getNotificationStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getNotificationStats.fulfilled, (state, action) => {
      state.loading = false;
      // Only update stats if payload is not null (304 response)
      if (action.payload !== null) {
        state.stats = action.payload.stats;
      }
      state.error = null;
    })
    .addCase(getNotificationStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Notification
    .addCase(createNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createNotification.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications.unshift(action.payload.notification);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Real-time notification updates
    .addCase('notification/addNotification', (state, action: any) => {
      // Add new notification to the beginning of the list
      state.notifications.unshift(action.payload);
      // Update pagination total
      if (state.pagination) {
        state.pagination.totalItems += 1;
      }
    })
    .addCase('notification/updateStats', (state, action: any) => {
      // Update stats from WebSocket
      state.stats = action.payload;
    });
});

export default notificationReducer;
