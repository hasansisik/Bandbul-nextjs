import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface Instrument {
  _id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstrumentPayload {
  name: string;
}

export interface UpdateInstrumentPayload {
  name?: string;
  active?: boolean;
}

// Get all instruments (public - no authentication required)
export const getAllInstruments = createAsyncThunk(
  "instruments/getAllInstruments",
  async (params: { active?: boolean } = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.active !== undefined) {
        queryParams.append('active', params.active.toString());
      }
      
      const response = await axios.get(`${server}/instruments?${queryParams.toString()}`);
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

// Get single instrument by ID (public)
export const getInstrumentById = createAsyncThunk(
  "instruments/getInstrumentById",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/instruments/${id}`);
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

// Create instrument (admin only)
export const createInstrument = createAsyncThunk(
  "instruments/createInstrument",
  async (formData: CreateInstrumentPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/instruments`,
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

// Update instrument (admin only)
export const updateInstrument = createAsyncThunk(
  "instruments/updateInstrument",
  async ({ id, formData }: { id: string; formData: UpdateInstrumentPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/instruments/${id}`,
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

// Delete instrument (admin only)
export const deleteInstrument = createAsyncThunk(
  "instruments/deleteInstrument",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/instruments/${id}`,
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

// Toggle instrument status (admin only)
export const toggleInstrumentStatus = createAsyncThunk(
  "instruments/toggleInstrumentStatus",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/instruments/${id}/toggle-status`,
        {},
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
