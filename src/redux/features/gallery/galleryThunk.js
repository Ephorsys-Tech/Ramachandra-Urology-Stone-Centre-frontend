import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all galleries
export const fetchAllGalleries = createAsyncThunk(
  "gallery/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/gallery/get/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch galleries"
      );
    }
  }
);

// Fetch a single gallery by ID
export const fetchGalleryById = createAsyncThunk(
  "gallery/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/gallery/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch gallery"
      );
    }
  }
);

// Add a new gallery
export const addNewGallery = createAsyncThunk(
  "gallery/add",
  async (galleryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/gallery/add", galleryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add gallery"
      );
    }
  }
);

// Update an existing gallery by ID
export const updateGalleryById = createAsyncThunk(
  "gallery/updateById",
  async ({ id, galleryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/gallery/update/${id}`, galleryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update gallery"
      );
    }
  }
);

// Delete a gallery by ID
export const deleteGalleryById = createAsyncThunk(
  "gallery/deleteById",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/gallery/delete/${id}`);
      return id; // Return the ID so we can filter it out of the state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete gallery"
      );
    }
  }
);
