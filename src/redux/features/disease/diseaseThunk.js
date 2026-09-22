import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch All Diseases
// GET -> /disease/all
// =============================================
export const fetchAllDiseases = createAsyncThunk(
  "disease/fetchAllDiseases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/disease/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch diseases"
      );
    }
  }
);

// =============================================
// Fetch Diseases By Department
// GET -> /disease/getByDepartment/:departmentId
// =============================================
export const fetchDiseasesByDepartment = createAsyncThunk(
  "disease/fetchDiseasesByDepartment",
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/disease/getByDepartment/${departmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch diseases for department"
      );
    }
  }
);

// =============================================
// Add New Disease
// POST -> /disease/add
// =============================================
export const addNewDisease = createAsyncThunk(
  "disease/addNewDisease",
  async (diseaseData, { rejectWithValue }) => {
    try {
      const response = await api.post("/disease/add", diseaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add disease"
      );
    }
  }
);

// =============================================
// Update Disease By Id
// PUT -> /disease/update/:id
// =============================================
export const updateDiseaseById = createAsyncThunk(
  "disease/updateDiseaseById",
  async ({ id, diseaseData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/disease/update/${id}`, diseaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update disease"
      );
    }
  }
);

// =============================================
// Delete Disease By Id
// DELETE -> /disease/remove/:id
// =============================================
export const deleteDiseaseById = createAsyncThunk(
  "disease/deleteDiseaseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/disease/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete disease"
      );
    }
  }
);

// =============================================
// Toggle Disease Status
// PATCH -> /disease/toggle/:id
// =============================================
export const toggleDiseaseStatus = createAsyncThunk(
  "disease/toggleDiseaseStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/disease/toggle/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle disease status"
      );
    }
  }
);
