import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

import {
  fetchAllDepartments,
  addNewDepartment,
  updateDepartmentById,
  deleteDepartmentById,
} from "../../redux/features/department/departmentThunk";
import DepartmentTable from "../components/departments/DepartmentTable";
import DepartmentFormModal from "../components/departments/DepartmentFormModal";
import DepartmentDeleteModal from "../components/departments/DepartmentDeleteModal";
import { fetchAllDoctors } from "../../redux/features/doctor/doctorThunk";
import { fetchAllFeatures } from "../../redux/features/feature/featureThunk";
import { fetchAllDiseases } from "../../redux/features/disease/diseaseThunk";
import toast from "react-hot-toast";

const Departments = () => {
  const dispatch = useDispatch();
  const { departments, totalDepartments, totalPages: backendTotalPages, loading } = useSelector((state) => state.department || {});
  const { doctors } = useSelector((state) => state.doctor || {});
  const { features } = useSelector((state) => state.feature || { features: [] });
  const { diseases } = useSelector((state) => state.disease || { diseases: [] });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllDepartments({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  useEffect(() => {
    if (!doctors || doctors.length === 0) dispatch(fetchAllDoctors({ limit: 1000 }));
    if (!features || features.length === 0) dispatch(fetchAllFeatures({ limit: 1000 }));
    if (!diseases || diseases.length === 0) dispatch(fetchAllDiseases({ limit: 1000 }));
  }, [dispatch, doctors, features, diseases]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState(null);

  const [selectedDept, setSelectedDept] = useState(null);
  const [formTab, setFormTab] = useState("basic");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    content: "",
    features: [],
    diseases: [],
    doctors: [],
    emergencyAvailable: false,
    opdTime: "",
    published: true,
    category: "General",
    showInHomePage: false,
    showInServicesPage: false,
    orderIndex: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      content: "",
      features: [],
      diseases: [],
      doctors: [],
      emergencyAvailable: false,
      opdTime: "",
      published: true,
      category: "General",
      showInHomePage: false,
      showInServicesPage: false,
      orderIndex: 0,
    });
    setFormTab("basic");
  };

  const totalPages = backendTotalPages || 1;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = departments || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, icon: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const isValidObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

  const preparePayload = () => {
    const rawFeatures = Array.isArray(formData.features)
      ? formData.features
      : formData.features
      ? formData.features.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    const rawDiseases = Array.isArray(formData.diseases)
      ? formData.diseases
      : formData.diseases
      ? formData.diseases.split(",").map((d) => (d.name || d).toString().trim()).filter(Boolean)
      : [];

    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      content: formData.content.trim(),
      image: formData.image,
      icon: formData.icon,
      color: formData.color || "#007bff",
      features: rawFeatures.filter(isValidObjectId),
      diseases: rawDiseases.filter(isValidObjectId),
      emergencyAvailable: Boolean(formData.emergencyAvailable),
      opdTime: formData.opdTime || "",
      published: formData.published !== undefined ? Boolean(formData.published) : true,
      category: formData.category || "General",
      showInHomePage: Boolean(formData.showInHomePage),
      showInServicesPage: Boolean(formData.showInServicesPage),
      orderIndex: Number(formData.orderIndex) || 0,
    };
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast.error("Department name, description, and full content are required.");
      return;
    }

    try {
      const result = await dispatch(addNewDepartment(preparePayload()));
      if (addNewDepartment.fulfilled.match(result)) {
        toast.success("Department created successfully");
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to add department");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name || "",
      slug: dept.slug || "",
      description: dept.description || "",
      content: dept.content || "",
      features: Array.isArray(dept.features)
        ? dept.features.map((f) => f._id || f)
        : [],
      diseases: Array.isArray(dept.diseases)
        ? dept.diseases.map((d) => d._id || d)
        : [],
      doctors: Array.isArray(dept.doctors)
        ? dept.doctors.map((doc) => doc._id || doc)
        : [],
      emergencyAvailable: dept.emergencyAvailable || false,
      opdTime: dept.opdTime || "",
      published: dept.published !== undefined ? dept.published : true,
      category: dept.category || "General",
      showInHomePage: dept.showInHomePage || false,
      showInServicesPage: dept.showInServicesPage || false,
      orderIndex: dept.orderIndex || 0,
    });
    setFormTab("basic");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast.error("Department name, description, and full content are required.");
      return;
    }

    try {
      const result = await dispatch(
        updateDepartmentById({ id: selectedDept._id, departmentData: preparePayload() })
      );
      if (updateDepartmentById.fulfilled.match(result)) {
        toast.success("Department updated successfully");
        setIsEditModalOpen(false);
        setSelectedDept(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to update department");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  const openDeleteModal = (dept) => {
    setSelectedDept(dept);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (dept) => {
    setViewingDept(dept);
    setIsViewModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deleteDepartmentById(selectedDept._id));
      if (deleteDepartmentById.fulfilled.match(result)) {
        toast.success("Department deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedDept(null);
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(result.payload || "Failed to delete department");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Departments</h2>
          <p className="text-sm text-slate-500">Manage hospital departments, services, and assignments.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition w-full sm:w-64"
          />
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 shadow-md shadow-blue-500/20 transition shrink-0 cursor-pointer"
          >
            <Plus size={18} /> Add Department
          </button>
        </div>
      </div>

      <DepartmentTable
        loading={loading}
        currentItems={currentItems}
        doctors={doctors}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        openViewModal={openViewModal}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfFirstItem + currentItems.length}
        filteredDeptsLength={totalDepartments || currentItems.length}
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <DepartmentFormModal
            isEditModalOpen={isEditModalOpen}
            closeModal={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
            }}
            formTab={formTab}
            setFormTab={setFormTab}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}
            loading={loading}
            allFeatures={features || []}
            allDiseases={diseases || []}
            allDoctors={doctors || []}
          />
        )}
        {isDeleteModalOpen && selectedDept && (
          <DepartmentDeleteModal
            selectedDept={selectedDept}
            closeModal={() => setIsDeleteModalOpen(false)}
            handleDeleteConfirm={handleDeleteConfirm}
            loading={loading}
          />
        )}

  {/* DEPARTMENT VIEW DETAILS MODAL */}
  {isViewModalOpen && viewingDept && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/55 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md font-bold text-lg" style={{ backgroundColor: viewingDept.color || "#3b82f6" }}>
              {viewingDept.name?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{viewingDept.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-105">{viewingDept.category || "General"}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${viewingDept.published ? "bg-emerald-50 text-emerald-700 border-emerald-250/60" : "bg-slate-105 text-slate-600 border-slate-205"}`}>
                  {viewingDept.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"><X size={18} className="text-slate-400" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {viewingDept.image && (
            <div className="w-full h-44 rounded-xl overflow-hidden relative border border-slate-100 shadow-inner shrink-0">
              <img src={viewingDept.image} alt={viewingDept.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                <p className="text-white text-xs font-semibold drop-shadow-sm">{viewingDept.description}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OPD Timings</span>
              <p className="text-sm font-semibold text-slate-700">{viewingDept.opdTime || "Not Specified"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Services</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-block mt-0.5 ${viewingDept.emergencyAvailable ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {viewingDept.emergencyAvailable ? "Available 24/7" : "Not Available"}
              </span>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Details</span>
              <p className="text-xs text-slate-655 bg-slate-50 p-4 rounded-xl border border-slate-150 leading-relaxed whitespace-pre-wrap">
                {viewingDept.content}
              </p>
            </div>
          </div>

          {/* Features & Diseases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Features / Services</span>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(viewingDept.features)
                  ? viewingDept.features.map(f => (typeof f === 'object' && f !== null ? f.name || f.title || "" : String(f)))
                  : viewingDept.features ? String(viewingDept.features).split(",").map(f => f.trim()) : []
                ).filter(Boolean).map((feat, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-blue-50/50 text-blue-700 rounded-lg border border-blue-100 font-medium">
                    {feat}
                  </span>
                ))}
                {(!viewingDept.features || viewingDept.features.length === 0) && <span className="text-xs text-slate-450 italic">None listed</span>}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treated Diseases</span>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(viewingDept.diseases)
                  ? viewingDept.diseases.map(d => (typeof d === 'object' && d !== null ? d.name || d.title || "" : String(d)))
                  : viewingDept.diseases ? String(viewingDept.diseases).split(",").map(d => d.trim()) : []
                ).filter(Boolean).map((disease, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-purple-50/50 text-purple-700 rounded-lg border border-purple-100 font-medium">
                    {disease}
                  </span>
                ))}
                {(!viewingDept.diseases || viewingDept.diseases.length === 0) && <span className="text-xs text-slate-450 italic">None listed</span>}
              </div>
            </div>
          </div>

          {/* Assigned Doctors */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Specialists</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors && doctors.filter(doc => (doc.department?._id || doc.department) === viewingDept._id).length > 0 ? (
                doctors.filter(doc => (doc.department?._id || doc.department) === viewingDept._id).map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-150">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {doc.photo ? (
                        <img src={doc.photo} alt="Doctor" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                          {doc.name?.substring(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Dr. {doc.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{doc.specialization || "Specialist"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-450 italic col-span-2">No specialist assigned to this department yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-3">
          <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-55 text-slate-655 transition cursor-pointer">Close</button>
          <button onClick={() => { setIsViewModalOpen(false); openEditModal(viewingDept); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer">Edit Department</button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </>
  );
};

export default Departments;