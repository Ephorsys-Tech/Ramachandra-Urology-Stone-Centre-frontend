import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch All Features
// GET -> /feature/all
// =============================================
export const fetchAllFeatures = createAsyncThunk(
  "feature/fetchAllFeatures",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/feature/all", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch features"
      );
    }
  }
);

// =============================================
// Fetch Features By Department
// GET -> /feature/getByDepartment/:departmentId
// =============================================
export const fetchFeaturesByDepartment = createAsyncThunk(
  "feature/fetchFeaturesByDepartment",
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/feature/getByDepartment/${departmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch features for department"
      );
    }
  }
);

// =============================================
// Add New Feature
// POST -> /feature/add
// =============================================
export const addNewFeature = createAsyncThunk(
  "feature/addNewFeature",
  async (featureData, { rejectWithValue }) => {
    try {
      const response = await api.post("/feature/add", featureData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add feature"
      );
    }
  }
);

// =============================================
// Update Feature By Id
// PUT -> /feature/update/:id
// =============================================
export const updateFeatureById = createAsyncThunk(
  "feature/updateFeatureById",
  async ({ id, featureData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/feature/update/${id}`, featureData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update feature"
      );
    }
  }
);

// =============================================
// Delete Feature By Id
// DELETE -> /feature/remove/:id
// =============================================
export const deleteFeatureById = createAsyncThunk(
  "feature/deleteFeatureById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/feature/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete feature"
      );
    }
  }
);

// =============================================
// Toggle Feature Status
// PATCH -> /feature/toggle/:id
// =============================================
export const toggleFeatureStatus = createAsyncThunk(
  "feature/toggleFeatureStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/feature/toggle/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle feature status"
      );
    }
  }
);

// =============================================
// Fetch Feature By Slug or ID
// GET -> /feature/getBySlug/:slug
// =============================================
export const fetchFeatureBySlug = createAsyncThunk(
  "feature/fetchFeatureBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/feature/getBySlug/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feature"
      );
    }
  }
);
