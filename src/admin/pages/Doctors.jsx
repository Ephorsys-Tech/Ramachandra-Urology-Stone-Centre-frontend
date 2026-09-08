import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, Upload, Image as ImageIcon } from "lucide-react";
import { fetchAllDoctors, addNewDoctor, updateDoctorById, deleteDoctorById } from "../../redux/features/doctor/doctorThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import toast from "react-hot-toast";

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctor);
  const { departments } = useSelector((state) => state.department);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchAllDoctors({ limit: 100 }));
    }
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, doctors.length, departments.length]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    department: "",
    qualifications: "",
    description: "",
    languages: "",
    timing: "",
    photo: null,
    isAvailable: true,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      department: "",
      qualifications: "",
      description: "",
      languages: "",
      timing: "",
      photo: null,
      isAvailable: true,
    });
    setPhotoPreview(null);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const searchLow = searchTerm.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(searchLow) ||
      doc.email?.toLowerCase().includes(searchLow) ||
      doc.specialization?.toLowerCase().includes(searchLow)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.specialization || !formData.department) {
      toast.error("Please fill all required fields");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("specialization", formData.specialization);
    data.append("department", formData.department);
    if (formData.experience) data.append("experience", formData.experience);
    if (formData.qualifications) data.append("qualifications", formData.qualifications);
    if (formData.description) data.append("description", formData.description);
    if (formData.languages) data.append("languages", formData.languages);
    if (formData.timing) data.append("timing", formData.timing);
    if (formData.photo) data.append("photo", formData.photo);
    data.append("isAvailable", formData.isAvailable);

    try {
      const result = await dispatch(addNewDoctor(data));
      if (addNewDoctor.fulfilled.match(result)) {
        toast.success("Doctor added successfully");
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
    setFormData({
      name: doc.name || "",
      email: doc.email || "",
      phone: doc.phone || "",
      specialization: doc.specialization || "",
      experience: doc.experience || "",
      department: doc.department?._id || doc.department || "",
      qualifications: doc.qualifications || "",
      description: doc.description || "",
      languages: doc.languages || "",
      timing: doc.timing || "",
      photo: null,
      isAvailable: doc.isAvailable !== undefined ? doc.isAvailable : true,
    });
    setPhotoPreview(doc.photo ? doc.photo : null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("specialization", formData.specialization);
    data.append("department", formData.department);
    if (formData.experience) data.append("experience", formData.experience);
    if (formData.qualifications) data.append("qualifications", formData.qualifications);
    if (formData.description) data.append("description", formData.description);
    if (formData.languages) data.append("languages", formData.languages);
    if (formData.timing) data.append("timing", formData.timing);
    if (formData.photo) data.append("photo", formData.photo);
    data.append("isAvailable", formData.isAvailable);

    try {
      const result = await dispatch(updateDoctorById({ id: selectedDoctor._id, doctorData: data }));
      if (updateDoctorById.fulfilled.match(result)) {
        toast.success("Doctor details updated");
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
    setIsViewModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteDoctorById(selectedDoctor._id));
      if (deleteDoctorById.fulfilled.match(result)) {
        toast.success("Doctor records deleted");
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Doctors Management</h2>
          <p className="text-sm text-slate-500">View, search, edit, or add hospital doctors.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Add Doctor
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition-all placeholder:text-slate-450 text-slate-700"
          />
        </div>
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
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
              {currentItems.length > 0 ? (
                currentItems.map((doc) => (
                  <tr 
                    key={doc._id} 
                    onClick={() => openViewModal(doc)}
                    className="hover:bg-slate-50/80 active:bg-slate-100/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-600 group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                        {doc.photo ? (
                          <img src={doc.photo} alt="Doctor" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-805 group-hover:text-blue-600 transition-colors">
                      Dr. {doc.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{doc.specialization || "General"}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{doc.department?.name || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-medium">
                        <span className="text-slate-700">{doc.email}</span>
                        <span className="text-slate-400 font-mono mt-0.5">{doc.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{doc.experience ? `${doc.experience} Yrs` : "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${doc.isAvailable ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {doc.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(doc); }}
                          className="p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md"
                          title="Edit doctor"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openDeleteModal(doc); }}
                          className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md"
                          title="Delete doctor"
                        >
                          <Trash2 size={14} />
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDoctors.length)} of {filteredDoctors.length}
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
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
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

      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.25 }} className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 sticky top-0 bg-white z-20">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{isEditModalOpen ? "Edit Doctor Info" : "Add New Doctor"}</h3>
                  <p className="text-xs text-slate-450">Fill in the doctor credentials and details.</p>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                {/* Photo Upload */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-400 w-8 h-8" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <Upload className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                    <input type="text" required placeholder="Dr. John Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email *</label>
                    <input type="email" required placeholder="doctor@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone *</label>
                    <input type="tel" required placeholder="9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Specialization *</label>
                    <input type="text" required placeholder="Cardiologist" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Experience (Yrs) *</label>
                    <input type="number" required placeholder="10" min="0" max="60" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Department *</label>
                    <select required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700">
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Qualifications (Degrees)</label>
                    <input type="text" placeholder="e.g. MBBS | MDS (Orthodontics)" value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Languages Spoken</label>
                    <input type="text" placeholder="e.g. English, Hindi, Odia" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Timing / Working Hours</label>
                    <input type="text" placeholder="e.g. 14:00 - 16:00 • Mon, Fri & Sat" value={formData.timing} onChange={(e) => setFormData({ ...formData, timing: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description / Biography</label>
                    <textarea rows="3" placeholder="Doctor's biography, areas of expertise, etc." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700"></textarea>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Availability</label>
                    <select value={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === "true" })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700">
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer disabled:opacity-70">
                    {loading ? "Saving..." : (isEditModalOpen ? "Save Changes" : "Add Doctor")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteModalOpen && selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0"><AlertTriangle size={24} /></div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500 leading-normal">
                    Are you sure you want to delete Dr. <span className="font-semibold text-slate-700">{selectedDoctor.name}</span>? This action is permanent.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                <button type="button" disabled={loading} onClick={handleDeleteConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition cursor-pointer disabled:opacity-70">
                  {loading ? "Deleting..." : "Delete Doctor"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DOCTOR VIEW DETAILS MODAL */}
        {isViewModalOpen && viewingDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              
              <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/55 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 shadow-sm">
                    {viewingDoctor.photo ? (
                      <img src={viewingDoctor.photo} alt="Doctor" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Dr. {viewingDoctor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">{viewingDoctor.specialization || "General Medicine"}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${viewingDoctor.isAvailable ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-slate-105 text-slate-600 border-slate-200"}`}>
                        {viewingDoctor.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"><X size={18} className="text-slate-400" /></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingDoctor.department?.name || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Years of Experience</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingDoctor.experience ? `${viewingDoctor.experience} Years` : "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <p className="text-sm font-semibold text-slate-705 font-mono">{viewingDoctor.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <p className="text-sm font-semibold text-slate-700 break-all">{viewingDoctor.email}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timing / Working Hours</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingDoctor.timing || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-3">
                <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-55 text-slate-650 transition cursor-pointer">Close</button>
                <button onClick={() => { setIsViewModalOpen(false); openEditModal(viewingDoctor); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer">Edit Profile</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Doctors;
