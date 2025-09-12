import { createReducer } from "@reduxjs/toolkit";
import {
  getUserNotifications,
  getNotificationById,
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
      state.notifications = action.payload.notifications;
      state.pagination = action.payload.pagination;
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
      state.stats = action.payload.stats;
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
    });
});

export default notificationReducer;
