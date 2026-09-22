import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch All Services (Admin)
// GET -> /service/all
// =============================================
export const fetchAllServices = createAsyncThunk(
  "service/fetchAllServices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/service/all", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch services"
      );
    }
  }
);

// =============================================
// Fetch Published Services (Public)
// GET -> /service/getPublished
// =============================================
export const fetchPublishedServices = createAsyncThunk(
  "service/fetchPublishedServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/service/getPublished");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch published services"
      );
    }
  }
);

// =============================================
// Add New Service
// POST -> /service/add
// =============================================
export const addNewService = createAsyncThunk(
  "service/addNewService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await api.post("/service/add", serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add service"
      );
    }
  }
);

// =============================================
// Update Service By Id
// PUT -> /service/update/:id
// =============================================
export const updateServiceById = createAsyncThunk(
  "service/updateServiceById",
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/service/update/${id}`, serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update service"
      );
    }
  }
);

// =============================================
// Delete Service By Id
// DELETE -> /service/remove/:id
// =============================================
export const deleteServiceById = createAsyncThunk(
  "service/deleteServiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/service/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete service"
      );
    }
  }
);

// =============================================
// Toggle Service Published Status
// PATCH -> /service/toggle/:id
// =============================================
export const toggleServiceStatus = createAsyncThunk(
  "service/toggleServiceStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/service/toggle/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle service status"
      );
    }
  }
);

// =============================================
// Fetch Service By Slug or ID (Public)
// GET -> /service/getBySlug/:slug
// =============================================
export const fetchServiceBySlug = createAsyncThunk(
  "service/fetchServiceBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/service/getBySlug/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch service details"
      );
    }
  }
);

// =============================================
// Fetch Services By Feature ID (Public)
// GET -> /service/getByFeature/:featureId
// =============================================
export const fetchServicesByFeature = createAsyncThunk(
  "service/fetchServicesByFeature",
  async (featureId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/service/getByFeature/${featureId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch services for feature"
      );
    }
  }
);
