import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllFeatures,
  fetchFeaturesByDepartment,
  addNewFeature,
  updateFeatureById,
  deleteFeatureById,
  toggleFeatureStatus,
  fetchFeatureBySlug,
} from "./featureThunk";

const initialState = {
  features: [],
  currentFeature: null,
  totalFeatures: 0,
  totalPages: 1,
  currentPage: 1,
  activeCount: 0,
  loading: false,
  error: null,
};

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    clearFeatureError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Features
      .addCase(fetchAllFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeatures.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        if (Array.isArray(data)) {
          state.features = data;
          state.totalFeatures = data.length;
          state.totalPages = 1;
        } else if (data && typeof data === "object") {
          state.features = data.features || [];
          state.totalFeatures = data.total || 0;
          state.totalPages = data.totalPages || 1;
          state.currentPage = data.page || 1;
          state.activeCount = data.activeCount || 0;
        }
      })
      .addCase(fetchAllFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Feature By Slug
      .addCase(fetchFeatureBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentFeature = null;
      })
      .addCase(fetchFeatureBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFeature = action.payload.data || null;
      })
      .addCase(fetchFeatureBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Features By Department
      .addCase(fetchFeaturesByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturesByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload.data || [];
      })
      .addCase(fetchFeaturesByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add New Feature
      .addCase(addNewFeature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewFeature.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.features.unshift(action.payload.data);
        }
      })
      .addCase(addNewFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Feature By Id
      .addCase(updateFeatureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeatureById.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        if (updated) {
          const index = state.features.findIndex((f) => f._id === updated._id);
          if (index !== -1) {
            state.features[index] = updated;
          }
        }
      })
      .addCase(updateFeatureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Feature By Id
      .addCase(deleteFeatureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeatureById.fulfilled, (state, action) => {
        state.loading = false;
        state.features = state.features.filter(
          (f) => f._id !== action.payload.deletedId
        );
      })
      .addCase(deleteFeatureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Feature Status
      .addCase(toggleFeatureStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        if (updated) {
          const index = state.features.findIndex((f) => f._id === updated._id);
          if (index !== -1) {
            state.features[index] = updated;
          }
        }
      });
  },
});

export const { clearFeatureError } = featureSlice.actions;
export default featureSlice.reducer;
