import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Building2,
  User,
  GraduationCap,
  Clock,
  Calendar,
  Headphones,
  Phone,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  Sparkles,
  Award,
  HeartPulse
} from "lucide-react";
import { useState, useEffect, useMemo, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAllDoctorsPublic } from "../../redux/features/doctor/doctorThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { getDoctorSlug } from "../../Helper/slugify";
import { getDepartmentIcon } from "../../Helper/departmentIcon";
import { DoctorCardSkeleton } from "../common/Skeletons";

const DoctorGrid = memo(({ externalSearch = "", setExternalSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryDept = searchParams.get("specialty") || "All";
  const queryDoc = searchParams.get("doctor") || "All";

  // Redux store data
  const { doctors = [], loading = false } = useSelector((state) => state.doctor || {});
  const { departments = [] } = useSelector((state) => state.department || {});
  const { settings } = useSelector((state) => state.setting || { settings: null });

  // Filters and UI states
  const [selectedDept, setSelectedDept] = useState(queryDept);
  const [searchQuery, setSearchQuery] = useState(externalSearch || "");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = viewMode === "grid" ? 6 : 5;

  // Sync external search from Hero
  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (setExternalSearch) setExternalSearch(val);
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(fetchAllDoctorsPublic());
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  // Sync with URL params
  useEffect(() => {
    setSelectedDept(queryDept);
  }, [queryDept]);

  const handleSelectDepartment = (deptName) => {
    setSelectedDept(deptName);
    const params = {};
    if (deptName !== "All") params.specialty = deptName;
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedDept("All");
    setSearchQuery("");
    if (setExternalSearch) setExternalSearch("");
    setSearchParams({});
    setSortBy("default");
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredDoctors = useMemo(() => {
    return (doctors || [])
      .filter((doc) => {
        // Department filter
        const docDeptName = (doc.department?.name || doc.department || "").toLowerCase().trim();
        const filterDept = selectedDept.toLowerCase().trim();
        const matchesDept =
          filterDept === "all" ||
          docDeptName === filterDept ||
          docDeptName.includes(filterDept) ||
          filterDept.includes(docDeptName);

        // Search Query (Doctor Name, Qualification, Specialty, Bio)
        const q = searchQuery.toLowerCase().trim();
        const docName = (doc.name || "").toLowerCase();
        const docSpecialty = (doc.specialization || doc.specialty || doc.department?.name || "").toLowerCase();
        const docQual = (doc.qualifications || "").toLowerCase();

        const matchesQuery =
          !q ||
          docName.includes(q) ||
          docSpecialty.includes(q) ||
          docQual.includes(q);

        return matchesDept && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "name-desc") {
          return (b.name || "").localeCompare(a.name || "");
        }
        return 0;
      });
  }, [doctors, selectedDept, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage) || 1;
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById("doctors-directory-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const emergencyPhone = settings?.emergencyPhone || "+91 99375 66625";
  const mainPhone = settings?.phone || "+91 88950 62072";

  return (
    <div id="doctors-directory-section" className="w-full bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8  select-none min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* ── 1. QUICK DEPARTMENT FILTER PILL TABS ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#0FA8D6]" />
              <span>Filter by Clinical Specialty</span>
            </h3>
            {selectedDept !== "All" && (
              <button
                onClick={() => handleSelectDepartment("All")}
                className="text-xs font-bold text-[#024363] hover:text-[#0FA8D6] cursor-pointer bg-transparent border-none transition-colors"
              >
                Clear Specialty Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => handleSelectDepartment("All")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                selectedDept === "All"
                  ? "bg-[#024363] text-white border-[#024363] shadow-sm shadow-[#024363]/20"
                  : "bg-white text-slate-700 border-slate-200/90 hover:bg-[#0FA8D6]/5 hover:border-[#0FA8D6]/40 hover:text-[#024363]"
              }`}
            >
              All Specialists ({doctors.length})
            </button>

            {departments.map((dept) => {
              const deptDoctorCount = doctors.filter((d) => {
                const docDept = (d.department?.name || d.department || "").toLowerCase().trim();
                const currentDept = dept.name.toLowerCase().trim();
                return docDept === currentDept || docDept.includes(currentDept);
              }).length;

              const isSelected = selectedDept.toLowerCase() === dept.name.toLowerCase();

              return (
                <button
                  key={dept._id || dept.name}
                  onClick={() => handleSelectDepartment(dept.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#024363] text-white border-[#024363] shadow-sm shadow-[#024363]/20"
                      : "bg-white text-slate-700 border-slate-200/90 hover:bg-[#0FA8D6]/5 hover:border-[#0FA8D6]/40 hover:text-[#024363]"
                  }`}
                >
                  <span>{dept.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? "bg-[#012442] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {deptDoctorCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. MAIN LAYOUT: SIDEBAR + DOCTOR DIRECTORY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: SEARCH, FILTERS & EMERGENCY CARD
          ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Filter Control Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2 text-[#012442] font-extrabold text-base">
                  <SlidersHorizontal size={18} className="text-[#0FA8D6]" />
                  <span>Refine Search</span>
                </div>
                {(selectedDept !== "All" || searchQuery) && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-[#024363] hover:text-[#0FA8D6] transition-colors cursor-pointer border-none bg-transparent hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Search by Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Search size={14} className="text-[#0FA8D6]" />
                    <span>Search Doctor Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="e.g. Dr. Mishra, Urologist..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-[#012442] outline-none focus:border-[#0FA8D6] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Department Select */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Stethoscope size={14} className="text-[#0FA8D6]" />
                    <span>Department</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDept}
                      onChange={(e) => handleSelectDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-[#012442] outline-none focus:border-[#0FA8D6] focus:bg-white transition-all appearance-none cursor-pointer pr-9"
                    >
                      <option value="All">All Departments ({doctors.length})</option>
                      {departments.map((dept) => (
                        <option key={dept._id || dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Hospital Branch Location (Sambalpur) */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <MapPin size={14} className="text-[#0FA8D6]" />
                    <span>Hospital Campus</span>
                  </label>
                  <div className="p-3 bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 rounded-2xl flex items-center justify-between text-xs font-bold text-[#012442]">
                    <div className="flex items-center gap-2">
                      <Building2 size={15} className="text-[#0FA8D6]" />
                      <span>Sambalpur Centre (Odisha)</span>
                    </div>
                    <span className="text-[10px] text-white bg-[#024363] px-2 py-0.5 rounded-full font-extrabold">
                      Main Hub
                    </span>
                  </div>
                </div>

                {/* Quick Results Counter */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Matching Specialists:</span>
                  <span className="font-extrabold text-[#012442] bg-[#0FA8D6]/15 px-2.5 py-0.5 rounded-full border border-[#0FA8D6]/30">
                    {filteredDoctors.length} Doctors
                  </span>
                </div>
              </div>
            </div>

            {/* ── CARD 2: NEED ASSISTANCE / APPOINTMENT HELPLINE ── */}
            <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white border border-[#0FA8D6]/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0FA8D6]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 flex items-center justify-center text-[#0FA8D6] shadow-inner">
                  <Headphones size={22} className="stroke-[2.2]" />
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white">
                    Need Help Choosing a Doctor?
                  </h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                    Speak directly with our clinical coordinators for doctor availability and OPD booking.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={`tel:${emergencyPhone}`}
                    className="flex items-center justify-between bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white px-4 py-3 rounded-2xl font-medium text-xs no-underline transition-all shadow-md group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="group-hover:rotate-12 transition-transform" />
                      <span>24x7 Helpline: {emergencyPhone}</span>
                    </div>
                    <ArrowRight size={13} />
                  </a>

                  <button
                    onClick={() => dispatch(openAppointmentModal())}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-colors border border-white/20 cursor-pointer"
                  >
                    <Calendar size={14} className="text-[#0FA8D6]" />
                    <span>Book General Appointment</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: TOOLBAR & DOCTOR CARDS (GRID/LIST)
          ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Controls Toolbar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <h2 className="text-xl sm:text-2xl font-medium text-[#012442] tracking-tight">
                  Medical Specialists & Surgeons
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Showing {currentDoctors.length} of {filteredDoctors.length} certified medical doctors
                </p>
              </div>

              {/* View Toggle & Sort Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#012442] outline-none focus:border-[#0FA8D6] transition-colors cursor-pointer"
                >
                  <option value="default">Sort: Default</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>

                {/* View Switcher Buttons */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer border-none ${
                      viewMode === "grid"
                        ? "bg-white text-[#024363] shadow-xs font-bold"
                        : "bg-transparent text-slate-500 hover:text-slate-900"
                    }`}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer border-none ${
                      viewMode === "list"
                        ? "bg-white text-[#024363] shadow-xs font-bold"
                        : "bg-transparent text-slate-500 hover:text-slate-900"
                    }`}
                    title="List View"
                    aria-label="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── DOCTOR CARDS RENDERING ── */}
            {loading && doctors.length === 0 ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <DoctorCardSkeleton key={idx} />
                ))}
              </div>
            ) : currentDoctors.length > 0 ? (
              viewMode === "grid" ? (
                /* ── GRID VIEW (2 COLUMNS) ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {currentDoctors.map((doc, idx) => {
                    const docImage = doc.photo || doc.image;
                    const docSpecialization =
                      doc.specialization || doc.specialty || doc.department?.name || "Super Specialist";
                    const hasValidImage =
                      docImage && !docImage.includes("👨‍⚕️") && !docImage.includes("👩‍⚕️");
                    const doctorSlug = getDoctorSlug(doc.name);

                    return (
                      <motion.div
                        key={doc._id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="bg-white border border-slate-200/90 hover:border-[#0FA8D6]/80 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(15,168,214,0.14)] transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image & Badges Banner */}
                          <div className="relative aspect-[16/11] bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
                            {hasValidImage ? (
                              <img
                                src={docImage}
                                alt={doc.name}
                                loading="lazy"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                <Stethoscope size={48} className="text-[#024363]/40 mb-1" />
                                <span className="text-[11px] font-bold text-slate-400">Certified Specialist</span>
                              </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/70 via-transparent to-transparent opacity-80" />

                            {/* Top Left: Verified Badge */}
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#0FA8D6]/30">
                              <ShieldCheck size={13} className="text-[#0FA8D6]" />
                              <span className="text-[10px] font-extrabold text-[#012442] tracking-wider uppercase">
                                Verified
                              </span>
                            </div>

                            {/* Top Right: OPD Status */}
                            <div className="absolute top-3 right-3 bg-[#012442]/90 backdrop-blur-md text-[#0FA8D6] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#0FA8D6]/40">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FA8D6] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FA8D6]"></span>
                              </span>
                              <span className="text-[10px] font-extrabold tracking-wide uppercase text-white">
                                Available OPD
                              </span>
                            </div>

                            {/* Bottom Overlaid Speciality Tag */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                              <span className="bg-[#024363]/90 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-xl shadow-xs truncate max-w-[80%] text-white border border-[#0FA8D6]/30">
                                {docSpecialization}
                              </span>
                            </div>
                          </div>

                          {/* Details Content */}
                          <div className="p-5 space-y-3">
                            <div>
                              <h3 className="text-lg font-medium text-[#012442] group-hover:text-[#024363] transition-colors tracking-tight line-clamp-1">
                                {doc.name.startsWith("Dr") ? doc.name : `Dr. ${doc.name}`}
                              </h3>
                              <p className="text-xs font-bold text-[#024363] mt-0.5 line-clamp-1">
                                Senior Consultant & Surgeon
                              </p>
                            </div>

                            {/* Qualifications & Experience */}
                            <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                              <div className="flex items-start gap-2">
                                <GraduationCap size={15} className="text-[#0FA8D6] shrink-0 mt-0.5" />
                                <span className="text-slate-700 font-medium line-clamp-1">
                                  {doc.qualifications || "MBBS, MS, MCh (Urology)"}
                                </span>
                              </div>

                              <div className="flex items-start gap-2">
                                <Clock size={14} className="text-[#0FA8D6] shrink-0 mt-0.5" />
                                <span className="text-slate-700 font-medium line-clamp-1">
                                  {doc.timing || "Monday – Saturday: 10 AM – 6 PM"}
                                </span>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-[#0FA8D6] shrink-0 mt-0.5" />
                                <span className="text-slate-700 font-medium">
                                  Ramachandra Centre, Sambalpur
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="p-5 pt-0 mt-2 flex items-center gap-2 border-t border-slate-100 pt-4">
                          <button
                            onClick={() => dispatch(openAppointmentModal(doc.department?.name || "", doc.name))}
                            className="flex-1 py-2.5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 uppercase tracking-wider"
                          >
                            <Calendar size={13} />
                            <span>Book Visit</span>
                          </button>

                          <button
                            onClick={() => navigate(`/doctors/${doctorSlug}`)}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-[#0FA8D6]/10 text-slate-800 hover:text-[#024363] border border-slate-200 hover:border-[#0FA8D6]/40 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            title="View Doctor Profile"
                          >
                            <span>Profile</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* ── LIST VIEW (HORIZONTAL CARDS) ── */
                <div className="space-y-4">
                  {currentDoctors.map((doc, idx) => {
                    const docImage = doc.photo || doc.image;
                    const docSpecialization =
                      doc.specialization || doc.specialty || doc.department?.name || "Specialist";
                    const hasValidImage =
                      docImage && !docImage.includes("👨‍⚕️") && !docImage.includes("👩‍⚕️");
                    const doctorSlug = getDoctorSlug(doc.name);

                    return (
                      <motion.div
                        key={doc._id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        className="bg-white border border-slate-200/90 hover:border-[#0FA8D6]/70 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col md:flex-row group"
                      >
                        {/* Left Portrait */}
                        <div className="w-full md:w-56 bg-slate-100 relative shrink-0 aspect-[4/3] md:aspect-auto">
                          {hasValidImage ? (
                            <img
                              src={docImage}
                              alt={doc.name}
                              loading="lazy"
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[160px] flex items-center justify-center text-slate-400">
                              <Stethoscope size={42} className="text-[#024363]/40" />
                            </div>
                          )}

                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] font-extrabold text-[#024363] border border-[#0FA8D6]/40">
                            <ShieldCheck size={11} className="text-[#0FA8D6]" />
                            <span>VERIFIED</span>
                          </div>
                        </div>

                        {/* Right Details */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="text-xl font-medium text-[#012442] group-hover:text-[#024363] transition-colors">
                                  {doc.name.startsWith("Dr") ? doc.name : `Dr. ${doc.name}`}
                                </h3>
                                <p className="text-xs font-bold text-[#024363] mt-0.5">
                                  Senior Consultant — {docSpecialization}
                                </p>
                              </div>

                              <span className="bg-[#0FA8D6]/10 text-[#024363] border border-[#0FA8D6]/30 text-[11px] font-bold px-3 py-1 rounded-full">
                                OPD Available
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              <div className="flex items-center gap-2 text-slate-600">
                                <GraduationCap size={15} className="text-[#0FA8D6] shrink-0" />
                                <span className="font-semibold text-slate-800 truncate">
                                  {doc.qualifications || "MBBS, MS, MCh (Urology)"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-slate-600">
                                <Clock size={14} className="text-[#0FA8D6] shrink-0" />
                                <span className="font-semibold text-slate-800 truncate">
                                  {doc.timing || "Mon – Sat: 10 AM – 6 PM"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => dispatch(openAppointmentModal(doc.department?.name || "", doc.name))}
                              className="px-5 py-2.5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <Calendar size={14} />
                              <span>Book Appointment</span>
                            </button>

                            <button
                              onClick={() => navigate(`/doctors/${doctorSlug}`)}
                              className="px-5 py-2.5 bg-white hover:bg-[#0FA8D6]/10 text-slate-800 hover:text-[#024363] border border-slate-200 hover:border-[#0FA8D6]/40 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <User size={14} className="text-[#0FA8D6]" />
                              <span>View Profile</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            ) : (
              /* ── EMPTY SEARCH RESULT ── */
              <div className="text-center py-16 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#0FA8D6]/10 text-[#0FA8D6] flex items-center justify-center mx-auto mb-4 border border-[#0FA8D6]/20">
                  <Stethoscope size={30} />
                </div>
                <h3 className="text-lg font-medium text-[#012442] mb-1">
                  No Matching Doctors Found
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto mb-5 leading-relaxed">
                  We could not find any doctors matching &quot;{searchQuery || selectedDept}&quot;. Try selecting a different specialty or reset all filters.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border-none shadow-sm inline-flex items-center gap-2"
                >
                  <Filter size={13} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* ── PAGINATION CONTROLS ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 mt-8">
                <button
                  onClick={() => paginate(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => paginate(idx + 1)}
                    className={`w-9 h-9 font-extrabold text-xs rounded-xl transition-all cursor-pointer border ${
                      currentPage === idx + 1
                        ? "bg-[#024363] text-white border-transparent shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-[#0FA8D6]/10 hover:text-[#024363]"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
});

DoctorGrid.displayName = "DoctorGrid";
export default DoctorGrid;