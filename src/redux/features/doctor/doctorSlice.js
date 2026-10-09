import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllDoctors,
  fetchAllDoctorsPublic,
  fetchDoctorById,
  addNewDoctor,
  updateDoctorById,
  deleteDoctorById,
  fetchHomePageDoctors,
} from "./doctorThunk";

const initialState = {
  doctors: [],
  homeDoctors: [],
  selectedDoctor: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    // -----------------------------------------
    // Clear Selected Doctor
    // -----------------------------------------
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },

    // -----------------------------------------
    // Clear Doctor Error
    // -----------------------------------------
    clearDoctorError: (state) => {
      state.error = null;
    },
  },

  // =============================================
  // Extra Reducers (Async Thunks)
  // =============================================
  extraReducers: (builder) => {
    builder

      // -----------------------------------------
      // Fetch All Doctors
      // -----------------------------------------
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.data.doctors;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Doctor By Id
      // -----------------------------------------
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload.data;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Add New Doctor
      // -----------------------------------------
      .addCase(addNewDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(addNewDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Update Doctor By Id
      // -----------------------------------------
      .addCase(updateDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const index = state.doctors.findIndex((d) => d._id === updated._id);
        if (index !== -1) {
          state.doctors[index] = updated;
        }
        if (state.selectedDoctor?._id === updated._id) {
          state.selectedDoctor = updated;
        }
      })
      .addCase(updateDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Delete Doctor By Id
      // -----------------------------------------
      .addCase(deleteDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter(
          (d) => d._id !== action.payload.deletedId
        );
        if (state.selectedDoctor?._id === action.payload.deletedId) {
          state.selectedDoctor = null;
        }
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch All Doctors Public
      // -----------------------------------------
      .addCase(fetchAllDoctorsPublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctorsPublic.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.data.doctors;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchAllDoctorsPublic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // -----------------------------------------
      // Fetch Home Page Doctors
      // -----------------------------------------
      .addCase(fetchHomePageDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomePageDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.homeDoctors = action.payload.data.doctors;
      })
      .addCase(fetchHomePageDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedDoctor, clearDoctorError } = doctorSlice.actions;

export default doctorSlice.reducer;
