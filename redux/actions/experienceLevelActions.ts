import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface ExperienceLevel {
  _id: string;
  name: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceLevelPayload {
  name: string;
  order?: number;
}

export interface UpdateExperienceLevelPayload {
  name?: string;
  active?: boolean;
  order?: number;
}

// Get all experience levels (public - no authentication required)
export const getAllExperienceLevels = createAsyncThunk(
  "experienceLevel/getAllExperienceLevels",
  async (params: { active?: boolean } = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.active !== undefined) {
        queryParams.append('active', params.active.toString());
      }
      
      const response = await axios.get(`${server}/experience-levels?${queryParams.toString()}`);
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

// Get single experience level by ID (public)
export const getExperienceLevelById = createAsyncThunk(
  "experienceLevel/getExperienceLevelById",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/experience-levels/${id}`);
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

// Create experience level (admin only)
export const createExperienceLevel = createAsyncThunk(
  "experienceLevel/createExperienceLevel",
  async (formData: CreateExperienceLevelPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/experience-levels`,
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

// Update experience level (admin only)
export const updateExperienceLevel = createAsyncThunk(
  "experienceLevel/updateExperienceLevel",
  async ({ id, formData }: { id: string; formData: UpdateExperienceLevelPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/experience-levels/${id}`,
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

// Delete experience level (admin only)
export const deleteExperienceLevel = createAsyncThunk(
  "experienceLevel/deleteExperienceLevel",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/experience-levels/${id}`,
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

// Toggle experience level status (admin only)
export const toggleExperienceLevelStatus = createAsyncThunk(
  "experienceLevel/toggleExperienceLevelStatus",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/experience-levels/${id}/toggle-status`,
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

