import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./blogThunk";

const initialState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  count: 0,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  categoryCounts: {},
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
        state.count = action.payload.count;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.categoryCounts = action.payload.categoryCounts || {};
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Blog By ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload.data;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.blogs.unshift(action.payload.data);
        }
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload.data;
        const index = state.blogs.findIndex((b) => b._id === updatedBlog._id);
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }
        if (state.selectedBlog?._id === updatedBlog._id) {
          state.selectedBlog = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
        if (state.selectedBlog?._id === action.payload) {
          state.selectedBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogError, clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
