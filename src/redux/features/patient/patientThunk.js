import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Fetch All Patients
// GET -> /patient/getAll
// =============================================

export const fetchAllPatients = createAsyncThunk(
  "patient/fetchAllPatients",
  async ({ page = 1, limit = "" } = {}, { rejectWithValue }) => {
    try {
      const url = limit ? `/patient/getAll?page=${page}&limit=${limit}` : "/patient/getAll";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients"
      );
    }
  }
);

// =============================================
// Fetch Patient By Id
// GET -> /patient/getById/:id
// =============================================

export const fetchPatientById = createAsyncThunk(
  "patient/fetchPatientById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patient/getById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient"
      );
    }
  }
);

// =============================================
// Fetch Patient By Contact (Email or Phone)
// GET -> /patient/getByContact?email=&phone=
// =============================================

export const fetchPatientByContact = createAsyncThunk(
  "patient/fetchPatientByContact",
  async ({ email, phone }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (phone) params.append("phone", phone);

      const response = await api.get(`/patient/getByContact?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to find patient"
      );
    }
  }
);

// =============================================
// Add New Patient
// POST -> /patient/add
// =============================================

export const addNewPatient = createAsyncThunk(
  "patient/addNewPatient",
  async (patientData, { rejectWithValue }) => {
    try {
      // First, create the patient
      const response = await api.post("/patient/add", patientData);
      const created = response.data;
      // If the backend returns the created patient's ID, fetch the full populated record
      const patientId = created?.data?._id || created?.data?.id;
      if (patientId) {
        const fullRes = await api.get(`/patient/getById/${patientId}`);
        return fullRes.data;
      }
      // Fallback: return original response if ID not available
      return created;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add patient"
      );
    }
  }
);

// =============================================
// Update Patient By Id
// PUT -> /patient/update/:id
// =============================================

export const updatePatientById = createAsyncThunk(
  "patient/updatePatientById",
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/patient/update/${id}`, patientData);
      const updated = response.data;
      
      // Fetch the full populated record so UI updates instantly without refresh
      if (updated?.data?._id || id) {
        const fullRes = await api.get(`/patient/getById/${updated?.data?._id || id}`);
        return fullRes.data;
      }
      return updated;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update patient"
      );
    }
  }
);

// =============================================
// Delete Patient By Id
// DELETE -> /patient/remove/:id
// =============================================

export const deletePatientById = createAsyncThunk(
  "patient/deletePatientById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/patient/remove/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete patient"
      );
    }
  }
);

// =============================================
// Add Follow-Up Treatment
// PUT -> /patient/followup
// =============================================

export const addFollowUp = createAsyncThunk(
  "patient/addFollowUp",
  async (followUpData, { rejectWithValue }) => {
    try {
      const response = await api.put("/patient/followup", followUpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add follow-up"
      );
    }
  }
);

// =============================================
// Fetch Patients By Doctor Id
// GET -> /patient/getByDoctorId/:doctorId
// =============================================

export const fetchPatientsByDoctorId = createAsyncThunk(
  "patient/fetchPatientsByDoctorId",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patient/getByDoctorId/${doctorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients by doctor"
      );
    }
  }
);

// =============================================
// Fetch Patients By Department Id
// GET -> /patient/getByDepartmentId/:departmentId
// =============================================

export const fetchPatientsByDepartmentId = createAsyncThunk(
  "patient/fetchPatientsByDepartmentId",
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patient/getByDepartmentId/${departmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients by department"
      );
    }
  }
);

// =============================================
// Fetch Patient History
// GET -> /patient/getHistoryByPatientId/:patientId
// =============================================

export const fetchPatientHistory = createAsyncThunk(
  "patient/fetchPatientHistory",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patient/getHistoryByPatientId/${patientId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient history"
      );
    }
  }
);
