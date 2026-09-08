import { createSlice } from "@reduxjs/toolkit";
import {
  sendMessage,
  fetchAllMessages,
  deleteMessageById,
} from "./messageThunk";

const getInitialReadIds = () => {
  try {
    const saved = localStorage.getItem("read_messages");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  messages: [],
  readIds: getInitialReadIds(),
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // -----------------------------------------
    // Add message locally (Real-time Socket.io)
    // -----------------------------------------
    addMessageLocally: (state, action) => {
      const exists = state.messages.some((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.unshift(action.payload);
      }
    },

    // -----------------------------------------
    // Delete message locally (Real-time Socket.io)
    // -----------------------------------------
    deleteMessageLocally: (state, action) => {
      state.messages = state.messages.filter((m) => m._id !== action.payload);
    },

    // -----------------------------------------
    // Clear message error
    // -----------------------------------------
    clearMessageError: (state) => {
      state.error = null;
    },

    // -----------------------------------------
    // Mark message as read
    // -----------------------------------------
    markMessageAsRead: (state, action) => {
      if (!state.readIds) {
        state.readIds = [];
      }
      if (!state.readIds.includes(action.payload)) {
        state.readIds.push(action.payload);
        try {
          localStorage.setItem("read_messages", JSON.stringify(state.readIds));
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // -----------------------------------------
      // Send Message
      // -----------------------------------------
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Fetch All Messages
      // -----------------------------------------
      .addCase(fetchAllMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data;
      })
      .addCase(fetchAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------------------
      // Delete Message By Id
      // -----------------------------------------
      .addCase(deleteMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessageById.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter(
          (m) => m._id !== action.payload.deletedId
        );
      })
      .addCase(deleteMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessageLocally, deleteMessageLocally, clearMessageError, markMessageAsRead } =
  messageSlice.actions;

export default messageSlice.reducer;
