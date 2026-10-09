import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {Plus, Edit, Trash2, X, AlertTriangle, Upload, Image as ImageIcon } from "lucide-react";
import { fetchAllGalleries, addNewGallery, updateGalleryById, deleteGalleryById } from "../../redux/features/gallery/galleryThunk";
import toast from "react-hot-toast";

const Gallery = () => {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchAllGalleries());
  }, [dispatch]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error("Please provide a title and an image");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    if (formData.description) data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      const result = await dispatch(addNewGallery(data));
      if (addNewGallery.fulfilled.match(result)) {
        toast.success("Gallery item added successfully");
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to add gallery item");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const openEditModal = (gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      title: gallery.title || "",
      description: gallery.description || "",
      image: null,
    });
    setImagePreview(gallery.image ? gallery.image : null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description || "");
    if (formData.image) data.append("image", formData.image);

    try {
      const result = await dispatch(updateGalleryById({ id: selectedGallery._id, galleryData: data }));
      if (updateGalleryById.fulfilled.match(result)) {
        toast.success("Gallery updated successfully");
        setIsEditModalOpen(false);
        setSelectedGallery(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to update gallery");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const openDeleteModal = (gallery) => {
    setSelectedGallery(gallery);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteGalleryById(selectedGallery._id));
      if (deleteGalleryById.fulfilled.match(result)) {
        toast.success("Gallery item deleted");
        setIsDeleteModalOpen(false);
        setSelectedGallery(null);
      } else {
        toast.error(result.payload || "Failed to delete gallery item");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gallery Management</h2>
          <p className="text-sm text-slate-500">View, edit, or add hospital gallery images.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Add Image
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-450 uppercase tracking-wider">
                <th className="px-6 py-4 w-32">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
              {galleries && galleries.length > 0 ? (
                galleries.map((gallery) => (
                  <tr key={gallery._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        {gallery.image ? (
                          <img src={gallery.image} alt="Gallery" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {gallery.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{gallery.description || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(gallery)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(gallery)}
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
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">
                    No images found in gallery.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.25 }} className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 sticky top-0 bg-white z-20">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{isEditModalOpen ? "Edit Gallery Info" : "Add New Gallery Image"}</h3>
                  <p className="text-xs text-slate-450">Fill in the gallery details.</p>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                {/* Photo Upload */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative w-full h-48 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="text-slate-400 w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm text-slate-500">Click to upload image</span>
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
                    <input type="text" required placeholder="e.g. Operation Theatre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description</label>
                    <textarea rows="3" placeholder="Brief description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer disabled:opacity-70">
                    {loading ? "Saving..." : (isEditModalOpen ? "Save Changes" : "Add Image")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteModalOpen && selectedGallery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0"><AlertTriangle size={24} /></div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500 leading-normal">
                    Are you sure you want to delete <span className="font-semibold text-slate-700">{selectedGallery.title}</span>? This action is permanent.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                <button type="button" disabled={loading} onClick={handleDeleteConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition cursor-pointer disabled:opacity-70">
                  {loading ? "Deleting..." : "Delete Image"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;