import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================================
// Send Message (Public)
// POST -> /message/send
// =============================================
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post("/message/send", messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// =============================================
// Fetch All Messages (Admin only)
// GET -> /message/all
// =============================================
export const fetchAllMessages = createAsyncThunk(
  "message/fetchAllMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/message/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

// =============================================
// Delete Message By Id (Admin only)
// DELETE -> /message/delete/:id
// =============================================
export const deleteMessageById = createAsyncThunk(
  "message/deleteMessageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/message/delete/${id}`);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  }
);
