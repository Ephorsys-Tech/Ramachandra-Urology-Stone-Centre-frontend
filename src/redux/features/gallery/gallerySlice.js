import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllGalleries,
  fetchGalleryById,
  addNewGallery,
  updateGalleryById,
  deleteGalleryById,
} from "./galleryThunk";

const initialState = {
  galleries: [],
  selectedGallery: null,
  loading: false,
  error: null,
  count: 0,
  total: 0,
  currentPage: 1,
  totalPages: 1,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    clearGalleryError: (state) => {
      state.error = null;
    },
    clearSelectedGallery: (state) => {
      state.selectedGallery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Galleries
      .addCase(fetchAllGalleries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGalleries.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = action.payload.data;
        state.count = action.payload.count;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllGalleries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Gallery By Id
      .addCase(fetchGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGallery = action.payload.data;
      })
      .addCase(fetchGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add New Gallery
      .addCase(addNewGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewGallery.fulfilled, (state, action) => {
        state.loading = false;
        // The API returns the new gallery inside `data`
        if (action.payload.data) {
          state.galleries.unshift(action.payload.data);
        }
      })
      .addCase(addNewGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Gallery By Id
      .addCase(updateGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGallery = action.payload.data;
        const index = state.galleries.findIndex((g) => g._id === updatedGallery._id);
        if (index !== -1) {
          state.galleries[index] = updatedGallery;
        }
        if (state.selectedGallery?._id === updatedGallery._id) {
          state.selectedGallery = updatedGallery;
        }
      })
      .addCase(updateGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Gallery By Id
      .addCase(deleteGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = state.galleries.filter((g) => g._id !== action.payload);
        if (state.selectedGallery?._id === action.payload) {
          state.selectedGallery = null;
        }
      })
      .addCase(deleteGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGalleryError, clearSelectedGallery } = gallerySlice.actions;

export default gallerySlice.reducer;
