import { createReducer } from "@reduxjs/toolkit";
import {
  register,
  login,
  loadUser,
  logout,
  verifyEmail,
  againEmail,
  forgotPassword,
  resetPassword,
  editProfile,
  createListing,
  getAllListings,
  getUserListings,
  updateListing,
  deleteListing,
  toggleListingStatus,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getAllUsers,
  deleteUser,
} from "../actions/userActions";

interface UserState {
  users: any[];
  user: any;
  loading: boolean;
  error: string | null;
  isAuthenticated?: boolean;
  message?: string;
  listings: any[];
  allListings: any[];
  userListings: any[];
  listingsLoading: boolean;
  listingsError: string | null;
  categories: any[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  allUsers: any[];
  userStats: any;
  usersLoading: boolean;
  usersError: string | null;
}

const initialState: UserState = {
  users: [],
  user: {},
  loading: false,
  error: null,
  listings: [],
  allListings: [],
  userListings: [],
  listingsLoading: false,
  listingsError: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  allUsers: [],
  userStats: null,
  usersLoading: false,
  usersError: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    // Register
    .addCase(register.pending, (state) => {
      state.loading = true;
    })
    .addCase(register.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Login
    .addCase(login.pending, (state) => {
      state.loading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Load User
    .addCase(loadUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Logout
    .addCase(logout.pending, (state) => {
      state.loading = true;
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.message = action.payload;
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Verify Email
    .addCase(verifyEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(verifyEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Again Email
    .addCase(againEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(againEmail.fulfilled, (state) => {
      state.loading = false;
      state.message = "Email successfully sent again.";
    })
    .addCase(againEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Forgot Password
    .addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
      state.message = "Password reset email sent.";
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Reset Password
    .addCase(resetPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.message = "Password reset successful.";
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Edit Profile
    .addCase(editProfile.pending, (state) => {
      state.loading = true;
    })
    .addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(editProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Listing
    .addCase(createListing.pending, (state) => {
      state.listingsLoading = true;
    })
    .addCase(createListing.fulfilled, (state, action) => {
      state.listingsLoading = false;
      state.userListings.unshift(action.payload.listing);
      state.message = action.payload.message;
    })
    .addCase(createListing.rejected, (state, action) => {
      state.listingsLoading = false;
      state.listingsError = action.payload as string;
    })
    // Get All Listings
    .addCase(getAllListings.pending, (state) => {
      state.listingsLoading = true;
    })
    .addCase(getAllListings.fulfilled, (state, action) => {
      state.listingsLoading = false;
      state.allListings = action.payload.listings;
      state.listings = action.payload.listings;
    })
    .addCase(getAllListings.rejected, (state, action) => {
      state.listingsLoading = false;
      state.listingsError = action.payload as string;
    })
    // Get User Listings
    .addCase(getUserListings.pending, (state) => {
      state.listingsLoading = true;
    })
    .addCase(getUserListings.fulfilled, (state, action) => {
      state.listingsLoading = false;
      state.userListings = action.payload.listings;
    })
    .addCase(getUserListings.rejected, (state, action) => {
      state.listingsLoading = false;
      state.listingsError = action.payload as string;
    })
    // Update Listing
    .addCase(updateListing.pending, (state) => {
      state.listingsLoading = true;
    })
    .addCase(updateListing.fulfilled, (state, action) => {
      state.listingsLoading = false;
      const index = state.userListings.findIndex(listing => listing._id === action.payload.listing._id);
      if (index !== -1) {
        state.userListings[index] = action.payload.listing;
      }
      const allIndex = state.allListings.findIndex(listing => listing._id === action.payload.listing._id);
      if (allIndex !== -1) {
        state.allListings[allIndex] = action.payload.listing;
      }
      state.message = action.payload.message;
    })
    .addCase(updateListing.rejected, (state, action) => {
      state.listingsLoading = false;
      state.listingsError = action.payload as string;
    })
    // Delete Listing
    .addCase(deleteListing.pending, (state) => {
      state.listingsLoading = true;
    })
    .addCase(deleteListing.fulfilled, (state, action) => {
      state.listingsLoading = false;
      state.userListings = state.userListings.filter(listing => listing._id !== action.payload.id);
      state.allListings = state.allListings.filter(listing => listing._id !== action.payload.id);
      state.message = action.payload.message;
    })
    .addCase(deleteListing.rejected, (state, action) => {
      state.listingsLoading = false;
      state.listingsError = action.payload as string;
    })
    // Toggle Listing Status
    .addCase(toggleListingStatus.pending, (state) => {
      state.listingsLoading = true;
    })
    .addCase(toggleListingStatus.fulfilled, (state, action) => {
      state.listingsLoading = false;
      const index = state.userListings.findIndex(listing => listing._id === action.payload.listing._id);
      if (index !== -1) {
        state.userListings[index] = action.payload.listing;
      }
      const allIndex = state.allListings.findIndex(listing => listing._id === action.payload.listing._id);
      if (allIndex !== -1) {
        state.allListings[allIndex] = action.payload.listing;
      }
      state.message = action.payload.message;
    })
    .addCase(toggleListingStatus.rejected, (state, action) => {
      state.listingsLoading = false;
      state.listingsError = action.payload as string;
    })
    // Create Category
    .addCase(createCategory.pending, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(createCategory.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      state.categories.unshift(action.payload.category);
      state.message = action.payload.message;
    })
    .addCase(createCategory.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    })
    // Get All Categories
    .addCase(getAllCategories.pending, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(getAllCategories.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      state.categories = action.payload.categories;
    })
    .addCase(getAllCategories.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    })
    // Update Category
    .addCase(updateCategory.pending, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(updateCategory.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      const index = state.categories.findIndex(category => category._id === action.payload.category._id);
      if (index !== -1) {
        state.categories[index] = action.payload.category;
      }
      state.message = action.payload.message;
    })
    .addCase(updateCategory.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    })
    // Delete Category
    .addCase(deleteCategory.pending, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      state.categories = state.categories.filter(category => category._id !== action.payload.id);
      state.message = action.payload.message;
    })
    .addCase(deleteCategory.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    })
    // Toggle Category Status
    .addCase(toggleCategoryStatus.pending, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      const index = state.categories.findIndex(category => category._id === action.payload.category._id);
      if (index !== -1) {
        state.categories[index] = action.payload.category;
      }
      state.message = action.payload.message;
    })
    .addCase(toggleCategoryStatus.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    })
    // Get All Users
    .addCase(getAllUsers.pending, (state) => {
      state.usersLoading = true;
    })
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.usersLoading = false;
      state.allUsers = action.payload.users;
      state.userStats = action.payload.stats;
      state.message = action.payload.message;
    })
    .addCase(getAllUsers.rejected, (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload as string;
    })
    // Delete User
    .addCase(deleteUser.pending, (state) => {
      state.usersLoading = true;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.usersLoading = false;
      state.allUsers = state.allUsers.filter(user => user._id !== action.payload.id);
      state.message = action.payload.message;
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload as string;
    });
});

export default userReducer;