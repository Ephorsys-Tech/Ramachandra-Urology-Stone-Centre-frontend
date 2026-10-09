import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Edit, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Stethoscope, HelpCircle, Sparkles, Activity, Layers, Tag } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchAllServices,
  addNewService,
  updateServiceById,
  deleteServiceById,
  toggleServiceStatus,
} from "../../redux/features/service/serviceThunk";
import { fetchAllFeatures } from "../../redux/features/feature/featureThunk";

const Services = () => {
  const dispatch = useDispatch();
  const { services, totalServices, totalPages: backendTotalPages, loading } = useSelector((state) => state.service || {});
  const { features } = useSelector((state) => state.feature || { features: [] });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllServices({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  useEffect(() => {
    if (!features || features.length === 0) {
      dispatch(fetchAllFeatures({ limit: 1000 }));
    }
  }, [dispatch, features]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [formTab, setFormTab] = useState("basic");

  // Tag inputs state inside modal
  const [tagInputs, setTagInputs] = useState({
    procedure: "",
    condition: "",
    technology: "",
    symptom: "",
    benefit: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    icon: "",
    procedures: [],
    conditions: [],
    technologies: [],
    symptoms: [],
    benefits: [],
    features: [],
    faqs: [],
    published: true,
    showInHomePage: false,
    orderIndex: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      image: "",
      icon: "",
      procedures: [],
      conditions: [],
      technologies: [],
      symptoms: [],
      benefits: [],
      features: [],
      faqs: [],
      published: true,
      showInHomePage: false,
      orderIndex: 0,
    });
    setTagInputs({
      procedure: "",
      condition: "",
      technology: "",
      symptom: "",
      benefit: "",
    });
    setFormTab("basic");
  };

  const totalPages = backendTotalPages || 1;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = services || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper to add tag
  const addTag = (key, inputKey) => {
    const value = tagInputs[inputKey]?.trim();
    if (!value) return;
    if (formData[key].includes(value)) {
      toast.error(`"${value}" is already added.`);
      return;
    }
    setFormData({
      ...formData,
      [key]: [...formData[key], value],
    });
    setTagInputs({ ...tagInputs, [inputKey]: "" });
  };

  // Helper to remove tag
  const removeTag = (key, index) => {
    setFormData({
      ...formData,
      [key]: formData[key].filter((_, i) => i !== index),
    });
  };

  // Helper to toggle feature checkbox
  const toggleFeatureSelection = (id) => {
    const current = Array.isArray(formData.features) ? formData.features : [];
    if (current.includes(id)) {
      setFormData({
        ...formData,
        features: current.filter((item) => item !== id),
      });
    } else {
      setFormData({
        ...formData,
        features: [...current, id],
      });
    }
  };

  // Helper to manage FAQs
  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const updateFaq = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const removeFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (srv) => {
    setSelectedService(srv);
    setFormData({
      name: srv.name || "",
      slug: srv.slug || "",
      shortDescription: srv.shortDescription || "",
      description: srv.description || "",
      image: srv.image || "",
      icon: srv.icon || "",
      procedures: Array.isArray(srv.procedures) ? srv.procedures : [],
      conditions: Array.isArray(srv.conditions) ? srv.conditions : [],
      technologies: Array.isArray(srv.technologies) ? srv.technologies : [],
      symptoms: Array.isArray(srv.symptoms) ? srv.symptoms : [],
      benefits: Array.isArray(srv.benefits) ? srv.benefits : [],
      features: Array.isArray(srv.features)
        ? srv.features.map((f) => f._id || f)
        : [],
      faqs: Array.isArray(srv.faqs) ? srv.faqs : [],
      published: srv.published !== undefined ? srv.published : true,
      showInHomePage: srv.showInHomePage || false,
      orderIndex: srv.orderIndex || 0,
    });
    setFormTab("basic");
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shortDescription.trim() || !formData.description.trim()) {
      toast.error("Service name, short description, and full description are required.");
      return;
    }

    try {
      const result = await dispatch(addNewService(formData));
      if (addNewService.fulfilled.match(result)) {
        toast.success("Service created successfully");
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to add service");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shortDescription.trim() || !formData.description.trim()) {
      toast.error("Service name, short description, and full description are required.");
      return;
    }

    try {
      const result = await dispatch(
        updateServiceById({ id: selectedService._id, serviceData: formData })
      );
      if (updateServiceById.fulfilled.match(result)) {
        toast.success("Service updated successfully");
        setIsEditModalOpen(false);
        setSelectedService(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to update service");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const openDeleteModal = (srv) => {
    setSelectedService(srv);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteServiceById(selectedService._id));
      if (deleteServiceById.fulfilled.match(result)) {
        toast.success("Service deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedService(null);
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(result.payload || "Failed to delete service");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const openViewModal = (srv) => {
    setViewingService(srv);
    setIsViewModalOpen(true);
  };

  const handleToggleStatus = async (srv) => {
    try {
      const result = await dispatch(toggleServiceStatus(srv._id));
      if (toggleServiceStatus.fulfilled.match(result)) {
        toast.success(`Service status updated`);
      } else {
        toast.error(result.payload || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Medical Services</h2>
          <p className="text-sm text-slate-500">Manage clinical services, procedures, technologies, and FAQs.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition w-full"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 shadow-md shadow-blue-500/20 transition shrink-0 cursor-pointer"
          >
            <Plus size={18} /> Add Service
          </button>
        </div>
      </div>

      {/* TABLE */}
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
                <th className="px-6 py-4">Service Info</th>
                <th className="px-6 py-4">Clinical Tags</th>
                <th className="px-6 py-4">Linked Features</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {currentItems.length > 0 ? (
                currentItems.map((srv) => (
                  <tr
                    key={srv._id}
                    onClick={() => openViewModal(srv)}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                          <Stethoscope size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {srv.name}
                          </div>
                          <div className="text-xs text-slate-400 font-medium max-w-xs truncate">
                            {srv.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {srv.procedures?.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-medium">
                            {srv.procedures.length} Procedures
                          </span>
                        )}
                        {srv.technologies?.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-medium">
                            {srv.technologies.length} Techs
                          </span>
                        )}
                        {srv.faqs?.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100 font-medium">
                            {srv.faqs.length} FAQs
                          </span>
                        )}
                        {!srv.procedures?.length && !srv.technologies?.length && !srv.faqs?.length && (
                          <span className="text-xs text-slate-400 italic">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {Array.isArray(srv.features) && srv.features.length > 0 ? (
                          srv.features.map((f, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium truncate max-w-[120px]"
                            >
                              {typeof f === "object" ? f.name : "Feature"}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleStatus(srv)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                          srv.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {srv.published ? (
                          <>
                            <CheckCircle size={12} /> Published
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition cursor-pointer border border-transparent hover:border-blue-100"
                          title="Edit service"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(srv)}
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-100"
                          title="Delete service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No services found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfFirstItem + currentItems.length, totalServices || currentItems.length)} of {totalServices || currentItems.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  } cursor-pointer`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT FORM MODAL */}
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
              className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 bg-white shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {isEditModalOpen ? "Edit Service" : "Add New Medical Service"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure service specifications, clinical parameters, features, and FAQs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50 overflow-x-auto">
                {[
                  { id: "basic", label: "Basic Info" },
                  { id: "clinical", label: "Clinical Tags" },
                  { id: "features_faqs", label: "Features & FAQs" },
                  { id: "status", label: "Visibility & Ordering" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFormTab(tab.id)}
                    className={`py-3 px-4 text-sm font-semibold whitespace-nowrap transition relative cursor-pointer ${
                      formTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  {/* TAB 1: BASIC INFO */}
                  {formTab === "basic" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Service Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Laser Kidney Stone Surgery (RIRS)"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Custom Slug (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. laser-kidney-stone-surgery"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Short Summary / Tagline <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Brief 1-2 sentence overview for cards and listings"
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Full Description <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Detailed overview of the medical service..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition leading-relaxed resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CLINICAL TAGS */}
                  {formTab === "clinical" && (
                    <div className="space-y-5">
                      {/* Procedures */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Procedures</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Add procedure..."
                            value={tagInputs.procedure}
                            onChange={(e) => setTagInputs({ ...tagInputs, procedure: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("procedures", "procedure"))}
                            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => addTag("procedures", "procedure")}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.procedures.map((p, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex items-center gap-1.5 font-medium">
                              {p}
                              <button type="button" onClick={() => removeTag("procedures", i)} className="hover:text-rose-600"><X size={12}/></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Conditions */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Treated Conditions</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Add condition..."
                            value={tagInputs.condition}
                            onChange={(e) => setTagInputs({ ...tagInputs, condition: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("conditions", "condition"))}
                            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => addTag("conditions", "condition")}
                            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-semibold hover:bg-purple-100 transition"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.conditions.map((c, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 flex items-center gap-1.5 font-medium">
                              {c}
                              <button type="button" onClick={() => removeTag("conditions", i)} className="hover:text-rose-600"><X size={12}/></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technologies Used</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g. Holmium Laser System..."
                            value={tagInputs.technology}
                            onChange={(e) => setTagInputs({ ...tagInputs, technology: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("technologies", "technology"))}
                            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => addTag("technologies", "technology")}
                            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.technologies.map((t, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium">
                              {t}
                              <button type="button" onClick={() => removeTag("technologies", i)} className="hover:text-rose-600"><X size={12}/></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Patient Benefits</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g. No Incisions, Same Day Discharge..."
                            value={tagInputs.benefit}
                            onChange={(e) => setTagInputs({ ...tagInputs, benefit: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("benefits", "benefit"))}
                            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => addTag("benefits", "benefit")}
                            className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-semibold hover:bg-amber-100 transition"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.benefits.map((b, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 flex items-center gap-1.5 font-medium">
                              {b}
                              <button type="button" onClick={() => removeTag("benefits", i)} className="hover:text-rose-600"><X size={12}/></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: FEATURES & FAQS */}
                  {formTab === "features_faqs" && (
                    <div className="space-y-6">
                      {/* Linked Features */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Linked Features / Highlights</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          {features && features.length > 0 ? (
                            features.map((feat) => (
                              <label key={feat._id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-white transition">
                                <input
                                  type="checkbox"
                                  checked={formData.features.includes(feat._id)}
                                  onChange={() => toggleFeatureSelection(feat._id)}
                                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                />
                                <span className="font-medium">{feat.name}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic col-span-2">No features found in database.</p>
                          )}
                        </div>
                      </div>

                      {/* FAQs */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase">Frequently Asked Questions ({formData.faqs.length})</label>
                          <button
                            type="button"
                            onClick={addFaq}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1"
                          >
                            <Plus size={14}/> Add FAQ
                          </button>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {formData.faqs.map((faq, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group">
                              <button
                                type="button"
                                onClick={() => removeFaq(idx)}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded transition"
                              >
                                <X size={14} />
                              </button>
                              <input
                                type="text"
                                placeholder={`Question #${idx + 1}`}
                                value={faq.question}
                                onChange={(e) => updateFaq(idx, "question", e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-semibold"
                              />
                              <textarea
                                rows={2}
                                placeholder="Answer..."
                                value={faq.answer}
                                onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 resize-none"
                              />
                            </div>
                          ))}
                          {formData.faqs.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                              No FAQs added yet. Click "Add FAQ" to include Q&A items.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: VISIBILITY & ORDERING */}
                  {formTab === "status" && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Published Status</p>
                          <p className="text-xs text-slate-500">Make this service publicly visible on the portal.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Show on Home Page</p>
                          <p className="text-xs text-slate-500">Feature this service on the main landing homepage.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.showInHomePage}
                          onChange={(e) => setFormData({ ...formData, showInHomePage: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Display Order Index
                        </label>
                        <input
                          type="number"
                          value={formData.orderIndex}
                          onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Saving..." : isEditModalOpen ? "Update Service" : "Create Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {isViewModalOpen && viewingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{viewingService.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">slug: /{viewingService.slug}</p>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tagline / Short Summary</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-150 font-medium">
                    {viewingService.shortDescription}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Description</span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-150 leading-relaxed whitespace-pre-wrap">
                    {viewingService.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {viewingService.procedures?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Procedures</span>
                      <div className="flex flex-wrap gap-1">
                        {viewingService.procedures.map((p, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewingService.technologies?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Technologies</span>
                      <div className="flex flex-wrap gap-1">
                        {viewingService.technologies.map((t, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQs */}
                {viewingService.faqs?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">FAQs ({viewingService.faqs.length})</span>
                    <div className="space-y-2">
                      {viewingService.faqs.map((faq, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                          <p className="text-xs font-bold text-slate-800">Q: {faq.question}</p>
                          <p className="text-xs text-slate-600">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-end gap-3">
                <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-100 text-slate-600 transition cursor-pointer">
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(viewingService);
                  }}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 shadow-md transition cursor-pointer"
                >
                  Edit Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete Service</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete <span className="font-bold text-slate-700">"{selectedService.name}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20 transition cursor-pointer">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;
