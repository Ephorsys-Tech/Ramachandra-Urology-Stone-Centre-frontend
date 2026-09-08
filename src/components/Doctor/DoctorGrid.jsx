import { motion } from "framer-motion";
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
  Filter
} from "lucide-react";
import { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAllDoctorsPublic } from "../../redux/features/doctor/doctorThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { getDoctorSlug } from "../../Helper/slugify";
import { DoctorCardSkeleton } from "../common/Skeletons";

const DoctorGrid = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryDept = searchParams.get("specialty") || "All";
  const queryDoc = searchParams.get("doctor") || "All";

  // Redux store data
  const { doctors, loading } = useSelector((state) => state.doctor);
  const { departments } = useSelector((state) => state.department);
  const { settings } = useSelector((state) => state.setting || { settings: null });

  // Form States
  const [formCity, setFormCity] = useState("Bhubaneswar");
  const [formHospital, setFormHospital] = useState("Usthi Hospital, Bhubaneswar");
  const [formDept, setFormDept] = useState(queryDept);
  const [formDocName, setFormDocName] = useState(queryDoc);
  const [formConsult, setFormConsult] = useState("All");

  // Active Filter state
  const [activeFilters, setActiveFilters] = useState({
    city: "Bhubaneswar",
    hospital: "Usthi Hospital, Bhubaneswar",
    department: queryDept,
    doctorName: queryDoc,
    consultation: "All",
  });

  useEffect(() => {
    setFormDept(queryDept);
    setFormDocName(queryDoc);
    setActiveFilters((prev) => ({
      ...prev,
      department: queryDept,
      doctorName: queryDoc,
    }));
  }, [queryDept, queryDoc]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  useEffect(() => {
    dispatch(fetchAllDoctorsPublic());
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (formDept !== "All") params.specialty = formDept;
    if (formDocName !== "All") params.doctor = formDocName;
    setSearchParams(params);

    setActiveFilters({
      city: formCity,
      hospital: formHospital,
      department: formDept,
      doctorName: formDocName,
      consultation: formConsult,
    });
    setCurrentPage(1);
  };

  // Handle filter reset
  const handleReset = () => {
    setSearchParams({});
    setFormCity("Bhubaneswar");
    setFormHospital("Usthi Hospital, Bhubaneswar");
    setFormDept("All");
    setFormDocName("All");
    setFormConsult("All");
    setActiveFilters({
      city: "Bhubaneswar",
      hospital: "Usthi Hospital, Bhubaneswar",
      department: "All",
      doctorName: "All",
      consultation: "All",
    });
    setCurrentPage(1);
  };

  // Doctor filtering logic
  const filteredDoctors = (doctors || []).filter((doc) => {
    const deptName = (doc.department?.name || doc.department || "").toLowerCase().trim();
    const filterDept = (activeFilters.department || "All").toLowerCase().trim();
    const matchesDept =
      filterDept === "all" ||
      deptName === filterDept ||
      deptName.includes(filterDept) ||
      filterDept.includes(deptName);

    const docName = (doc.name || "").toLowerCase().trim();
    const filterDoc = (activeFilters.doctorName || "All").toLowerCase().trim();
    const matchesDocName =
      filterDoc === "all" ||
      docName === filterDoc ||
      docName.includes(filterDoc) ||
      filterDoc.includes(docName);

    return matchesDept && matchesDocName;
  });

  // Pagination math
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 340, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#f4f7fb] py-10 px-4 sm:px-6 font-sans select-none min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: FILTER SIDEBAR + NEED HELP CARD
          ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* ── CARD 1: FILTER DOCTORS ── */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2 text-[#0d2e5c] font-black text-lg">
                  <SlidersHorizontal size={18} className="text-[#0052cc]" />
                  <span>Filter Doctors</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-[#0052cc] hover:text-[#008ba3] transition-colors cursor-pointer border-none bg-transparent hover:underline"
                >
                  Reset
                </button>
              </div>

              <form onSubmit={handleFilterSubmit} className="space-y-4 text-left">
                {/* City Field */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MapPin size={14} className="text-[#0052cc]" />
                    <span>City</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs font-bold outline-none text-slate-700 cursor-pointer focus:border-[#0052cc] focus:bg-white transition-all appearance-none pr-9"
                    >
                      <option value="Bhubaneswar">Bhubaneswar</option>
                      <option value="Cuttack">Cuttack (Coming Soon)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Hospital Field */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Building2 size={14} className="text-[#0052cc]" />
                    <span>Hospital</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formHospital}
                      onChange={(e) => setFormHospital(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs font-bold outline-none text-slate-700 cursor-pointer focus:border-[#0052cc] focus:bg-white transition-all appearance-none pr-9"
                    >
                      <option value="Usthi Hospital, Bhubaneswar">
                        Usthi Hospital, Bhubaneswar
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Department Field */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Stethoscope size={14} className="text-[#0052cc]" />
                    <span>Department</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formDept}
                      onChange={(e) => {
                        setFormDept(e.target.value);
                        setFormDocName("All");
                      }}
                      className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs font-bold outline-none text-slate-700 cursor-pointer focus:border-[#0052cc] focus:bg-white transition-all appearance-none pr-9"
                    >
                      <option value="All">Search Department (All)</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Consultation Type Field */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <User size={14} className="text-[#0052cc]" />
                    <span>Type of Consultation</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formConsult}
                      onChange={(e) => setFormConsult(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs font-bold outline-none text-slate-700 cursor-pointer focus:border-[#0052cc] focus:bg-white transition-all appearance-none pr-9"
                    >
                      <option value="All">Type Of Consultation</option>
                      <option value="in-person">In-Person Consultation</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Apply Filter Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#008ba3] to-[#004b99] hover:opacity-95 active:scale-98 text-white font-black rounded-2xl transition-all shadow-md shadow-blue-600/15 cursor-pointer text-xs border-none mt-4 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Filter size={14} />
                  <span>APPLY FILTER</span>
                </button>
              </form>
            </div>

            {/* ── CARD 2: NEED HELP? ── */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Headphones size={22} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[#0d2e5c]">Need Help?</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Our care team is here to assist you in finding the right doctor.
                </p>
                <a
                  href={`tel:${settings?.emergencyPhone || "067468106585"}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#004b99] hover:text-[#008ba3] pt-1 no-underline transition-colors"
                >
                  <Phone size={13} className="fill-[#004b99]" />
                  <span>{settings?.emergencyPhone || "0674-68106585"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: DOCTOR LIST HEADER & DOCTOR CARDS
          ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-6 text-left">
            {/* Header: All Doctors + Count */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#0d2e5c] tracking-tight">
                All Doctors
              </h2>
              <div className="text-xs font-bold text-slate-500">
                Showing {currentDoctors.length} of {filteredDoctors.length} Doctors
              </div>
            </div>

            {loading && doctors.length === 0 ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <DoctorCardSkeleton key={idx} />
                ))}
              </div>
            ) : currentDoctors.length > 0 ? (
              <div className="space-y-6">
                {currentDoctors.map((doc, i) => {
                  const docImage = doc.photo || doc.image;
                  const docSpecialization =
                    doc.specialization || doc.specialty || doc.department?.name || "Specialist";
                  const hasValidImage =
                    docImage && !docImage.includes("👨‍⚕️") && !docImage.includes("👩‍⚕️");

                  return (
                    <motion.div
                      key={doc._id || i}
                      className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row group transition-all duration-300 hover:border-slate-300 hover:shadow-lg relative"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      {/* Left Frame (Doctor Photo Block) */}
                      <div className="w-full md:w-[35%] lg:w-[32%] bg-[#004b99] relative flex flex-col justify-between overflow-hidden shrink-0">
                        {/* Top Header Strip */}
                        <div className="bg-[#004b99] text-white text-[10px] uppercase font-bold tracking-widest py-2 text-center w-full z-10 shrink-0 select-none">
                          BHUBANESWAR • ODISHA
                        </div>

                        {/* Middle Photo Canvas */}
                        <div className="flex-grow overflow-hidden relative flex items-center justify-center bg-slate-100 p-2 min-h-[220px]">
                          {hasValidImage ? (
                            <img
                              src={docImage}
                              alt={doc.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full max-h-[220px] object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[180px] bg-slate-100 flex items-center justify-center rounded-xl">
                              <Stethoscope className="w-14 h-14 text-slate-400" />
                            </div>
                          )}

                          {/* Available Badge */}
                          <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md shadow-xs border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                            <span className="text-emerald-700 text-[9px] font-extrabold tracking-wider uppercase">
                              Available
                            </span>
                          </div>
                        </div>

                        {/* Bottom Blue Trim */}
                        <div className="h-2 bg-[#004b99] w-full shrink-0" />
                      </div>

                      {/* Right Frame (Doctor Details Block) */}
                      <div className="w-full md:w-[65%] lg:w-[68%] p-6 sm:p-7 flex flex-col justify-between bg-white">
                        <div className="space-y-2">
                          {/* Doctor Name */}
                          <h3 className="text-xl sm:text-2xl font-black text-[#004b99] font-sans tracking-tight uppercase leading-tight">
                            {doc.name.startsWith("Dr") ? doc.name : `Dr. ${doc.name}`}
                          </h3>

                          {/* Designation Subtitle */}
                          <p className="text-xs sm:text-sm font-black text-[#008ba3] uppercase tracking-wide">
                            SENIOR CONSULTANT & HOD — {docSpecialization}
                          </p>

                          {/* Details Row: Qualification & Timings */}
                          <div className="pt-2.5 space-y-2 text-xs">
                            <div className="flex items-start gap-2 text-slate-600">
                              <GraduationCap size={15} className="text-slate-800 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-900 uppercase">
                                  QUALIFICATION :{" "}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {doc.qualifications || "MBBS, MS (Obstetrics & Gynaecology)"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 text-slate-600">
                              <Clock size={14} className="text-slate-800 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-900 uppercase">
                                  TIMINGS :{" "}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {doc.timing || "MONDAY TO SATURDAY, 4 PM TO 6 PM"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Row */}
                        <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-4 border-t border-slate-100">
                          {/* Speciality Dropdown Pill */}
                          <div className="relative">
                            <select
                              value={docSpecialization}
                              disabled
                              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none select-none appearance-none pr-8 cursor-default"
                            >
                              <option>{docSpecialization}</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          {/* Book Appointment Button */}
                          <button
                            onClick={() =>
                              dispatch(openAppointmentModal(doc.department?.name || ""))
                            }
                            className="px-5 py-2.5 bg-[#006e78] hover:bg-[#005a63] active:scale-95 text-white font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-sm cursor-pointer border-none uppercase flex items-center gap-2"
                          >
                            <Calendar size={14} />
                            <span>BOOK APPOINTMENT</span>
                          </button>

                          {/* View Profile Button */}
                          <button
                            onClick={() => navigate(`/doctors/${getDoctorSlug(doc.name)}`)}
                            className="px-5 py-2.5 bg-white hover:bg-slate-50 active:scale-95 text-[#004b99] border border-[#004b99]/40 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-2xs cursor-pointer uppercase flex items-center gap-2"
                          >
                            <User size={14} />
                            <span>VIEW PROFILE</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* ── PAGINATION CONTROLS ── */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200/80 mt-8">
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
                        className={`w-9 h-9 font-bold text-xs rounded-xl transition-all cursor-pointer border ${
                          currentPage === idx + 1
                            ? "bg-[#004b99] text-white border-transparent shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
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
            ) : (
              <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl p-8">
                <Stethoscope className="w-14 h-14 text-slate-350 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No doctors found</h3>
                <p className="text-slate-500 text-xs">
                  Try selecting a different department or click Reset.
                </p>
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