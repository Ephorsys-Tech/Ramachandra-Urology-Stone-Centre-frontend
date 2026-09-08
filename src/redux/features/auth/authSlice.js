import { createSlice } from "@reduxjs/toolkit";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  checkAuthSession,
} from "./authThunk";
import { setAuthToken, clearAuthToken } from "../../services/tokenService";

const initialState = {
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  isCheckingAuth: true, // True on initial app load while verifying refresh cookie
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // -----------------------------------------
    // Start Loading
    // -----------------------------------------
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // -----------------------------------------
    // Set Access Token
    // -----------------------------------------
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      setAuthToken(action.payload);
    },

    // -----------------------------------------
    // Manual Login Success
    // -----------------------------------------
    loginSuccess: (state, action) => {
      state.loading = false;
      state.admin = action.payload;
      state.accessToken = action.payload?.accessToken || null;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      setAuthToken(action.payload?.accessToken || null);
    },

    // -----------------------------------------
    // Auth Failed
    // -----------------------------------------
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isCheckingAuth = false;
    },

    // -----------------------------------------
    // Logout Success
    // -----------------------------------------
    logoutSuccess: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
      clearAuthToken();
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    },

    // -----------------------------------------
    // Clear Error
    // -----------------------------------------
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  // =============================================
  // Extra Reducers (Async Thunks)
  // =============================================
  extraReducers: (builder) => {
    builder
      // -----------------------------------------
      // Check / Restore Session via httpOnly Cookie
      // -----------------------------------------
      .addCase(checkAuthSession.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        const token = action.payload?.data?.accessToken || null;
        state.isCheckingAuth = false;
        state.admin = action.payload?.data;
        state.accessToken = token;
        state.isAuthenticated = !!token;
        state.error = null;
        setAuthToken(token);
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.isCheckingAuth = false;
        state.admin = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        clearAuthToken();
      })

      // -----------------------------------------
      // Register Admin
      // -----------------------------------------
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload?.data;
        state.isAuthenticated = false;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Login Admin
      // -----------------------------------------
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        const token = action.payload?.data?.accessToken || null;
        state.loading = false;
        state.admin = action.payload?.data;
        state.accessToken = token;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
        state.error = null;
        setAuthToken(token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        clearAuthToken();
      })

      // -----------------------------------------
      // Logout Admin
      // -----------------------------------------
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.error = null;
        clearAuthToken();
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.admin = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        clearAuthToken();
      })

      // -----------------------------------------
      // Get Admin Profile
      // -----------------------------------------
      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload?.data;
        state.isAuthenticated = true;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// =============================================
// Export Actions
// =============================================

export const {
  authStart,
  setAccessToken,
  loginSuccess,
  authFailure,
  logoutSuccess,
  clearAuthError,
} = authSlice.actions;

// =============================================
// Export Reducer
// =============================================

export default authSlice.reducer;