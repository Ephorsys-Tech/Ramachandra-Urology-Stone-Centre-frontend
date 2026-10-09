import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch All Departments
// GET -> /department/getPublished (fallback to /department/getAll)
// =============================================

export const fetchAllDepartments = createAsyncThunk(
  "department/fetchAllDepartments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/department/getAll", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch departments"
      );
    }
  }
);

// =============================================
// Add New Department
// POST -> /department/add
// =============================================

export const addNewDepartment = createAsyncThunk(
  "department/addNewDepartment",
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await api.post("/department/add", departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add department"
      );
    }
  }
);

// =============================================
// Update Department By Id
// PUT -> /department/update/:id
// =============================================

export const updateDepartmentById = createAsyncThunk(
  "department/updateDepartmentById",
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/department/update/${id}`, departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update department"
      );
    }
  }
);

// =============================================
// Delete Department By Id
// DELETE -> /department/remove/:id
// =============================================

export const deleteDepartmentById = createAsyncThunk(
  "department/deleteDepartmentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/department/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete department"
      );
    }
  }
);

// =============================================
// Fetch Doctors By Department Id
// GET -> /department/getDoctorsByDepartmentId/:id
// =============================================

export const fetchDoctorsByDepartmentId = createAsyncThunk(
  "department/fetchDoctorsByDepartmentId",
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/department/getDoctorsByDepartmentId/${departmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors by department"
      );
    }
  }
);

// =============================================
// Fetch Department By Slug
// GET -> /department/getBySlug/:slug
// =============================================

export const fetchDepartmentBySlug = createAsyncThunk(
  "department/fetchDepartmentBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/department/getBySlug/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch department"
      );
    }
  }
);

