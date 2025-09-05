import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

export interface CreateNotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  listingId?: string;
  conversationId?: string;
  systemAction?: string;
}

export const getUserNotifications = createAsyncThunk(
  "notification/getUserNotifications",
  async (params: NotificationFilters = {}, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Convert all values to strings and filter out undefined values
      const stringParams = Object.fromEntries(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      );
      const queryString = new URLSearchParams(stringParams).toString();
      const url = `${server}/notifications${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);

export const getNotificationById = createAsyncThunk(
  "notification/getNotificationById",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${server}/notifications/${id}`,
        config
      );
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/notifications/${id}/read`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/notifications/read-all`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/notifications/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);

export const getNotificationStats = createAsyncThunk(
  "notification/getNotificationStats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${server}/notifications/stats`,
        config
      );
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (formData: CreateNotificationPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/notifications`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return thunkAPI.rejectWithValue('Sunucu bağlantısında sorun yaşanıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
      
      // Handle mongoose/database errors
      if (error.message && error.message.includes('mongoose')) {
        return thunkAPI.rejectWithValue('Veritabanı bağlantısında geçici bir sorun yaşanıyor. Lütfen tekrar deneyin.');
      }
      
      return thunkAPI.rejectWithValue(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }
);
