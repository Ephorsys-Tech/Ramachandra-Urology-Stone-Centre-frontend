import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllServices,
  fetchPublishedServices,
  addNewService,
  updateServiceById,
  deleteServiceById,
  toggleServiceStatus,
  fetchServiceBySlug,
  fetchServicesByFeature,
} from "./serviceThunk";

const initialState = {
  services: [],
  currentService: null,
  featureServices: [],
  totalServices: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Services
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        if (Array.isArray(data)) {
          state.services = data;
          state.totalServices = data.length;
          state.totalPages = 1;
        } else if (data && typeof data === "object") {
          state.services = data.services || [];
          state.totalServices = data.total || 0;
          state.totalPages = data.totalPages || 1;
          state.currentPage = data.page || 1;
        }
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Published Services
      .addCase(fetchPublishedServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data || [];
      })
      .addCase(fetchPublishedServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Service By Slug
      .addCase(fetchServiceBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentService = null;
      })
      .addCase(fetchServiceBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload.data || null;
      })
      .addCase(fetchServiceBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Services By Feature
      .addCase(fetchServicesByFeature.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.featureServices = [];
      })
      .addCase(fetchServicesByFeature.fulfilled, (state, action) => {
        state.loading = false;
        state.featureServices = action.payload.data || [];
      })
      .addCase(fetchServicesByFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add New Service
      .addCase(addNewService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewService.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.services.unshift(action.payload.data);
        }
      })
      .addCase(addNewService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Service By Id
      .addCase(updateServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceById.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        if (updated) {
          const index = state.services.findIndex((s) => s._id === updated._id);
          if (index !== -1) {
            state.services[index] = updated;
          }
        }
      })
      .addCase(updateServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Service By Id
      .addCase(deleteServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(
          (s) => s._id !== action.payload.deletedId
        );
      })
      .addCase(deleteServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Service Status
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        if (updated) {
          const index = state.services.findIndex((s) => s._id === updated._id);
          if (index !== -1) {
            state.services[index] = updated;
          }
        }
      });
  },
});

export const { clearServiceError } = serviceSlice.actions;
export default serviceSlice.reducer;
