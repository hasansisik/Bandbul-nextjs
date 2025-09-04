import { createReducer } from "@reduxjs/toolkit";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  updateContactStatus,
  getContactStats,
} from "../actions/contactActions";

interface ContactState {
  contacts: any[];
  currentContact: any;
  stats: any;
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

const initialState: ContactState = {
  contacts: [],
  currentContact: null,
  stats: null,
  loading: false,
  error: null,
  message: null,
  pagination: null,
};

export const contactReducer = createReducer(initialState, (builder) => {
  builder
    // Create Contact
    .addCase(createContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createContact.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(createContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = null;
    })
    // Get All Contacts
    .addCase(getAllContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.contacts;
      state.pagination = action.payload.pagination;
      state.error = null;
    })
    .addCase(getAllContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Contact By ID
    .addCase(getContactById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getContactById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentContact = action.payload.contact;
      state.error = null;
    })
    .addCase(getContactById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Contact
    .addCase(updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateContact.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.contacts.findIndex(contact => contact._id === action.payload.contact._id);
      if (index !== -1) {
        state.contacts[index] = action.payload.contact;
      }
      if (state.currentContact && state.currentContact._id === action.payload.contact._id) {
        state.currentContact = action.payload.contact;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Delete Contact
    .addCase(deleteContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteContact.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = state.contacts.filter(contact => contact._id !== action.payload.id);
      if (state.currentContact && state.currentContact._id === action.payload.id) {
        state.currentContact = null;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(deleteContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Update Contact Status
    .addCase(updateContactStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateContactStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.contacts.findIndex(contact => contact._id === action.payload.contact._id);
      if (index !== -1) {
        state.contacts[index] = action.payload.contact;
      }
      if (state.currentContact && state.currentContact._id === action.payload.contact._id) {
        state.currentContact = action.payload.contact;
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase(updateContactStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get Contact Stats
    .addCase(getContactStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getContactStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.error = null;
    })
    .addCase(getContactStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
});

export default contactReducer;
