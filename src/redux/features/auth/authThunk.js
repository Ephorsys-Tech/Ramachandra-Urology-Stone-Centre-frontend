import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Register Admin
// POST -> /admin/register
// =============================================

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/register", adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// =============================================
// Login Admin
// POST -> /admin/login
// =============================================

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// =============================================
// Check / Restore Session via httpOnly Cookie
// POST -> /admin/refresh-token
// =============================================

export const checkAuthSession = createAsyncThunk(
  "auth/checkAuthSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/refresh-token");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

// =============================================
// Logout Admin
// POST -> /admin/logout
// =============================================

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// =============================================
// Get Admin Profile
// GET -> /admin/profile
// =============================================

export const getAdminProfile = createAsyncThunk(
  "auth/getAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);
