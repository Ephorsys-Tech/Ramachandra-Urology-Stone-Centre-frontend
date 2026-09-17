import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, Filter, CalendarCheck, Check, Clock } from "lucide-react";
import { fetchAllPatients, fetchPatientHistory, addNewPatient, updatePatientById, deletePatientById, addFollowUp } from "../../redux/features/patient/patientThunk";
import { fetchAllDepartments, fetchDoctorsByDepartmentId } from "../../redux/features/department/departmentThunk";
import { clearDepartmentDoctors } from "../../redux/features/department/departmentSlice";
import { fetchAllAppointmentRequests, updateAppointmentRequestStatus, deleteAppointmentRequest, deleteRejectedAppointmentRequests } from "../../redux/features/appointmentRequest/appointmentRequestThunk";
import toast from "react-hot-toast";

const Patients = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { patients, loading: patientLoading } = useSelector((state) => state.patient);
  const { departments, departmentDoctors } = useSelector((state) => state.department);
  const { requests, loading: requestLoading } = useSelector((state) => state.appointmentRequest);

  const [activeTab, setActiveTab] = useState("patients"); // "patients" | "requests"
  const [prevLocation, setPrevLocation] = useState(location);

  // Sync tab from navigation state (e.g. from Notifications bell dropdown)
  if (location !== prevLocation) {
    setPrevLocation(location);
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }

  useEffect(() => {
    if (location.state?.activeTab) {
      // Clean up the location state so it doesn't persist on page refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { totalPages: backendTotalPages, totalPatients } = useSelector((state) => state.patient);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestStatusFilter, setRequestStatusFilter] = useState("Pending");

  // Fetch paginated patients on current page change
  useEffect(() => {
    dispatch(fetchAllPatients({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  // Fetch departments and appointment requests on mount if not already loaded
  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
    if (requests.length === 0) {
      dispatch(fetchAllAppointmentRequests());
    }
  }, [dispatch, departments.length, requests.length]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [viewingPatientHistory, setViewingPatientHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isRequestViewModalOpen, setIsRequestViewModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);

  // Active Patient for Edit/Delete
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // For requests
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Reschedule state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  // Request deletion state
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);

  // Form Steps
  const [currentStep, setCurrentStep] = useState(1);

  // Helper to format Date string to YYYY-MM-DD for date inputs
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    disease: "",
    status: "Outpatient",
    department: "",
    doctor: "",
    source: "Organic",
    treatment: "",
    notes: "",
    appointmentDate: "",
    appointmentTime: ""
  });

  const [editTab, setEditTab] = useState("update"); // "update" | "followup"

  // Reset form helper
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      age: "",
      gender: "Male",
      bloodGroup: "O+",
      phone: "",
      disease: "",
      status: "Outpatient",
      department: "",
      doctor: "",
      source: "Organic",
      treatment: "",
      notes: "",
      appointmentDate: "",
      appointmentTime: ""
    });
    setEditTab("update");
    dispatch(clearDepartmentDoctors());
    setCurrentStep(1);
  };

  // Handle department change & fetch doctors under that department
  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setFormData({ ...formData, department: deptId, doctor: "" });
    if (deptId) {
      dispatch(fetchDoctorsByDepartmentId(deptId));
    } else {
      dispatch(clearDepartmentDoctors());
    }
  };

  // Validate Step 1 before proceeding
  const handleNextStep = () => {
    if (!formData.name || formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (!formData.age) {
      toast.error("Age is required");
      return;
    }
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      toast.error("Age must be between 0 and 150");
      return;
    }
    if (!formData.phone) {
      toast.error("Phone number is required");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setCurrentStep(2);
  };

  // Helper to check if date matches today's date
  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  };

  // Search and filter logic - Patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.disease?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || patient.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Search and filter logic - Today's Appointments
  const todayAppointments = patients.filter((patient) => isToday(patient.appointmentDate));
  const filteredTodayAppointments = todayAppointments.filter((patient) => {
    return patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.phone?.includes(searchTerm) ||
           patient.disease?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Search and filter logic - Requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone?.includes(searchTerm);
    
    const matchesFilter = requestStatusFilter === "All" || req.status === requestStatusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const activeItems = activeTab === "patients" 
    ? filteredPatients 
    : (activeTab === "appointments" ? filteredTodayAppointments : filteredRequests);
    
  const isPatientsTab = activeTab === "patients";

  const totalPages = isPatientsTab 
    ? (backendTotalPages || 1) 
    : Math.max(1, Math.ceil(activeItems.length / itemsPerPage));

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const currentItems = isPatientsTab 
    ? activeItems // backend already applied limit
    : activeItems.slice(indexOfFirstItem, currentPage * itemsPerPage);

  const indexOfLastItem = isPatientsTab 
    ? indexOfFirstItem + currentItems.length 
    : Math.min(currentPage * itemsPerPage, activeItems.length);

  const totalEntries = isPatientsTab ? (totalPatients || activeItems.length) : activeItems.length;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Add Patient Action
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department) {
      toast.error("Please assign a department");
      return;
    }
    if (!formData.doctor) {
      toast.error("Please assign a doctor");
      return;
    }
    if (!formData.disease) {
      toast.error("Please enter a diagnosis / symptoms");
      return;
    }

    try {
      const result = await dispatch(addNewPatient(formData));
      if (addNewPatient.fulfilled.match(result)) {
        toast.success("Patient added successfully");
        setIsAddModalOpen(false);
        resetForm();
        
        // If this came from a request, update the request status
        if (selectedRequest) {
          await dispatch(updateAppointmentRequestStatus({
            id: selectedRequest._id,
            data: { status: "Accepted", adminNotes: "Converted to patient" }
          }));
          setSelectedRequest(null);
        }
      } else {
        toast.error(result.payload || "Failed to add patient");
      }
    } catch (err) {
      toast.error(err ||"An unexpected error occurred");
    }
  };

  // History Modal Opener
  const openHistoryModal = async (patient) => {
    try {
      const result = await dispatch(fetchPatientHistory(patient._id));
      if (fetchPatientHistory.fulfilled.match(result)) {
        setHistoryData(result.payload.data);
        setIsHistoryModalOpen(true);
      } else {
        toast.error(result.payload || "Failed to fetch history");
      }
    } catch (err) {
      toast.error(err || "Unexpected error fetching history");
    }
  };

  const openViewModal = async (patient) => {
    setViewingPatient(patient);
    setIsViewModalOpen(true);
    setViewingPatientHistory([]);
    setLoadingHistory(true);
    try {
      const result = await dispatch(fetchPatientHistory(patient._id));
      if (fetchPatientHistory.fulfilled.match(result)) {
        setViewingPatientHistory(result.payload.data);
      }
    } catch (err) {
      console.error("Prefetch history failed:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openRequestViewModal = (req) => {
    setViewingRequest(req);
    setIsRequestViewModalOpen(true);
  };

  // Edit Patient Modal Opener
  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email || "",
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      disease: patient.disease || "",
      status: patient.status,
      department: patient.department?._id || patient.department || "",
      doctor: patient.doctor?._id || patient.doctor || "",
      source: patient.source || "Organic",
      treatment: "",
      notes: "",
      appointmentDate: patient.appointmentDate ? formatDateToInput(patient.appointmentDate) : "",
      appointmentTime: patient.appointmentTime || ""
    });
    if (patient.department?._id || patient.department) {
      dispatch(fetchDoctorsByDepartmentId(patient.department?._id || patient.department));
    } else {
      dispatch(clearDepartmentDoctors());
    }
    setEditTab("update");
    setIsEditModalOpen(true);
  };

  // Edit Patient Action
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone || !formData.disease) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    
    try {
      const result = await dispatch(updatePatientById({ id: selectedPatient._id, patientData: formData }));
      if (updatePatientById.fulfilled.match(result)) {
        toast.success("Patient details updated");
        setIsEditModalOpen(false);
        setSelectedPatient(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to update patient");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Add Follow Up Action
  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department || !formData.doctor) {
      toast.error("Please assign a department and doctor");
      return;
    }
    
    const payload = {
      phone: selectedPatient.phone,
      email: selectedPatient.email,
      department: formData.department,
      doctor: formData.doctor,
      diagnosis: formData.disease || "Consultation",
      treatment: formData.treatment,
      notes: formData.notes
    };

    try {
      const result = await dispatch(addFollowUp(payload));
      if (addFollowUp.fulfilled.match(result)) {
        toast.success("Follow-up treatment added successfully");
        setIsEditModalOpen(false);
        setSelectedPatient(null);
        resetForm();
      } else {
        toast.error(result.payload || "Failed to add follow-up");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Delete Patient Modal Opener
  const openDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  // Delete Patient Action
  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(deletePatientById(selectedPatient._id));
      if (deletePatientById.fulfilled.match(result)) {
        toast.success("Patient records deleted");
        setIsDeleteModalOpen(false);
        setSelectedPatient(null);
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(result.payload || "Failed to delete patient");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Quick Reschedule Tomorrow
  const handleQuickRescheduleTomorrow = async (patient) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = formatDateToInput(tomorrow);
    try {
      const result = await dispatch(updatePatientById({
        id: patient._id,
        patientData: {
          appointmentDate: dateStr
        }
      }));
      if (updatePatientById.fulfilled.match(result)) {
        toast.success(`Rescheduled to tomorrow (${tomorrow.toLocaleDateString()})`);
      } else {
        toast.error(result.payload || "Failed to reschedule patient");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Open Custom Reschedule Modal
  const openRescheduleModal = (patient) => {
    setSelectedPatient(patient);
    setRescheduleDate(patient.appointmentDate ? formatDateToInput(patient.appointmentDate) : "");
    setRescheduleTime(patient.appointmentTime || "");
    setIsRescheduleModalOpen(true);
  };

  // Submit Custom Reschedule
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate) {
      toast.error("Please select a date");
      return;
    }
    try {
      const result = await dispatch(updatePatientById({
        id: selectedPatient._id,
        patientData: {
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime || null
        }
      }));
      if (updatePatientById.fulfilled.match(result)) {
        toast.success("Appointment rescheduled successfully");
        setIsRescheduleModalOpen(false);
        setSelectedPatient(null);
      } else {
        toast.error(result.payload || "Failed to reschedule patient");
      }
    } catch (err) {
      toast.error(err ||"An unexpected error occurred");
    }
  };

  // Check In Patient (Attended appointment)
  const handleCheckInPatient = async (patient) => {
    try {
      const result = await dispatch(updatePatientById({
        id: patient._id,
        patientData: {
          appointmentDate: null,
          appointmentTime: null,
          status: "In Treatment"
        }
      }));
      if (updatePatientById.fulfilled.match(result)) {
        toast.success("Patient checked in! Appointment completed.");
      } else {
        toast.error(result.payload || "Failed to check in");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Open Delete Request Modal
  const openDeleteRequestModal = (req) => {
    setSelectedRequest(req);
    setIsDeleteRequestModalOpen(true);
  };

  // Confirm Individual Request Deletion
  const handleDeleteRequestConfirm = async () => {
    try {
      const result = await dispatch(deleteAppointmentRequest(selectedRequest._id));
      if (deleteAppointmentRequest.fulfilled.match(result)) {
        toast.success("Appointment request deleted");
        setIsDeleteRequestModalOpen(false);
        setSelectedRequest(null);
      } else {
        toast.error(result.payload || "Failed to delete request");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Delete All Rejected Requests
  const handleDeleteAllRejectedRequests = async () => {
    if (window.confirm("Are you sure you want to delete ALL rejected appointment requests? This cannot be undone.")) {
      try {
        const result = await dispatch(deleteRejectedAppointmentRequests());
        if (deleteRejectedAppointmentRequests.fulfilled.match(result)) {
          toast.success("All rejected requests deleted successfully");
        } else {
          toast.error(result.payload || "Failed to delete rejected requests");
        }
      } catch (err) {
        toast.error(err || "An unexpected error occurred");
      }
    }
  };

  // Accept Request -> Pre-fill Add Modal
  const handleAcceptRequest = (req) => {
    setSelectedRequest(req);
    
    // Find department ID if name matches
    const matchedDept = departments.find(d => d.name.toLowerCase() === req.department?.toLowerCase());
    const deptId = matchedDept ? matchedDept._id : "";
    
    setFormData({
      name: req.name,
      email: req.email || "",
      age: req.age,
      gender: req.gender,
      bloodGroup: "Unknown",
      phone: req.phone,
      disease: req.message || "Consultation",
      status: "Outpatient",
      department: deptId,
      doctor: "",
      source: "Online",
      appointmentDate: req.preferredDate ? formatDateToInput(req.preferredDate) : "",
      appointmentTime: req.preferredTimeSlot || ""
    });
    
    if (deptId) {
      dispatch(fetchDoctorsByDepartmentId(deptId));
    }
    
    setCurrentStep(1);
    setIsAddModalOpen(true);
  };

  // Reject Request
  const openRejectModal = (req) => {
    setSelectedRequest(req);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    try {
      const result = await dispatch(updateAppointmentRequestStatus({
        id: selectedRequest._id,
        data: { status: "Rejected", adminNotes: rejectReason }
      }));
      
      if (updateAppointmentRequestStatus.fulfilled.match(result)) {
        toast.success("Request rejected");
        setIsRejectModalOpen(false);
        setSelectedRequest(null);
      } else {
        toast.error(result.payload || "Failed to reject request");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  // Helper for Status badges styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Admitted": return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "Discharged": return "bg-slate-100 text-slate-700 border-slate-200";
      case "In Treatment": return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Emergency": return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "Outpatient": return "bg-teal-50 text-teal-700 border-teal-200/60";
      case "Recovery": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200/60";
      case "Accepted": return "bg-emerald-50 text-emerald-600 border-emerald-200/60";
      case "Rejected": return "bg-rose-50 text-rose-600 border-rose-200/60";
      default: return "bg-slate-100 text-slate-700 border-slate-250";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Patients Management</h2>
          <p className="text-sm text-slate-500">View patients, manage records, and handle appointment requests.</p>
        </div>
        {activeTab === "patients" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { resetForm(); setSelectedRequest(null); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus size={18} />
            Add Patient
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => { setActiveTab("patients"); setCurrentPage(1); }}
          className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "patients" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          <div className="flex items-center gap-2">
            <Filter size={16} />
            Active Patients
          </div>
          {activeTab === "patients" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => { setActiveTab("appointments"); setCurrentPage(1); }}
          className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "appointments" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          <div className="flex items-center gap-2">
            <Clock size={16} />
            Today's Appointments
            {patients.filter(p => isToday(p.appointmentDate)).length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                {patients.filter(p => isToday(p.appointmentDate)).length}
              </span>
            )}
          </div>
          {activeTab === "appointments" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => { setActiveTab("requests"); setCurrentPage(1); }}
          className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "requests" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          <div className="flex items-center gap-2">
            <CalendarCheck size={16} />
            Appointment Requests
            {requests.filter(r => r.status === "Pending").length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                {requests.filter(r => r.status === "Pending").length}
              </span>
            )}
          </div>
          {activeTab === "requests" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {/* Control bar: Search, filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80 group">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder={activeTab === "patients" ? "Search patient, phone..." : (activeTab === "appointments" ? "Search appointment, phone..." : "Search request, phone...")}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition-all placeholder:text-slate-450 text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider pr-2">
            <Filter size={14} />
            Filter:
          </div>
          {activeTab === "patients" ? (
            ["All", "Outpatient", "Admitted", "Emergency", "In Treatment", "Recovery", "Discharged"].map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))
          ) : activeTab === "appointments" ? (
            <span className="text-xs text-slate-500 font-medium px-2 bg-blue-50 text-blue-700 py-1.5 rounded-lg border border-blue-100">
              Today's Scheduled Appointments
            </span>
          ) : (
            <div className="flex items-center gap-2">
              {["All", "Pending", "Accepted", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => { setRequestStatusFilter(status); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    requestStatusFilter === status
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm font-bold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
              {requestStatusFilter === "Rejected" && requests.filter(r => r.status === "Rejected").length > 0 && (
                <button
                  onClick={handleDeleteAllRejectedRequests}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center gap-1 transition cursor-pointer ml-2 border border-rose-600 hover:border-rose-550"
                  title="Delete all rejected requests"
                >
                  <Trash2 size={13} /> Delete All Rejected
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-75">
        {(patientLoading || requestLoading) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          {activeTab === "patients" ? (
            // PATIENTS TABLE
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Diagnosis</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
                {currentItems.length > 0 ? (
                  currentItems.map((patient) => (
                    <tr 
                      key={patient._id} 
                      onClick={() => openViewModal(patient)}
                      className="hover:bg-slate-50/80 active:bg-slate-100/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-600 group"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-400">#{patient._id?.substring(patient._id.length - 4).toUpperCase()}</td>
                      <td className="px-6 py-4 font-semibold text-slate-805 group-hover:text-blue-600 transition-colors">{patient.name}</td>
                      <td className="px-6 py-4 font-medium">{patient.age} Yrs / {patient.gender}</td>
                      <td className="px-6 py-4 text-slate-500  text-xs">{patient.phone}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-850">
                          {patient.doctor?.name ? `Dr. ${patient.doctor.name}` : "Unassigned"}
                        </div>
                        <div className="text-slate-500 font-medium">
                          {patient.department?.name || "No Dept"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {patient.history && patient.history.length > 0
                          ? patient.history[patient.history.length - 1].diagnosis || "Consultation"
                          : "Consultation"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${patient.source === 'Online' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          {patient.source || "Organic"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(patient); }} className="p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md" title="Edit patient">
                            <Edit size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openHistoryModal(patient); }} className="p-2 hover:bg-green-50 text-green-600 hover:text-green-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-green-100 shadow-sm hover:shadow-md" title="View history">
                            <AlertTriangle size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openDeleteModal(patient); }} className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md" title="Delete patient">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">No patients found.</td></tr>
                )}
              </tbody>
            </table>
          ) : activeTab === "appointments" ? (
            // TODAY'S APPOINTMENTS TABLE
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Scheduled Slot</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Diagnosis</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
                {currentItems.length > 0 ? (
                  currentItems.map((patient) => (
                    <tr 
                      key={patient._id} 
                      onClick={() => openViewModal(patient)}
                      className="hover:bg-slate-50/80 active:bg-slate-100/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-600 group"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-805 group-hover:text-blue-600 transition-colors">
                        <div>{patient.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{patient.age} Yrs / {patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500  text-xs">{patient.phone}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-blue-500" />
                          {patient.appointmentTime || "Not Specified"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-850">
                          {patient.doctor?.name ? `Dr. ${patient.doctor.name}` : "Unassigned"}
                        </div>
                        <div className="text-slate-500 font-medium">
                          {patient.department?.name || "No Dept"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {patient.disease || "Consultation"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleCheckInPatient(patient); }} 
                            className="px-2.5 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                            title="Mark Attended & Check-in"
                          >
                            <Check size={13} /> Check-in
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleQuickRescheduleTomorrow(patient); }} 
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                            title="Reschedule to Tomorrow"
                          >
                            Tomorrow
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openRescheduleModal(patient); }} 
                            className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-755 rounded-xl transition-all cursor-pointer border border-slate-200"
                            title="Custom Reschedule Date/Time"
                          >
                            <CalendarCheck size={14} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openDeleteModal(patient); }} 
                            className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md"
                            title="Delete Patient Records"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">No appointments scheduled for today.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            // APPOINTMENT REQUESTS TABLE
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Pref. Dept / Time</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
                {currentItems.length > 0 ? (
                  currentItems.map((req) => (
                    <tr 
                      key={req._id} 
                      onClick={() => openRequestViewModal(req)}
                      className="hover:bg-slate-50/80 active:bg-slate-100/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-600 group"
                    >
                      <td className="px-6 py-4 text-slate-500  text-xs">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{req.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{req.age} Yrs / {req.gender}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800  text-xs">{req.phone}</div>
                        {req.email && <div className="text-xs text-slate-500">{req.email}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700 text-xs">{req.department || "Any Department"}</div>
                        <div className="text-xs text-slate-550 flex items-center gap-1 mt-0.5 font-medium">
                          <Clock size={12} className="text-slate-400" />
                          {req.preferredDate ? new Date(req.preferredDate).toLocaleDateString() : ""} {req.preferredTimeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs max-w-50 truncate text-slate-600" title={req.message}>{req.message || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {req.status === "Pending" ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); handleAcceptRequest(req); }} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition">
                                <Check size={14} /> Accept
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); openRejectModal(req); }} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition">
                                <X size={14} /> Reject
                              </button>
                            </>
                          ) : req.status === "Rejected" ? (
                            <button onClick={(e) => { e.stopPropagation(); openDeleteRequestModal(req); }} className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md" title="Delete rejected request">
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-full">Accepted</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">No appointment requests found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Showing {totalEntries > 0 ? indexOfFirstItem + 1 : 0} to {indexOfLastItem} of {totalEntries} entries
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
                    currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
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

      {/* Add / Edit Modals */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setIsAddModalOpen(false); setIsEditModalOpen(false);}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{isEditModalOpen ? "Manage Patient" : "Add New Patient"}</h3>
                  <p className="text-xs text-slate-450">{selectedRequest ? "Confirming appointment request" : (isEditModalOpen ? "Update records or add follow-up" : "Fill in patient details.")}</p>
                </div>
                <button onClick={() => {setIsAddModalOpen(false); setIsEditModalOpen(false);}} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"><X size={18} className="text-slate-400" /></button>
              </div>

              {isEditModalOpen && (
                <div className="flex border-b border-slate-200 mb-6 px-4">
                  <button type="button" onClick={() => setEditTab("update")} className={`pb-3 mr-6 text-sm font-semibold transition-colors relative ${editTab === "update" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
                    Update Details
                    {editTab === "update" && <motion.div layoutId="editTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                  </button>
                  <button type="button" onClick={() => setEditTab("followup")} className={`pb-3 text-sm font-semibold transition-colors relative ${editTab === "followup" ? "text-emerald-600" : "text-slate-500 hover:text-slate-700"}`}>
                    Add Follow-Up
                    {editTab === "followup" && <motion.div layoutId="editTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full" />}
                  </button>
                </div>
              )}

              {!isEditModalOpen && (
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-50" : "bg-emerald-500 text-white"}`}>{currentStep > 1 ? "✓" : "1"}</span>
                    <span className={`text-xs font-bold transition-all ${currentStep === 1 ? "text-blue-600" : "text-emerald-500"}`}>Personal Info</span>
                  </div>
                  <div className="flex-1 h-0.5 mx-4 bg-slate-100 relative">
                    <div className={`absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-emerald-500 transition-all ${currentStep === 2 ? "w-full" : "w-0"}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 2 ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-50" : "bg-slate-100 text-slate-450"}`}>2</span>
                    <span className={`text-xs font-bold transition-all ${currentStep === 2 ? "text-blue-600" : "text-slate-450"}`}>Assignment</span>
                  </div>
                </div>
              )}

              <form onSubmit={!isEditModalOpen && currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : (isEditModalOpen && editTab === "followup" ? handleFollowUpSubmit : (isEditModalOpen ? handleEditSubmit : handleAddSubmit))} className="space-y-4">
                {((isEditModalOpen && editTab === "update") || (!isEditModalOpen && currentStep === 1)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Age *</label>
                      <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Gender</label>
                      <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Blood Group</label>
                      <select value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Unknown"].map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone *</label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Source</label>
                      <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        <option value="Organic">Organic</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                  </div>
                )}

                {((isEditModalOpen && editTab === "update") || (!isEditModalOpen && currentStep === 2)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assigned Department *</label>
                      <select required value={formData.department} onChange={handleDepartmentChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        <option value="">Select Department</option>
                        {departments.map((dept) => (<option key={dept._id} value={dept._id}>{dept.name}</option>))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assigned Doctor *</label>
                      <select required value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} disabled={!formData.department} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition disabled:opacity-50">
                        <option value="">{!formData.department ? "Select a department first" : "Select Doctor"}</option>
                        {departmentDoctors.map((doc) => (<option key={doc._id} value={doc._id}>Dr. {doc.name}</option>))}
                      </select>
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Diagnosis / Symptoms *</label>
                      <input type="text" required value={formData.disease} onChange={(e) => setFormData({ ...formData, disease: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                        <option value="Outpatient">Outpatient</option><option value="Admitted">Admitted</option><option value="Emergency">Emergency</option>
                        <option value="In Treatment">In Treatment</option><option value="Recovery">Recovery</option><option value="Discharged">Discharged</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Appointment Date</label>
                      <input type="date" value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Appointment Time / Slot</label>
                      <input type="text" placeholder="e.g. 10:30 AM, Evening" value={formData.appointmentTime} onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                    </div>
                  </div>
                )}

                {isEditModalOpen && editTab === "followup" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assigned Department *</label>
                        <select required value={formData.department} onChange={handleDepartmentChange} className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition">
                          <option value="">Select Department</option>
                          {departments.map((dept) => (<option key={dept._id} value={dept._id}>{dept.name}</option>))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assigned Doctor *</label>
                        <select required value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} disabled={!formData.department} className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition disabled:opacity-50">
                          <option value="">{!formData.department ? "Select a department first" : "Select Doctor"}</option>
                          {departmentDoctors.map((doc) => (<option key={doc._id} value={doc._id}>Dr. {doc.name}</option>))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Diagnosis / Symptoms *</label>
                      <input type="text" required value={formData.disease} onChange={(e) => setFormData({ ...formData, disease: e.target.value })} className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Treatment</label>
                      <input type="text" value={formData.treatment} onChange={(e) => setFormData({ ...formData, treatment: e.target.value })} className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Notes</label>
                      <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition resize-none" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                  {!isEditModalOpen && currentStep === 1 ? (
                    <>
                      <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                      <button type="submit" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer">Next Step</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => !isEditModalOpen ? setCurrentStep(1) : setIsEditModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                        {!isEditModalOpen ? "Back" : "Cancel"}
                      </button>
                      <button type="submit" disabled={patientLoading} className={`px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer disabled:opacity-70 ${isEditModalOpen && editTab === "followup" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-blue-600 hover:bg-blue-500"}`}>
                        {patientLoading ? "Saving..." : (isEditModalOpen ? (editTab === "followup" ? "Add Follow-Up" : "Save Changes") : "Confirm Patient")}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* REJECT REQUEST MODAL */}
        {isRejectModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRejectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl p-6 z-10">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Reject Appointment Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Reason for Rejection (Optional)</label>
                  <textarea rows="3" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Doctor unavailable on requested date..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-xl text-sm outline-none transition resize-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" disabled={requestLoading} onClick={handleRejectConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md disabled:opacity-70 cursor-pointer">
                  {requestLoading ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {isDeleteModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl p-6 z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0"><AlertTriangle size={24} /></div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500">Are you sure you want to delete patient <span className="font-semibold text-slate-700">{selectedPatient.name}</span>'s records? This action is permanent.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" disabled={patientLoading} onClick={handleDeleteConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md disabled:opacity-70 cursor-pointer">
                  {patientLoading ? "Deleting..." : "Delete Records"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* HISTORY MODAL */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHistoryModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 bg-white shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Patient History</h3>
                  <p className="text-xs text-slate-450">Review past visits, diagnoses, and treatments.</p>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"><X size={18} className="text-slate-400" /></button>
              </div>

              <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                {historyData && historyData.length > 0 ? (
                  <div className="space-y-6">
                    {historyData.map((visit, idx) => (
                      <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative">
                        {idx !== historyData.length - 1 && (
                          <div className="absolute left-6 -bottom-6 w-0.5 h-6 bg-slate-200"></div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg"><CalendarCheck size={16} /></span>
                            <span className="font-semibold text-slate-800 text-sm">{new Date(visit.visitDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Filter size={12} /> {visit.department?.name || "No Dept"}</span>
                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Dr. {visit.doctor?.name || "Unknown"}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</span>
                            <p className="font-medium text-slate-700">{visit.diagnosis || "—"}</p>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Treatment</span>
                            <p className="font-medium text-slate-700">{visit.treatment || "—"}</p>
                          </div>
                          {visit.notes && (
                            <div className="col-span-1 md:col-span-2">
                              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</span>
                              <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{visit.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3"><AlertTriangle size={24} /></div>
                    <h4 className="text-sm font-bold text-slate-700">No History Found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">This patient has no recorded visits or treatments yet.</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex justify-end">
              </div>
            </motion.div>
          </div>
        )}

        {/* PATIENT VIEW DETAILS MODAL */}
        {isViewModalOpen && viewingPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              
              {/* Header section with avatar */}
              <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/55 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/10 uppercase">
                    {viewingPatient.name?.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{viewingPatient.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs  text-slate-450 bg-slate-105 border border-slate-200/50 px-2 py-0.5 rounded font-semibold">ID: #{viewingPatient._id?.substring(viewingPatient._id.length - 4).toUpperCase()}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(viewingPatient.status)}`}>
                        {viewingPatient.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"><X size={18} className="text-slate-400" /></button>
              </div>

              {/* Scrollable details */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age & Gender</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingPatient.age} Years / {viewingPatient.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingPatient.bloodGroup || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <p className="text-sm font-semibold text-slate-750 ">{viewingPatient.phone}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <p className="text-sm font-semibold text-slate-700 break-all">{viewingPatient.email || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Source</span>
                    <p className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded inline-block uppercase tracking-wide">
                      {viewingPatient.source || "Organic"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Doctor</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingPatient.doctor?.name ? `Dr. ${viewingPatient.doctor.name}` : "Unassigned"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingPatient.department?.name || "No Department"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                    <p className="text-sm font-semibold text-slate-700">{viewingPatient.disease || "Consultation"}</p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Visit History Section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Treatment History & Follow-ups</h4>
                  {loadingHistory ? (
                    <div className="py-8 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : viewingPatientHistory && viewingPatientHistory.length > 0 ? (
                    <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-6">
                      {viewingPatientHistory.map((visit, index) => (
                        <div key={index} className="relative">
                          <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center text-blue-600">
                            <Clock size={10} />
                          </span>
                          <div className="space-y-1.5 animate-fadeIn">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{new Date(visit.visitDate).toLocaleDateString()}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-semibold border border-slate-200/50">{visit.department?.name}</span>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-100/50">Dr. {visit.doctor?.name}</span>
                            </div>
                            <div className="text-xs text-slate-650 bg-slate-50/50 p-3 rounded-xl border border-slate-150 space-y-1">
                              <div><span className="font-bold text-slate-400 uppercase text-[9px] block mb-0.5">Diagnosis</span> {visit.diagnosis || "—"}</div>
                              {visit.treatment && <div className="mt-2"><span className="font-bold text-slate-400 uppercase text-[9px] block mb-0.5">Treatment</span> {visit.treatment}</div>}
                              {visit.notes && <div className="mt-2"><span className="font-bold text-slate-400 uppercase text-[9px] block mb-0.5">Notes</span> {visit.notes}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-450 italic">No previous visit history recorded.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-3">
                <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-55 text-slate-600 transition cursor-pointer">Close</button>
                <button onClick={() => { setIsViewModalOpen(false); openEditModal(viewingPatient); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer">Edit Records</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* APPOINTMENT REQUEST VIEW DETAILS MODAL */}
        {isRequestViewModalOpen && viewingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRequestViewModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              
              <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/55 shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Appointment Request</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Submitted on {new Date(viewingRequest.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setIsRequestViewModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"><X size={18} className="text-slate-400" /></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Name</span>
                    <p className="font-semibold text-slate-850">{viewingRequest.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age & Gender</span>
                    <p className="font-semibold text-slate-800">{viewingRequest.age} Years / {viewingRequest.gender}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <p className="font-semibold text-slate-805 ">{viewingRequest.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <p className="font-semibold text-slate-800 break-all">{viewingRequest.email || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Department</span>
                    <p className="font-semibold text-slate-800">{viewingRequest.department || "Any Department"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Slot</span>
                    <p className="font-semibold text-slate-800">
                      {viewingRequest.preferredDate ? new Date(viewingRequest.preferredDate).toLocaleDateString() : ""} {viewingRequest.preferredTimeSlot || "Any time"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Message from Patient</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-150 mt-1 whitespace-pre-wrap leading-relaxed">
                      {viewingRequest.message || "No custom message provided."}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border mt-1 inline-block ${getStatusBadge(viewingRequest.status)}`}>
                      {viewingRequest.status}
                    </span>
                  </div>
                  {viewingRequest.adminNotes && (
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admin Notes</span>
                      <p className="text-xs text-slate-650 bg-amber-50/50 border border-amber-100 p-3 rounded-lg mt-1 italic">
                        {viewingRequest.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-3">
                <button onClick={() => setIsRequestViewModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-55 transition cursor-pointer text-slate-600">Close</button>
                {viewingRequest.status === "Pending" && (
                  <>
                    <button onClick={() => { setIsRequestViewModalOpen(false); openRejectModal(viewingRequest); }} className="px-4 py-2.5 bg-rose-55 text-rose-600 hover:bg-rose-100 rounded-xl text-sm font-semibold cursor-pointer transition border border-rose-200/50">Reject</button>
                    <button onClick={() => { setIsRequestViewModalOpen(false); handleAcceptRequest(viewingRequest); }} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/10 cursor-pointer transition">Accept & Add Patient</button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE REQUEST CONFIRMATION MODAL */}
        {isDeleteRequestModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteRequestModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl p-6 z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0"><AlertTriangle size={24} /></div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-500">Are you sure you want to delete the appointment request from <span className="font-semibold text-slate-700">{selectedRequest.name}</span>? This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsDeleteRequestModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" disabled={requestLoading} onClick={handleDeleteRequestConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md disabled:opacity-70 cursor-pointer">
                  {requestLoading ? "Deleting..." : "Delete Request"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* CUSTOM RESCHEDULE MODAL */}
        {isRescheduleModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRescheduleModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl p-6 z-10">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Reschedule Appointment</h3>
              <p className="text-xs text-slate-500 mb-4">Select new appointment details for <span className="font-semibold text-slate-700">{selectedPatient.name}</span>.</p>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">New Appointment Date *</label>
                  <input type="date" required value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Appointment Time / Slot</label>
                  <input type="text" placeholder="e.g. 10:30 AM, Evening" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-55 transition cursor-pointer text-slate-600">Cancel</button>
                  <button type="submit" disabled={patientLoading} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md disabled:opacity-70 cursor-pointer">
                    {patientLoading ? "Rescheduling..." : "Confirm Reschedule"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Patients;
