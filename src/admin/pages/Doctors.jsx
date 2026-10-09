import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  User,
  Stethoscope,
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  Sparkles,
  Info,
} from "lucide-react";
import {
  fetchAllDoctors,
  addNewDoctor,
  updateDoctorById,
  deleteDoctorById,
} from "../../redux/features/doctor/doctorThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import toast from "react-hot-toast";

const FORM_TABS = [
  { id: "basic", label: "Basic & Practice", icon: User },
  { id: "about", label: "About & Bio", icon: FileText },
  { id: "expertise", label: "Field Of Expertise", icon: Stethoscope },
  { id: "publications", label: "Research & Publications", icon: BookOpen },
  { id: "certifications", label: "Certifications & Memberships", icon: Award },
];

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  department: "",
  qualifications: "",
  languages: "English, Hindi, Odia",
  timing: "10:00 AM - 02:00 PM • Mon to Sat",
  description: "",
  about: "",
  expertise: "",
  publications: "",
  certifications: "",
  photo: null,
  isAvailable: true,
};

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, pagination, loading } = useSelector((state) => state.doctor || {});
  const { departments } = useSelector((state) => state.department || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllDoctors({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchAllDepartments({ limit: 1000 }));
    }
  }, [dispatch, departments]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [viewTab, setViewTab] = useState("about");

  const [formActiveTab, setFormActiveTab] = useState("basic");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [photoPreview, setPhotoPreview] = useState(null);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setPhotoPreview(null);
    setFormActiveTab("basic");
  };

  const totalPages = pagination?.totalPages || 1;
  const totalDoctors = pagination?.total || 0;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = doctors || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateBaseFields = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.specialization || !formData.department) {
      toast.error("Please fill all required basic fields (*)");
      setFormActiveTab("basic");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      setFormActiveTab("basic");
      return false;
    }
    return true;
  };

  const buildFormDataPayload = () => {
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("email", formData.email.trim().toLowerCase());
    data.append("phone", formData.phone.trim());
    data.append("specialization", formData.specialization.trim());
    data.append("department", formData.department);
    if (formData.experience !== undefined && formData.experience !== "") {
      data.append("experience", formData.experience);
    }
    if (formData.qualifications) data.append("qualifications", formData.qualifications.trim());
    if (formData.languages) data.append("languages", formData.languages.trim());
    if (formData.timing) data.append("timing", formData.timing.trim());
    
    // Bio / About
    const bioContent = (formData.about || formData.description || "").trim();
    if (bioContent) {
      data.append("about", bioContent);
      data.append("description", bioContent);
    }

    // Dynamic Lists
    if (formData.expertise) data.append("expertise", formData.expertise.trim());
    if (formData.publications) data.append("publications", formData.publications.trim());
    if (formData.certifications) data.append("certifications", formData.certifications.trim());

    if (formData.photo) data.append("photo", formData.photo);
    data.append("isAvailable", formData.isAvailable);

    return data;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateBaseFields()) return;

    const data = buildFormDataPayload();

    try {
      const result = await dispatch(addNewDoctor(data));
      if (addNewDoctor.fulfilled.match(result)) {
        toast.success("Doctor added successfully!");
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to add doctor");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const openEditModal = (doc) => {
    setSelectedDoctor(doc);
    const toMultiline = (val) => {
      if (Array.isArray(val)) return val.join("\n");
      if (typeof val === "string") return val;
      return "";
    };

    setFormData({
      name: doc.name || "",
      email: doc.email || "",
      phone: doc.phone || "",
      specialization: doc.specialization || "",
      experience: doc.experience !== undefined ? doc.experience : "",
      department: doc.department?._id || doc.department || "",
      qualifications: doc.qualifications || "",
      languages: doc.languages || "",
      timing: doc.timing || "",
      description: doc.description || doc.about || "",
      about: doc.about || doc.description || "",
      expertise: toMultiline(doc.expertise),
      publications: toMultiline(doc.publications),
      certifications: toMultiline(doc.certifications),
      photo: null,
      isAvailable: doc.isAvailable !== undefined ? doc.isAvailable : true,
    });
    setPhotoPreview(doc.photo ? doc.photo : null);
    setFormActiveTab("basic");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateBaseFields()) return;

    const data = buildFormDataPayload();

    try {
      const result = await dispatch(
        updateDoctorById({ id: selectedDoctor._id, doctorData: data })
      );
      if (updateDoctorById.fulfilled.match(result)) {
        toast.success("Doctor details updated successfully!");
        setIsEditModalOpen(false);
        setSelectedDoctor(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to update doctor");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const openDeleteModal = (doc) => {
    setSelectedDoctor(doc);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (doc) => {
    setViewingDoctor(doc);
    setViewTab("about");
    setIsViewModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteDoctorById(selectedDoctor._id));
      if (deleteDoctorById.fulfilled.match(result)) {
        toast.success("Doctor deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedDoctor(null);
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(result.payload || "Failed to delete doctor");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Doctors Management</h2>
          <p className="text-sm text-slate-500">Manage doctor profiles, qualifications, clinical expertise, publications & memberships.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00B4EA] hover:bg-[#0096c4] text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00B4EA]/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Add Doctor
        </motion.button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00B4EA] transition-colors" />
          <input
            type="text"
            placeholder="Search by name, specialization, or department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#00B4EA] rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{totalDoctors}</span> doctors
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[320px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B4EA]"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {currentItems.length > 0 ? (
                currentItems.map((doc) => (
                  <tr
                    key={doc._id}
                    onClick={() => openViewModal(doc)}
                    className="hover:bg-slate-50/80 active:bg-slate-100/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-[#00B4EA] group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-xs transition-transform group-hover:scale-105">
                        {doc.photo ? (
                          <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 group-hover:text-[#00B4EA] transition-colors">
                      Dr. {doc.name.replace(/^Dr\.?\s*/i, "")}
                      {doc.qualifications && (
                        <div className="text-[11px] text-slate-400 font-normal truncate max-w-[200px]">
                          {doc.qualifications}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{doc.specialization || "General"}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{doc.department?.name || "—"}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {doc.experience !== undefined ? `${doc.experience} Yrs` : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-medium">
                        <span className="text-slate-700">{doc.email}</span>
                        <span className="text-slate-400 mt-0.5">{doc.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          doc.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {doc.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(doc);
                          }}
                          className="p-2 hover:bg-sky-50 text-[#00B4EA] hover:text-[#0096c4] rounded-xl transition-all cursor-pointer border border-transparent hover:border-sky-100"
                          title="Edit doctor"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(doc);
                          }}
                          className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100"
                          title="Delete doctor"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">
                    No doctors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Showing {totalDoctors === 0 ? 0 : indexOfFirstItem + 1} to {indexOfFirstItem + currentItems.length} of {totalDoctors}
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
                      ? "bg-[#00B4EA] text-white shadow-md shadow-[#00B4EA]/20"
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

      {/* ── ADD / EDIT DOCTOR MODAL ── */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles size={18} className="text-[#00B4EA]" />
                    {isEditModalOpen ? "Edit Doctor Profile" : "Add New Doctor"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure doctor credentials, biography, and the 4 public profile tabs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1.5 hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Navigation inside Modal */}
              <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto gap-1 shrink-0 scrollbar-none">
                {FORM_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = formActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFormActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                        isActive
                          ? "border-[#00B4EA] text-[#00B4EA] bg-sky-50/50"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-[#00B4EA]" : "text-slate-400"} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Content Area */}
              <form
                onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-5"
              >
                {/* ══ TAB 1: BASIC & PRACTICE INFO ══ */}
                {formActiveTab === "basic" && (
                  <div className="space-y-5">
                    {/* Photo Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group shrink-0 shadow-xs">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-300 w-8 h-8" />
                        )}
                        <div
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="text-white w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <div className="text-xs font-bold text-slate-700">Doctor Profile Photo</div>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Upload high-resolution square image (JPG, PNG, WebP). Max 5MB.
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-1 px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Upload size={12} />
                          Browse File
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Nirmala N. G"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="doctor@ramachandraurology.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Phone Number (10 digits) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Department <span className="text-rose-500">*</span>
                        </label>
                        <select
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition text-slate-700"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Specialization <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Senior Urologist & Laser Surgeon"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Experience (Years) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="12"
                          min="0"
                          max="60"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 block">Availability Status</label>
                        <select
                          value={formData.isAvailable}
                          onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === "true" })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition text-slate-700"
                        >
                          <option value="true">Available for Consultations</option>
                          <option value="false">Unavailable</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Qualifications & Degrees
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. MBBS, MS (General Surgery), MCh (Urology)"
                          value={formData.qualifications}
                          onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-600 block">
                          Consultation Timings / OPD Hours
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 10:00 AM - 02:00 PM • Mon to Sat"
                          value={formData.timing}
                          onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-600 block">Languages Spoken</label>
                        <input
                          type="text"
                          placeholder="e.g. English, Hindi, Odia"
                          value={formData.languages}
                          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ TAB 2: ABOUT / BIOGRAPHY ══ */}
                {formActiveTab === "about" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-3 text-xs text-sky-900 leading-relaxed">
                      <Info size={16} className="text-[#00B4EA] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Doctor Biography (About Tab)</strong>
                        <p className="mt-0.5 text-sky-800/80">
                          Provide paragraphs about the doctor&apos;s background, education, and patient care philosophy. Multiple paragraphs separated by blank lines will format naturally on the profile page.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block">
                        Detailed Biography / About Dr. {formData.name || "Doctor"}
                      </label>
                      <textarea
                        rows="10"
                        placeholder="Dr. Nirmala is a distinguished specialist with over three decades of expertise...&#10;&#10;Driven by a vision to address health issues at a community level, her MD equips her with a comprehensive understanding of societal health dynamics."
                        value={formData.about || formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about: e.target.value,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* ══ TAB 3: FIELD OF EXPERTISE ══ */}
                {formActiveTab === "expertise" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-3 text-xs text-sky-900 leading-relaxed">
                      <Stethoscope size={16} className="text-[#00B4EA] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Field Of Expertise (One point per line)</strong>
                        <p className="mt-0.5 text-sky-800/80">
                          Each line entered below will render as a distinct bullet item on the &quot;Field Of Expertise&quot; tab on the Doctor Details page.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block">
                        Clinical Expertise & Surgeries List
                      </label>
                      <textarea
                        rows="10"
                        placeholder="Pregnancy care (antenatal, intrapartum & postnatal)&#10;High-risk pregnancy management&#10;Normal vaginal delivery&#10;Cesarean section (C-section)&#10;Labour management & fetal monitoring&#10;Multiple pregnancy care (twins, etc.)"
                        value={formData.expertise}
                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                        className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition leading-relaxed font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* ══ TAB 4: RESEARCH & PUBLICATIONS ══ */}
                {formActiveTab === "publications" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-900 leading-relaxed">
                      <BookOpen size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Research & Publications (One point per line)</strong>
                        <p className="mt-0.5 text-emerald-800/80">
                          Add published scientific papers, clinical studies, journal articles, and conference talks (one per line).
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block">
                        Publications & Research Papers List
                      </label>
                      <textarea
                        rows="10"
                        placeholder="Authored multiple research papers in reputed scientific journals&#10;Speaker and active participant at various conferences and gatherings of OBG&#10;Comparative clinical study of laser stone interventions (2023)"
                        value={formData.publications}
                        onChange={(e) => setFormData({ ...formData, publications: e.target.value })}
                        className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition leading-relaxed font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* ══ TAB 5: CERTIFICATIONS & MEMBERSHIPS ══ */}
                {formActiveTab === "certifications" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
                      <Award size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Certifications & Memberships (One point per line)</strong>
                        <p className="mt-0.5 text-amber-800/80">
                          Add medical council registrations, fellowships, society memberships, and board certifications (one per line).
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 block">
                        Certifications & Professional Memberships List
                      </label>
                      <textarea
                        rows="10"
                        placeholder="MBBS – Osmania Medical College&#10;DGO – Gandhi Medical College&#10;MD – Community Medicine&#10;Masters in Hospital Administration&#10;Member of Federation of Obstetric and Gynaecological Societies of India (FOGSI)"
                        value={formData.certifications}
                        onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#00B4EA] focus:bg-white rounded-xl text-sm outline-none transition leading-relaxed font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                  <div className="flex items-center gap-2">
                    {formActiveTab !== "basic" && (
                      <button
                        type="button"
                        onClick={() => {
                          const idx = FORM_TABS.findIndex((t) => t.id === formActiveTab);
                          if (idx > 0) setFormActiveTab(FORM_TABS[idx - 1].id);
                        }}
                        className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Previous Step
                      </button>
                    )}
                    {formActiveTab !== "certifications" && (
                      <button
                        type="button"
                        onClick={() => {
                          const idx = FORM_TABS.findIndex((t) => t.id === formActiveTab);
                          if (idx < FORM_TABS.length - 1) setFormActiveTab(FORM_TABS[idx + 1].id);
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
                      >
                        Next Step
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
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
                      className="px-6 py-2.5 bg-[#00B4EA] hover:bg-[#0096c4] text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00B4EA]/20 transition cursor-pointer disabled:opacity-70"
                    >
                      {loading ? "Saving..." : isEditModalOpen ? "Save Changes" : "Create Doctor"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ── DELETE CONFIRMATION MODAL ── */}
        {isDeleteModalOpen && selectedDoctor && (
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
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden z-10 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500 leading-normal">
                    Are you sure you want to delete Dr.{" "}
                    <span className="font-semibold text-slate-700">{selectedDoctor.name}</span>? This action is permanent.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition cursor-pointer disabled:opacity-70"
                >
                  {loading ? "Deleting..." : "Delete Doctor"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── DOCTOR PREVIEW MODAL WITH PROFILE TABS ── */}
        {isViewModalOpen && viewingDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
              className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
            >
              {/* Doctor Profile Banner */}
              <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/60 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                    {viewingDoctor.photo ? (
                      <img src={viewingDoctor.photo} alt={viewingDoctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Stethoscope size={28} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Dr. {viewingDoctor.name.replace(/^Dr\.?\s*/i, "")}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                        {viewingDoctor.specialization || "General Medicine"}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          viewingDoctor.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {viewingDoctor.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 hover:bg-slate-200/70 rounded-lg cursor-pointer transition-colors text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 4 Profile Tabs matching live website UI */}
              <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
                {[
                  { id: "about", label: "About" },
                  { id: "expertise", label: "Field Of Expertise" },
                  { id: "publications", label: "Research & Publications" },
                  { id: "certifications", label: "Certification & Memberships" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setViewTab(t.id)}
                    className={`py-3 text-[11px] sm:text-xs font-bold transition-all cursor-pointer border-none text-center px-1 truncate ${
                      viewTab === t.id
                        ? "text-white bg-[#00B4EA]"
                        : "text-slate-600 bg-transparent hover:text-[#00B4EA] hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Viewer Content */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white min-h-[220px]">
                {viewTab === "about" && (
                  <div className="space-y-4 w-full">
                    <h4 className="text-sm font-bold text-slate-800">
                      About Dr. {viewingDoctor.name.replace(/^Dr\.?\s*/i, "")}
                    </h4>
                    <div className="text-slate-650 text-xs sm:text-sm leading-relaxed sm:leading-loose space-y-3 w-full">
                      {(viewingDoctor.about || viewingDoctor.description) ? (
                        (viewingDoctor.about || viewingDoctor.description)
                          .split(/\n\s*\n/)
                          .map((p) => p.replace(/\r?\n/g, " ").trim())
                          .filter(Boolean)
                          .map((p, i) => <p key={i} className="w-full text-slate-650">{p}</p>)
                      ) : (
                        <p className="text-slate-400 italic">No biography provided yet.</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Qualifications</span>
                        <span className="font-bold text-slate-700">{viewingDoctor.qualifications || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">OPD Timing</span>
                        <span className="font-bold text-slate-700">{viewingDoctor.timing || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Department</span>
                        <span className="font-bold text-slate-700">{viewingDoctor.department?.name || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Languages</span>
                        <span className="font-bold text-slate-700">{viewingDoctor.languages || "—"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {viewTab === "expertise" && (
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800">Field Of Expertise</h4>
                      {Array.isArray(viewingDoctor.expertise) && viewingDoctor.expertise.length > 0 && (
                        <span className="text-[11px] font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                          {viewingDoctor.expertise.length} Specializations
                        </span>
                      )}
                    </div>
                    {Array.isArray(viewingDoctor.expertise) && viewingDoctor.expertise.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                        {viewingDoctor.expertise.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                            <div className="w-5 h-5 rounded-full bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0">
                              <CheckCircle2 size={12} />
                            </div>
                            <span className="text-xs text-slate-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-xs">No expertise details added.</p>
                    )}
                  </div>
                )}

                {viewTab === "publications" && (
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800">Research & Publications</h4>
                      {Array.isArray(viewingDoctor.publications) && viewingDoctor.publications.length > 0 && (
                        <span className="text-[11px] font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                          {viewingDoctor.publications.length} Publications
                        </span>
                      )}
                    </div>
                    {Array.isArray(viewingDoctor.publications) && viewingDoctor.publications.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                        {viewingDoctor.publications.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                            <div className="w-6 h-6 rounded-lg bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0 mt-0.5">
                              <BookOpen size={12} />
                            </div>
                            <span className="text-xs text-slate-700 leading-relaxed font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-xs">No research publications added.</p>
                    )}
                  </div>
                )}

                {viewTab === "certifications" && (
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800">Certification & Memberships</h4>
                      {Array.isArray(viewingDoctor.certifications) && viewingDoctor.certifications.length > 0 && (
                        <span className="text-[11px] font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                          {viewingDoctor.certifications.length} Accreditations
                        </span>
                      )}
                    </div>
                    {Array.isArray(viewingDoctor.certifications) && viewingDoctor.certifications.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                        {viewingDoctor.certifications.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                            <div className="w-5 h-5 rounded-full bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0">
                              <Award size={12} />
                            </div>
                            <span className="text-xs text-slate-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-xs">No certifications or memberships added.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Preview Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(viewingDoctor);
                  }}
                  className="px-5 py-2 bg-[#00B4EA] hover:bg-[#0096c4] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#00B4EA]/20 transition cursor-pointer"
                >
                  Edit Doctor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Doctors;
