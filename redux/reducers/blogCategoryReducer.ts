import { createReducer } from "@reduxjs/toolkit";
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  toggleBlogCategoryStatus,
} from "../actions/blogCategoryActions";

interface BlogCategoryState {
  categories: any[];
  currentCategory: any | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: BlogCategoryState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  message: null,
};

export const blogCategoryReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Blog Categories
    .addCase(getAllBlogCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllBlogCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories;
      state.error = null;
    })
    .addCase(getAllBlogCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Blog Category by ID
    .addCase(getBlogCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getBlogCategoryById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCategory = action.payload.category;
      state.error = null;
    })
    .addCase(getBlogCategoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Blog Category
    .addCase(createBlogCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createBlogCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories.unshift(action.payload.category);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createBlogCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Blog Category
    .addCase(updateBlogCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateBlogCategory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.categories.findIndex(category => category._id === action.payload.category._id);
      if (index !== -1) {
        state.categories[index] = action.payload.category;
      }
      if (state.currentCategory && state.currentCategory._id === action.payload.category._id) {
        state.currentCategory = action.payload.category;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateBlogCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Delete Blog Category
    .addCase(deleteBlogCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteBlogCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(category => category._id !== action.payload.id);
      if (state.currentCategory && state.currentCategory._id === action.payload.id) {
        state.currentCategory = null;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteBlogCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Toggle Blog Category Status
    .addCase(toggleBlogCategoryStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleBlogCategoryStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.categories.findIndex(category => category._id === action.payload.category._id);
      if (index !== -1) {
        state.categories[index] = action.payload.category;
      }
      if (state.currentCategory && state.currentCategory._id === action.payload.category._id) {
        state.currentCategory = action.payload.category;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(toggleBlogCategoryStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default blogCategoryReducer;
