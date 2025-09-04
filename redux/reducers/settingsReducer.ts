import { createReducer } from "@reduxjs/toolkit";
import {
  getSettings,
  getSettingsAdmin,
  createSettings,
  updateSettings,
  deleteSettings,
  getSettingsStats,
} from "../actions/settingsActions";

interface SettingsState {
  settings: any;
  stats: any;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: SettingsState = {
  settings: null,
  stats: null,
  loading: false,
  error: null,
  message: null,
};

export const settingsReducer = createReducer(initialState, (builder) => {
  builder
    // Get Settings (Public)
    .addCase(getSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload.settings;
      state.error = null;
    })
    .addCase(getSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Settings Admin
    .addCase(getSettingsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSettingsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload.settings;
      state.error = null;
    })
    .addCase(getSettingsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Settings
    .addCase(createSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload.settings;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Settings
    .addCase(updateSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload.settings;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Delete Settings
    .addCase(deleteSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = null;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Settings Stats
    .addCase(getSettingsStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSettingsStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.error = null;
    })
    .addCase(getSettingsStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default settingsReducer;
