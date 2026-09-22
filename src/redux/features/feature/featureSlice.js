import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllFeatures,
  fetchFeaturesByDepartment,
  addNewFeature,
  updateFeatureById,
  deleteFeatureById,
  toggleFeatureStatus,
} from "./featureThunk";

const initialState = {
  features: [],
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
        state.features = action.payload.data || [];
      })
      .addCase(fetchAllFeatures.rejected, (state, action) => {
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
