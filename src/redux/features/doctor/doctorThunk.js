import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch All Doctors (Paginated)
// GET -> /doctor/getAll?page=&limit=
// =============================================

export const fetchAllDoctors = createAsyncThunk(
  "doctor/fetchAllDoctors",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctor/getAll?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

// =============================================
// Fetch Doctor By Id
// GET -> /doctor/getById/:id
// =============================================

export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctor/getById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctor"
      );
    }
  }
);

// =============================================
// Add New Doctor
// POST -> /doctor/add  (FormData for photo upload)
// =============================================

export const addNewDoctor = createAsyncThunk(
  "doctor/addNewDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {
      // If doctorData is FormData (has photo file), send as multipart
      const isFormData = doctorData instanceof FormData;

      const response = await api.post("/doctor/add", doctorData, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add doctor"
      );
    }
  }
);

// =============================================
// Update Doctor By Id
// PUT -> /doctor/update/:id  (FormData for photo upload)
// =============================================

export const updateDoctorById = createAsyncThunk(
  "doctor/updateDoctorById",
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const isFormData = doctorData instanceof FormData;

      const response = await api.put(`/doctor/update/${id}`, doctorData, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update doctor"
      );
    }
  }
);

// =============================================
// Delete Doctor By Id
// DELETE -> /doctor/remove/:id
// =============================================

export const deleteDoctorById = createAsyncThunk(
  "doctor/deleteDoctorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/doctor/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete doctor"
      );
    }
  }
);

// =============================================
// Fetch All Doctors (Public — no pagination, high limit)
// GET -> /doctor/getAll?page=1&limit=100
// =============================================

export const fetchAllDoctorsPublic = createAsyncThunk(
  "doctor/fetchAllDoctorsPublic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctor/getAll?page=1&limit=100`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

// =============================================
//  Fetch only 6 doctors for home page
// GET -> /doctor/getAll?page=1&limit=6
export const fetchHomePageDoctors = createAsyncThunk(
  "doctor/fetchHomePageDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctor/getAll?page=1&limit=6`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

