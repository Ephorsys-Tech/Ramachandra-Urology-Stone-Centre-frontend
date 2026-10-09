import { createSlice } from "@reduxjs/toolkit";
import { fetchSettings, updateSettings } from "./settingThunk";

const initialState = {
  settings: null,
  loading: false,
  error: null,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    // -----------------------------------------
    // Clear Setting Error
    // -----------------------------------------
    clearSettingError: (state) => {
      state.error = null;
    },
  },

  // =============================================
  // Extra Reducers (Async Thunks)
  // =============================================
  extraReducers: (builder) => {
    builder
      // -----------------------------------------
      // Fetch Settings
      // -----------------------------------------
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Update Settings
      // -----------------------------------------
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingError } = settingSlice.actions;
export default settingSlice.reducer;
