import { createReducer } from "@reduxjs/toolkit";
import {
  getAllInstruments,
  getInstrumentById,
  createInstrument,
  updateInstrument,
  deleteInstrument,
  toggleInstrumentStatus,
} from "../actions/instrumentActions";

interface InstrumentState {
  instruments: any[];
  currentInstrument: any;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: InstrumentState = {
  instruments: [],
  currentInstrument: null,
  loading: false,
  error: null,
  message: null,
};

export const instrumentReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Instruments
    .addCase(getAllInstruments.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllInstruments.fulfilled, (state, action) => {
      state.loading = false;
      state.instruments = action.payload.instruments;
      state.error = null;
    })
    .addCase(getAllInstruments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Instrument By ID
    .addCase(getInstrumentById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getInstrumentById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentInstrument = action.payload.instrument;
      state.error = null;
    })
    .addCase(getInstrumentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Create Instrument
    .addCase(createInstrument.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createInstrument.fulfilled, (state, action) => {
      state.loading = false;
      state.instruments.push(action.payload.instrument);
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createInstrument.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Instrument
    .addCase(updateInstrument.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateInstrument.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.instruments.findIndex(
        (instrument) => instrument._id === action.payload.instrument._id
      );
      if (index !== -1) {
        state.instruments[index] = action.payload.instrument;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateInstrument.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Delete Instrument
    .addCase(deleteInstrument.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteInstrument.fulfilled, (state, action) => {
      state.loading = false;
      state.instruments = state.instruments.filter(
        (instrument) => instrument._id !== action.payload.id
      );
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteInstrument.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Toggle Instrument Status
    .addCase(toggleInstrumentStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleInstrumentStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.instruments.findIndex(
        (instrument) => instrument._id === action.payload.instrument._id
      );
      if (index !== -1) {
        state.instruments[index] = action.payload.instrument;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(toggleInstrumentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default instrumentReducer;
