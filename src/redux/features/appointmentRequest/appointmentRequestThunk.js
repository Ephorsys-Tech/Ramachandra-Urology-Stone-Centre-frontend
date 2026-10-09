import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Submit Appointment Request (Public — no auth)
// POST -> /appointment-request/submit
// =============================================

export const submitAppointmentRequest = createAsyncThunk(
  "appointmentRequest/submit",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await api.post("/appointment-request/submit", requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit appointment request"
      );
    }
  }
);

// =============================================
// Fetch All Appointment Requests (Admin)
// GET -> /appointment-request/getAll
// =============================================

export const fetchAllAppointmentRequests = createAsyncThunk(
  "appointmentRequest/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/appointment-request/getAll");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointment requests"
      );
    }
  }
);

// =============================================
// Update Appointment Request Status (Admin)
// PUT -> /appointment-request/update/:id
// =============================================

export const updateAppointmentRequestStatus = createAsyncThunk(
  "appointmentRequest/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/appointment-request/update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment request"
      );
    }
  }
);

// =============================================
// Delete Appointment Request (Admin)
// DELETE -> /appointment-request/remove/:id
// =============================================

export const deleteAppointmentRequest = createAsyncThunk(
  "appointmentRequest/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/appointment-request/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete appointment request"
      );
    }
  }
);

// =============================================
// Delete All Rejected Appointment Requests (Admin)
// DELETE -> /appointment-request/remove-rejected
// =============================================

export const deleteRejectedAppointmentRequests = createAsyncThunk(
  "appointmentRequest/deleteRejected",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/appointment-request/remove-rejected");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete rejected requests"
      );
    }
  }
);
