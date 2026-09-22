import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Search,
  Sparkles,
  Building,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  fetchAllFeatures,
  addNewFeature,
  updateFeatureById,
  deleteFeatureById,
  toggleFeatureStatus,
} from "../../redux/features/feature/featureThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import toast from "react-hot-toast";

const Features = () => {
  const dispatch = useDispatch();
  const { features, loading } = useSelector((state) => state.feature);
  const { departments } = useSelector((state) => state.department);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    department: "",
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchAllFeatures());
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments.length]);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      department: departments[0]?._id || "",
      orderIndex: 0,
      isActive: true,
    });
  };

  const handleAddOpen = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditOpen = (feature) => {
    setSelectedFeature(feature);
    setFormData({
      name: feature.name || "",
      slug: feature.slug || "",
      description: feature.description || "",
      department: feature.department?._id || feature.department || "",
      orderIndex: feature.orderIndex ?? 0,
      isActive: feature.isActive ?? true,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteOpen = (feature) => {
    setSelectedFeature(feature);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department) {
      toast.error("Feature name and department are required");
      return;
    }

    try {
      const result = await dispatch(addNewFeature(formData));
      if (addNewFeature.fulfilled.match(result)) {
        toast.success("Feature added successfully");
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to add feature");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department) {
      toast.error("Feature name and department are required");
      return;
    }

    try {
      const result = await dispatch(
        updateFeatureById({ id: selectedFeature._id, featureData: formData })
      );
      if (updateFeatureById.fulfilled.match(result)) {
        toast.success("Feature updated successfully");
        setIsEditModalOpen(false);
        setSelectedFeature(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to update feature");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFeature) return;
    try {
      const result = await dispatch(deleteFeatureById(selectedFeature._id));
      if (deleteFeatureById.fulfilled.match(result)) {
        toast.success("Feature deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedFeature(null);
      } else {
        toast.error(result.payload || "Failed to delete feature");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleToggle = async (id) => {
    try {
      const result = await dispatch(toggleFeatureStatus(id));
      if (toggleFeatureStatus.fulfilled.match(result)) {
        toast.success(result.payload.message || "Feature status updated");
      } else {
        toast.error(result.payload || "Failed to toggle status");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  // Filtering
  const filteredFeatures = (features || []).filter((f) => {
    const matchesSearch =
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const deptId = f.department?._id || f.department;
    const matchesDept =
      selectedDeptFilter === "all" || deptId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const activeCount = (features || []).filter((f) => f.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            
            Department Features
          </h2>
          <p className="text-sm text-slate-500">
            Manage key features and capabilities offered by hospital departments.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddOpen}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Add Feature
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            {features?.length || 0}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Features</p>
            <p className="text-sm font-bold text-slate-800">All Registered</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            {activeCount}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Features</p>
            <p className="text-sm font-bold text-slate-800">Visible on Public Site</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            {departments?.length || 0}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Departments</p>
            <p className="text-sm font-bold text-slate-800">Available Categories</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building size={16} className="text-slate-400 shrink-0" />
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition text-slate-700"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Features Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Feature Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
              {filteredFeatures.length > 0 ? (
                filteredFeatures.map((feature) => (
                  <tr key={feature._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div>{feature.name}</div>
                      {feature.slug && (
                        <div className="text-[11px] text-[#0FA8D6] font-mono font-normal mt-0.5">
                          /{feature.slug}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                        <Building size={12} className="text-slate-400" />
                        {feature.department?.name || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {feature.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-500">
                      {feature.orderIndex ?? 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(feature._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          feature.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {feature.isActive ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle size={13} className="text-slate-400" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(feature)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOpen(feature)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No features found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-lg font-bold text-slate-800">
                  {isEditModalOpen ? "Edit Feature" : "Add New Feature"}
                </h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24/7 Laser Stone Removal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. laser-stone-removal (auto-generated if empty)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700"
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of this feature..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Order Index
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-sm font-semibold text-slate-700">Is Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-70"
                  >
                    {loading ? "Saving..." : isEditModalOpen ? "Save Changes" : "Add Feature"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden z-10 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500 leading-normal">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-700">{selectedFeature.name}</span>?
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition cursor-pointer disabled:opacity-70"
                >
                  {loading ? "Deleting..." : "Delete Feature"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Features;
