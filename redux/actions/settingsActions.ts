import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface SettingsData {
  logo: {
    light: string;
    dark: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string;
    author: string;
  };
  header: {
    mainMenu: Array<{
      name: string;
      href: string;
    }>;
    categories: string[];
  };
  footer: {
    main: Array<{
      name: string;
      href: string;
    }>;
    listings: string[];
    support: Array<{
      name: string;
      href: string;
    }>;
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    };
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    workingHours: string;
    companyDescription: string;
  };
  seo: {
    googleAnalytics: string;
    googleTagManager: string;
    metaTags: string;
  };

}

export interface UpdateSettingsPayload {
  logo?: {
    light?: string;
    dark?: string;
  };
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
  };
  header?: {
    mainMenu?: Array<{
      name: string;
      href: string;
    }>;
    categories?: string[];
  };
  footer?: {
    main?: Array<{
      name: string;
      href: string;
    }>;
    listings?: string[];
    support?: Array<{
      name: string;
      href: string;
    }>;
    social?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    workingHours?: string;
    companyDescription?: string;
  };
  seo?: {
    googleAnalytics?: string;
    googleTagManager?: string;
    metaTags?: string;
  };

}

// Get settings (public - no authentication required)
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async (_, thunkAPI) => {
    try {
      // Check if settings already exist in the state
      const state = thunkAPI.getState() as any;
      if (state.settings?.settings && !state.settings?.loading) {
        // Return existing settings without making API call
        return { settings: state.settings.settings };
      }

      const response = await axios.get(`${server}/settings/public`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get settings for admin (admin only)
export const getSettingsAdmin = createAsyncThunk(
  "settings/getSettingsAdmin",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/settings`, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create settings (admin only)
export const createSettings = createAsyncThunk(
  "settings/createSettings",
  async (formData: SettingsData, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/settings`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update settings (admin only)
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async ({ id, formData }: { id: string; formData: UpdateSettingsPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/settings/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Delete settings (admin only)
export const deleteSettings = createAsyncThunk(
  "settings/deleteSettings",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/settings/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get settings statistics (admin only)
export const getSettingsStats = createAsyncThunk(
  "settings/getSettingsStats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${server}/settings/stats`,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
