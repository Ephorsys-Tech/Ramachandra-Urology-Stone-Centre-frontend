import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllDepartments,
  addNewDepartment,
  updateDepartmentById,
  deleteDepartmentById,
  fetchDoctorsByDepartmentId,
} from "./departmentThunk";

const initialState = {
  departments: [],
  departmentDoctors: [],
  totalDepartments: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    // -----------------------------------------
    // Clear Department Error
    // -----------------------------------------
    clearDepartmentError: (state) => {
      state.error = null;
    },

    // -----------------------------------------
    // Clear Department Doctors
    // -----------------------------------------
    clearDepartmentDoctors: (state) => {
      state.departmentDoctors = [];
    },
  },

  // =============================================
  // Extra Reducers (Async Thunks)
  // =============================================
  extraReducers: (builder) => {
    builder

      // -----------------------------------------
      // Fetch All Departments
      // -----------------------------------------
      .addCase(fetchAllDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDepartments.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data;
        if (Array.isArray(data)) {
          state.departments = data;
          state.totalDepartments = data.length;
          state.totalPages = 1;
        } else if (data && typeof data === "object") {
          state.departments = data.departments || [];
          state.totalDepartments = data.total || 0;
          state.totalPages = data.totalPages || 1;
          state.currentPage = data.page || 1;
        } else if (Array.isArray(action.payload)) {
          state.departments = action.payload;
          state.totalDepartments = action.payload.length;
          state.totalPages = 1;
        } else {
          state.departments = [];
        }
      })
      .addCase(fetchAllDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (!state.departments) {
          state.departments = [];
        }
      })

      // -----------------------------------------
      // Add New Department
      // -----------------------------------------
      .addCase(addNewDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const newDept = action.payload?.data || action.payload;
        if (newDept && newDept._id) {
          state.departments.unshift(newDept);
        }
      })
      .addCase(addNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Update Department By Id
      // -----------------------------------------
      .addCase(updateDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const index = state.departments.findIndex((d) => d._id === updated._id);
        if (index !== -1) {
          state.departments[index] = updated;
        }
      })
      .addCase(updateDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Delete Department By Id
      // -----------------------------------------
      .addCase(deleteDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(
          (d) => d._id !== action.payload.deletedId
        );
      })
      .addCase(deleteDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Doctors By Department Id
      // -----------------------------------------
      .addCase(fetchDoctorsByDepartmentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsByDepartmentId.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentDoctors = action.payload.data;
      })
      .addCase(fetchDoctorsByDepartmentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDepartmentError, clearDepartmentDoctors } = departmentSlice.actions;

export default departmentSlice.reducer;
