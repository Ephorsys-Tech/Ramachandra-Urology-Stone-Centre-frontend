import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllDiseases,
  fetchDiseasesByDepartment,
  addNewDisease,
  updateDiseaseById,
  deleteDiseaseById,
  toggleDiseaseStatus,
} from "./diseaseThunk";

const initialState = {
  diseases: [],
  totalDiseases: 0,
  totalPages: 1,
  currentPage: 1,
  activeCount: 0,
  loading: false,
  error: null,
};

const diseaseSlice = createSlice({
  name: "disease",
  initialState,
  reducers: {
    clearDiseaseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Diseases
      .addCase(fetchAllDiseases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDiseases.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        if (Array.isArray(data)) {
          state.diseases = data;
          state.totalDiseases = data.length;
          state.totalPages = 1;
        } else if (data && typeof data === "object") {
          state.diseases = data.diseases || [];
          state.totalDiseases = data.total || 0;
          state.totalPages = data.totalPages || 1;
          state.currentPage = data.page || 1;
          state.activeCount = data.activeCount || 0;
        }
      })
      .addCase(fetchAllDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Diseases By Department
      .addCase(fetchDiseasesByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiseasesByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload.data || [];
      })
      .addCase(fetchDiseasesByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add New Disease
      .addCase(addNewDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewDisease.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.diseases.unshift(action.payload.data);
        }
      })
      .addCase(addNewDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Disease By Id
      .addCase(updateDiseaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiseaseById.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        if (updated) {
          const index = state.diseases.findIndex((d) => d._id === updated._id);
          if (index !== -1) {
            state.diseases[index] = updated;
          }
        }
      })
      .addCase(updateDiseaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Disease By Id
      .addCase(deleteDiseaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiseaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = state.diseases.filter(
          (d) => d._id !== action.payload.deletedId
        );
      })
      .addCase(deleteDiseaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Disease Status
      .addCase(toggleDiseaseStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        if (updated) {
          const index = state.diseases.findIndex((d) => d._id === updated._id);
          if (index !== -1) {
            state.diseases[index] = updated;
          }
        }
      });
  },
});

export const { clearDiseaseError } = diseaseSlice.actions;
export default diseaseSlice.reducer;
