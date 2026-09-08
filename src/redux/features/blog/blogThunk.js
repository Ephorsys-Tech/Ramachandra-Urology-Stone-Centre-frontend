import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all blogs (paginated, filtered)
export const fetchBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { search = "", category = "", page = 1, limit = 10 } = params;
      const response = await api.get("/blog/get/all", {
        params: { search, category, page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

// Fetch a single blog by ID
export const fetchBlogById = createAsyncThunk(
  "blog/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog post"
      );
    }
  }
);

// Create a new blog post
export const createBlog = createAsyncThunk(
  "blog/create",
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await api.post("/blog/add", blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to publish blog post"
      );
    }
  }
);

// Update an existing blog post
export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/blog/update/${id}`, blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update blog post"
      );
    }
  }
);

// Delete a blog post by ID
export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/blog/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog post"
      );
    }
  }
);
