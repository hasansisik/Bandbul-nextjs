import { createReducer } from "@reduxjs/toolkit";
import {
  getAllExperienceLevels,
  getExperienceLevelById,
  createExperienceLevel,
  updateExperienceLevel,
  deleteExperienceLevel,
  toggleExperienceLevelStatus,
} from "../actions/experienceLevelActions";

interface ExperienceLevelState {
  experienceLevels: any[];
  currentExperienceLevel: any;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: ExperienceLevelState = {
  experienceLevels: [],
  currentExperienceLevel: null,
  loading: false,
  error: null,
  message: null,
};

export const experienceLevelReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Experience Levels
    .addCase(getAllExperienceLevels.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllExperienceLevels.fulfilled, (state, action) => {
      state.loading = false;
      state.experienceLevels = action.payload.experienceLevels;
      state.error = null;
    })
    .addCase(getAllExperienceLevels.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Experience Level By ID
    .addCase(getExperienceLevelById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getExperienceLevelById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentExperienceLevel = action.payload.experienceLevel;
      state.error = null;
    })
    .addCase(getExperienceLevelById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Experience Level
    .addCase(createExperienceLevel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createExperienceLevel.fulfilled, (state, action) => {
      state.loading = false;
      state.experienceLevels.push(action.payload.experienceLevel);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createExperienceLevel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Experience Level
    .addCase(updateExperienceLevel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateExperienceLevel.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.experienceLevels.findIndex(
        (level) => level._id === action.payload.experienceLevel._id
      );
      if (index !== -1) {
        state.experienceLevels[index] = action.payload.experienceLevel;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateExperienceLevel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Delete Experience Level
    .addCase(deleteExperienceLevel.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteExperienceLevel.fulfilled, (state, action) => {
      state.loading = false;
      state.experienceLevels = state.experienceLevels.filter(
        (level) => level._id !== action.payload.id
      );
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteExperienceLevel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Toggle Experience Level Status
    .addCase(toggleExperienceLevelStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleExperienceLevelStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.experienceLevels.findIndex(
        (level) => level._id === action.payload.experienceLevel._id
      );
      if (index !== -1) {
        state.experienceLevels[index] = action.payload.experienceLevel;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(toggleExperienceLevelStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default experienceLevelReducer;

