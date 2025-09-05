import { createReducer } from "@reduxjs/toolkit";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  getRecentBlogs,
  searchBlogs,
} from "../actions/blogActions";

interface BlogState {
  blogs: any[];
  currentBlog: any | null;
  categories: any[];
  recentBlogs: any[];
  searchResults: any[];
  blogStats: any;
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

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  categories: [],
  recentBlogs: [],
  searchResults: [],
  blogStats: null,
  loading: false,
  error: null,
  message: null,
  pagination: null,
};

export const blogReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Blogs
    .addCase(getAllBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload.blogs;
      state.blogStats = action.payload.stats;
      state.pagination = action.payload.pagination;
      state.error = null;
    })
    .addCase(getAllBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Blog by ID
    .addCase(getBlogById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getBlogById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentBlog = action.payload.blog;
      state.error = null;
    })
    .addCase(getBlogById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    
    // Create Blog
    .addCase(createBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(createBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs.unshift(action.payload.blog);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    
    // Update Blog
    .addCase(updateBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(updateBlog.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.blogs.findIndex(blog => blog._id === action.payload.blog._id);
      if (index !== -1) {
        state.blogs[index] = action.payload.blog;
      }
      if (state.currentBlog && state.currentBlog._id === action.payload.blog._id) {
        state.currentBlog = action.payload.blog;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    
    // Delete Blog
    .addCase(deleteBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(deleteBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload.id);
      if (state.currentBlog && state.currentBlog._id === action.payload.id) {
        state.currentBlog = null;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    
    // Get Blog Categories
    .addCase(getBlogCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getBlogCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories;
      state.error = null;
    })
    .addCase(getBlogCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Recent Blogs
    .addCase(getRecentBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getRecentBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.recentBlogs = action.payload.blogs;
      state.error = null;
    })
    .addCase(getRecentBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Search Blogs
    .addCase(searchBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(searchBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.blogs;
      state.pagination = action.payload.pagination;
      state.error = null;
    })
    .addCase(searchBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default blogReducer;
