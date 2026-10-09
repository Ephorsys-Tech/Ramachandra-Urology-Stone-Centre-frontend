import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllPatients,
  fetchPatientById,
  fetchPatientByContact,
  addNewPatient,
  updatePatientById,
  deletePatientById,
  addFollowUp,
  fetchPatientsByDoctorId,
  fetchPatientsByDepartmentId,
  fetchPatientHistory,
} from "./patientThunk";

const initialState = {
  patients: [],
  selectedPatient: null,
  patientHistory: [],
  loading: false,
  error: null,
  isAppointmentModalOpen: false,
  preselectedDepartment: "",
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    // -----------------------------------------
    // Add Patient (local/manual)
    // -----------------------------------------
    addPatient: (state, action) => {
      const nextId = state.patients.length > 0 
        ? Math.max(...state.patients.map(p => p.id)) + 1 
        : 1;
      
      const newPatient = {
        ...action.payload,
        id: nextId,
        date: new Date().toISOString().split('T')[0],
      };
      state.patients.unshift(newPatient);
    },

    // -----------------------------------------
    // Update Patient (local/manual)
    // -----------------------------------------
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },

    // -----------------------------------------
    // Delete Patient (local/manual)
    // -----------------------------------------
    deletePatient: (state, action) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
    },

    // -----------------------------------------
    // Appointment Modal Reducers
    // -----------------------------------------
    openAppointmentModal: (state, action) => {
      state.isAppointmentModalOpen = true;
      state.preselectedDepartment = action.payload || "";
    },
    closeAppointmentModal: (state) => {
      state.isAppointmentModalOpen = false;
      state.preselectedDepartment = "";
    },

    // -----------------------------------------
    // Clear Selected Patient
    // -----------------------------------------
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },

    // -----------------------------------------
    // Clear Patient Error
    // -----------------------------------------
    clearPatientError: (state) => {
      state.error = null;
    },
  },

  // =============================================
  // Extra Reducers (Async Thunks)
  // =============================================
  extraReducers: (builder) => {
    builder

      // -----------------------------------------
      // Fetch All Patients
      // -----------------------------------------
      .addCase(fetchAllPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.loading = false;
        // The backend now returns { patients, totalPages, totalPatients, currentPage }
        state.patients = action.payload.data.patients || action.payload.data;
        if (action.payload.data.totalPages !== undefined) {
          state.totalPages = action.payload.data.totalPages;
          state.totalPatients = action.payload.data.totalPatients;
          state.currentPage = action.payload.data.currentPage;
        }
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Patient By Id
      // -----------------------------------------
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload.data;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Patient By Contact
      // -----------------------------------------
      .addCase(fetchPatientByContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientByContact.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload.data;
      })
      .addCase(fetchPatientByContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Add New Patient
      // -----------------------------------------
      .addCase(addNewPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewPatient.fulfilled, (state, action) => {
        state.loading = false;
        const newPatient = action.payload.data;
        const index = state.patients.findIndex(p => p._id === newPatient._id);
        if (index !== -1) {
          state.patients[index] = newPatient;
        } else {
          state.patients.unshift(newPatient);
        }
      })
      .addCase(addNewPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Update Patient By Id
      // -----------------------------------------
      .addCase(updatePatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientById.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const index = state.patients.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.patients[index] = updated;
        }
        if (state.selectedPatient?._id === updated._id) {
          state.selectedPatient = updated;
        }
      })
      .addCase(updatePatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Delete Patient By Id
      // -----------------------------------------
      .addCase(deletePatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.filter(
          (p) => p._id !== action.payload.deletedId
        );
        if (state.selectedPatient?._id === action.payload.deletedId) {
          state.selectedPatient = null;
        }
      })
      .addCase(deletePatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Add Follow-Up
      // -----------------------------------------
      .addCase(addFollowUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFollowUp.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const index = state.patients.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.patients[index] = updated;
        }
        if (state.selectedPatient?._id === updated._id) {
          state.selectedPatient = updated;
        }
      })
      .addCase(addFollowUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Patients By Doctor Id
      // -----------------------------------------
      .addCase(fetchPatientsByDoctorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsByDoctorId.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data;
      })
      .addCase(fetchPatientsByDoctorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Patients By Department Id
      // -----------------------------------------
      .addCase(fetchPatientsByDepartmentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsByDepartmentId.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data;
      })
      .addCase(fetchPatientsByDepartmentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch Patient History
      // -----------------------------------------
      .addCase(fetchPatientHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.patientHistory = action.payload.data;
      })
      .addCase(fetchPatientHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addPatient,
  updatePatient,
  deletePatient,
  openAppointmentModal,
  closeAppointmentModal,
  clearSelectedPatient,
  clearPatientError,
} = patientSlice.actions;

export default patientSlice.reducer;
