import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: string;
  categorySlug: string;
  tags: string[];
  image: string;
  featured?: boolean;
  status?: string;
  createdBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogPayload {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags?: string[];
  image?: string;
  featured?: boolean;
  status?: string;
}

export interface UpdateBlogPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  tags?: string[];
  image?: string;
  featured?: boolean;
  status?: string;
  readTime?: string;
}

export interface BlogFilters {
  category?: string;
  featured?: string;
  search?: string;
  page?: string;
  limit?: string;
  sort?: string;
  [key: string]: string | undefined;
}

// Get All Blogs (Public)
export const getAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (params: BlogFilters = {}, thunkAPI) => {
    try {
      // Filter out undefined values before creating URLSearchParams
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/blogs${queryString ? `?${queryString}` : ''}`;
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

// Get Blog by ID (Public)
export const getBlogById = createAsyncThunk(
  "blog/getBlogById",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/blogs/${id}`);
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

// Get Blog by Slug (Public)
export const getBlogBySlug = createAsyncThunk(
  "blog/getBlogBySlug",
  async (slug: string, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/blogs/slug/${slug}`);
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

// Create Blog (Admin only)
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (formData: CreateBlogPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/blogs`,
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

// Update Blog (Admin only)
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, formData }: { id: string; formData: UpdateBlogPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/blogs/${id}`,
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

// Delete Blog (Admin only)
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/blogs/${id}`,
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

// Get Blog Categories (Public)
export const getBlogCategories = createAsyncThunk(
  "blog/getBlogCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/blogs/categories`);
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

// Get Recent Blogs (Public)
export const getRecentBlogs = createAsyncThunk(
  "blog/getRecentBlogs",
  async (limit: number = 6, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/blogs/recent?limit=${limit}`);
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

// Search Blogs (Public)
export const searchBlogs = createAsyncThunk(
  "blog/searchBlogs",
  async (params: { q: string; page?: string; limit?: string }, thunkAPI) => {
    try {
      // Filter out undefined values before creating URLSearchParams
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const response = await axios.get(`${server}/blogs/search?${queryString}`);
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
