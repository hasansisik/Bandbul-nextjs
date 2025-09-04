import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface BlogCategory {
  _id?: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateBlogCategoryPayload {
  name?: string;
  description?: string;
  active?: boolean;
}

export interface BlogCategoryFilters {
  active?: string;
  [key: string]: string | undefined;
}

// Get All Blog Categories (Public)
export const getAllBlogCategories = createAsyncThunk(
  "blogCategory/getAllBlogCategories",
  async (params: BlogCategoryFilters = {}, thunkAPI) => {
    try {
      // Filter out undefined values before creating URLSearchParams
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/blog-categories${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
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

// Get Blog Category by ID (Public)
export const getBlogCategoryById = createAsyncThunk(
  "blogCategory/getBlogCategoryById",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/blog-categories/${id}`);
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

// Create Blog Category (Admin only)
export const createBlogCategory = createAsyncThunk(
  "blogCategory/createBlogCategory",
  async (formData: CreateBlogCategoryPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/blog-categories`,
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

// Update Blog Category (Admin only)
export const updateBlogCategory = createAsyncThunk(
  "blogCategory/updateBlogCategory",
  async ({ id, formData }: { id: string; formData: UpdateBlogCategoryPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/blog-categories/${id}`,
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

// Delete Blog Category (Admin only)
export const deleteBlogCategory = createAsyncThunk(
  "blogCategory/deleteBlogCategory",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/blog-categories/${id}`,
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

// Toggle Blog Category Status (Admin only)
export const toggleBlogCategoryStatus = createAsyncThunk(
  "blogCategory/toggleBlogCategoryStatus",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/blog-categories/${id}/toggle-status`,
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
