import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, Upload, BookOpen } from "lucide-react";
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from "../../redux/features/blog/blogThunk";
import { fetchAllDoctors } from "../../redux/features/doctor/doctorThunk";
import toast from "react-hot-toast";
import BlogEditor from "../components/BlogEditor";

const categoryOptions = ["Urology"];

const Blogs = () => {
  const dispatch = useDispatch();

  // Select state
  const { blogs, loading, total, currentPage, totalPages } = useSelector(
    (state) => state.blog || { blogs: [], loading: false, total: 0, currentPage: 1, totalPages: 1 }
  );
  const { doctors = [] } = useSelector((state) => state.doctor || { doctors: [] });

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [page, setPage] = useState(1);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    readTime: "5 min read",
    description: "",
    content: "",
    authorType: "Admin",
    doctorAuthor: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Fetch blogs & doctors
  useEffect(() => {
    dispatch(fetchBlogs({ search: searchTerm, page, limit: 8 }));
  }, [dispatch, searchTerm, page]);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchAllDoctors());
    }
  }, [dispatch, doctors.length]);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "General",
      readTime: "5 min read",
      description: "",
      content: "",
      authorType: "Admin",
      doctorAuthor: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isContentEmpty = (html) => {
    if (!html) return true;
    const clean = html.replace(/<[^>]*>/g, "").trim();
    return clean === "" && !html.includes("<img");
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || isContentEmpty(formData.content) || !formData.image) {
      toast.error("Please provide a title, full content, and a cover image");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("readTime", formData.readTime);
    data.append("description", formData.description);
    data.append("content", formData.content);
    data.append("authorType", formData.authorType);
    if (formData.authorType === "Doctor" && formData.doctorAuthor) {
      data.append("doctorAuthor", formData.doctorAuthor);
    }
    data.append("image", formData.image);

    try {
      const result = await dispatch(createBlog(data));
      if (createBlog.fulfilled.match(result)) {
        toast.success("Blog post published successfully");
        setIsAddModalOpen(false);
        resetForm();
        setPage(1);
        dispatch(fetchBlogs({ search: searchTerm, page: 1, limit: 8 }));
      } else {
        toast.error(result.payload || "Failed to publish blog post");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || "",
      category: blog.category || "General",
      readTime: blog.readTime || "5 min read",
      description: blog.description || "",
      content: blog.content || "",
      authorType: blog.authorType || "Admin",
      doctorAuthor: blog.doctorAuthor?._id || blog.doctorAuthor || "",
      image: null,
    });
    setImagePreview(blog.image || null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || isContentEmpty(formData.content)) {
      toast.error("Please provide a title and full content");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("readTime", formData.readTime);
    data.append("description", formData.description);
    data.append("content", formData.content);
    data.append("authorType", formData.authorType);
    if (formData.authorType === "Doctor" && formData.doctorAuthor) {
      data.append("doctorAuthor", formData.doctorAuthor);
    } else {
      data.append("doctorAuthor", "");
    }
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const result = await dispatch(updateBlog({ id: selectedBlog._id, blogData: data }));
      if (updateBlog.fulfilled.match(result)) {
        toast.success("Blog post updated successfully");
        setIsEditModalOpen(false);
        setSelectedBlog(null);
        resetForm();
        dispatch(fetchBlogs({ search: searchTerm, page, limit: 8 }));
      } else {
        toast.error(result.payload || "Failed to update blog post");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteBlog(selectedBlog._id));
      if (deleteBlog.fulfilled.match(result)) {
        toast.success("Blog post deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedBlog(null);
        const newPage = (blogs.length === 1 && page > 1) ? page - 1 : page;
        setPage(newPage);
        dispatch(fetchBlogs({ search: searchTerm, page: newPage, limit: 8 }));
      } else {
        toast.error(result.payload || "Failed to delete blog post");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Blog Management</h2>
          <p className="text-sm text-slate-500">Create, edit, or publish blogs on behalf of doctors or admin.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Create Blog
        </motion.button>
      </div>

      {/* Control panel: search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
        <p className="text-xs text-slate-500 font-semibold shrink-0">
          Showing {blogs?.length || 0} of {total || 0} articles
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-450 uppercase tracking-wider">
                <th className="px-6 py-4 w-24">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
              {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-16 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        {blog.image ? (
                          <img src={blog.image} alt="Blog" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <BookOpen size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800 max-w-xs truncate">
                      {blog.title}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-600">{blog.authorName || "Admin"}</td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "")}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(blog)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.25 }} className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 sticky top-0 bg-white z-20">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{isEditModalOpen ? "Edit Blog Post" : "Create Blog Post"}</h3>
                  <p className="text-xs text-slate-450">Fill in the details below to publish your article with rich formatting.</p>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                {/* Photo Upload */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="relative w-full h-44 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="text-slate-400 w-8 h-8 mx-auto mb-2" />
                        <span className="text-xs text-slate-500">Click to upload blog cover image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <Upload className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Title *</label>
                    <input type="text" required placeholder="e.g. 10 Warning Signs of Kidney Stones" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Read Time</label>
                      <input type="text" placeholder="e.g. 5 min read" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Author Type</label>
                      <select value={formData.authorType} onChange={(e) => setFormData({ ...formData, authorType: e.target.value, doctorAuthor: "" })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        <option value="Admin">Admin</option>
                        <option value="Doctor">Doctor (On Behalf Of)</option>
                      </select>
                    </div>

                    {formData.authorType === "Doctor" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Select Doctor *</label>
                        <select required={formData.authorType === "Doctor"} value={formData.doctorAuthor} onChange={(e) => setFormData({ ...formData, doctorAuthor: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                          <option value="">-- Choose Doctor --</option>
                          {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                              {doc.name} ({doc.specialization})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Short Description/Excerpt *</label>
                    <textarea rows="2" required placeholder="A brief hook/excerpt for list and card display..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Full Article Content (Rich TipTap Editor) *
                    </label>
                    <BlogEditor
                      value={formData.content}
                      onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                      placeholder="Write your comprehensive medical article here... Use headings, bullet points, quotes, links, and text formatting."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer disabled:opacity-70">
                    {loading ? "Publishing..." : (isEditModalOpen ? "Save Changes" : "Publish Post")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteModalOpen && selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0"><AlertTriangle size={24} /></div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500 leading-normal">
                    Are you sure you want to delete <span className="font-semibold text-slate-700">{selectedBlog.title}</span>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-655 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                <button type="button" disabled={loading} onClick={handleDeleteConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition cursor-pointer disabled:opacity-70">
                  {loading ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Blogs;
