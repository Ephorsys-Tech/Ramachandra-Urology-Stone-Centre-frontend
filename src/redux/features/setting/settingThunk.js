import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch Settings
// GET -> /setting/get
// =============================================
export const fetchSettings = createAsyncThunk(
  "setting/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/setting/get");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

// =============================================
// Update Settings
// PUT -> /setting/update
// =============================================
export const updateSettings = createAsyncThunk(
  "setting/updateSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await api.put("/setting/update", settingsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings"
      );
    }
  }
);
