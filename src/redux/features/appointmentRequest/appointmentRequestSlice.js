import { createSlice } from "@reduxjs/toolkit";

import {
  submitAppointmentRequest,
  fetchAllAppointmentRequests,
  updateAppointmentRequestStatus,
  deleteAppointmentRequest,
  deleteRejectedAppointmentRequests,
} from "./appointmentRequestThunk";

const initialState = {
  requests: [],
  loading: false,
  error: null,
};

const appointmentRequestSlice = createSlice({
  name: "appointmentRequest",
  initialState,
  reducers: {
    // -----------------------------------------
    // Clear Error
    // -----------------------------------------
    clearAppointmentRequestError: (state) => {
      state.error = null;
    },

    // -----------------------------------------
    // Local Socket actions
    // -----------------------------------------
    addRequestLocally: (state, action) => {
      const exists = state.requests.some((r) => r._id === action.payload._id);
      if (!exists) {
        state.requests.unshift(action.payload);
      }
    },
    updateRequestLocally: (state, action) => {
      const index = state.requests.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      } else {
        state.requests.unshift(action.payload);
      }
    },
    deleteRequestLocally: (state, action) => {
      state.requests = state.requests.filter((r) => r._id !== action.payload);
    },
    bulkDeleteRequestsLocally: (state, action) => {
      if (action.payload.status === "Rejected") {
        state.requests = state.requests.filter((r) => r.status !== "Rejected");
      }
    },
  },

  // =============================================
  // Extra Reducers (Async Thunks)
  // =============================================
  extraReducers: (builder) => {
    builder

      // -----------------------------------------
      // Submit Appointment Request
      // -----------------------------------------
      .addCase(submitAppointmentRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAppointmentRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitAppointmentRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch All Appointment Requests
      // -----------------------------------------
      .addCase(fetchAllAppointmentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointmentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.data;
      })
      .addCase(fetchAllAppointmentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Update Appointment Request Status
      // -----------------------------------------
      .addCase(updateAppointmentRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const index = state.requests.findIndex((r) => r._id === updated._id);
        if (index !== -1) {
          state.requests[index] = updated;
        }
      })
      .addCase(updateAppointmentRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Delete Appointment Request
      // -----------------------------------------
      .addCase(deleteAppointmentRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointmentRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          (r) => r._id !== action.payload.deletedId
        );
      })
      .addCase(deleteAppointmentRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Delete Rejected Appointment Requests
      // -----------------------------------------
      .addCase(deleteRejectedAppointmentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRejectedAppointmentRequests.fulfilled, (state) => {
        state.loading = false;
        state.requests = state.requests.filter((r) => r.status !== "Rejected");
      })
      .addCase(deleteRejectedAppointmentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAppointmentRequestError,
  addRequestLocally,
  updateRequestLocally,
  deleteRequestLocally,
  bulkDeleteRequestsLocally,
} = appointmentRequestSlice.actions;

export default appointmentRequestSlice.reducer;
