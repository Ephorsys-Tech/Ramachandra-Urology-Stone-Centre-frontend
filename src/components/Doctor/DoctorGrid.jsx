import { motion } from "framer-motion";
import {
  Star,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Clock,
  Calendar,
  Phone,
  ShieldCheck,
  LayoutGrid,
  List,
  ArrowRight,
  User,
} from "lucide-react";
import { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllDoctorsPublic } from "../../redux/features/doctor/doctorThunk";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { getDoctorSlug } from "../../Helper/slugify";
import { DoctorCardSkeleton } from "../common/Skeletons";

const DoctorGrid = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors = [], loading = false } = useSelector((state) => state.doctor || {});
  const { settings } = useSelector((state) => state.setting || { settings: null });

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = viewMode === "grid" ? 6 : 5;

  useEffect(() => {
    dispatch(fetchAllDoctorsPublic());
  }, [dispatch]);

  const sortedDoctors = [...(doctors || [])].sort((a, b) => {
    if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
    if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
    return 0;
  });

  const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage) || 1;
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = sortedDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const el = document.getElementById("doctors-directory-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const emergencyPhone = settings?.emergencyPhone || "+91 99375 66625";

  return (
    <div id="doctors-directory-section" className="w-full bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 select-none min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-[#012442] tracking-tight">
              Medical Specialists &amp; Surgeons
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Showing {currentDoctors.length} of {sortedDoctors.length} certified medical doctors
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#012442] outline-none focus:border-[#0FA8D6] transition-colors cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>

            {/* View toggle */}
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

        {/* Doctor Cards */}
        {loading && doctors.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <DoctorCardSkeleton key={idx} />
            ))}
          </div>
        ) : currentDoctors.length > 0 ? (
          viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                      {/* Image Banner */}
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

                        <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/70 via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#0FA8D6]/30">
                          <ShieldCheck size={13} className="text-[#0FA8D6]" />
                          <span className="text-[10px] font-extrabold text-[#012442] tracking-wider uppercase">Verified</span>
                        </div>

                        <div className="absolute top-3 right-3 bg-[#012442]/90 backdrop-blur-md text-[#0FA8D6] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#0FA8D6]/40">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FA8D6] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FA8D6]"></span>
                          </span>
                          <span className="text-[10px] font-extrabold tracking-wide uppercase text-white">Available OPD</span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="bg-[#024363]/90 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-xl shadow-xs truncate max-w-[80%] text-white border border-[#0FA8D6]/30 inline-block">
                            {docSpecialization}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-lg font-medium text-[#012442] group-hover:text-[#024363] transition-colors tracking-tight line-clamp-1">
                            {doc.name.startsWith("Dr") ? doc.name : `Dr. ${doc.name}`}
                          </h3>
                          <p className="text-xs font-bold text-[#024363] mt-0.5 line-clamp-1">
                            Senior Consultant &amp; Surgeon
                          </p>
                        </div>

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
                            <span className="text-slate-700 font-medium">Ramachandra Centre, Sambalpur</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 pt-0 mt-2 flex items-center gap-2 border-t border-slate-100 pt-4">
                      <button
                        onClick={() => dispatch(openAppointmentModal(doc.department?.name || "", doc.name))}
                        className="flex-1 py-2.5 bg-[#00B4EA] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 uppercase tracking-wider hover:bg-[#0FA8D6]"
                      >
                        <Calendar size={13} />
                        <span>Book Visit</span>
                      </button>
                      <button
                        onClick={() => navigate(`/doctors/${doctorSlug}`)}
                        className="px-3.5 py-2.5 bg-slate-50 hover:bg-[#0FA8D6]/10 text-slate-800 hover:text-[#024363] border border-slate-200 hover:border-[#0FA8D6]/40 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
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
            /* LIST VIEW */
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
                    {/* Portrait */}
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

                    {/* Details */}
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
                          className="px-5 py-2.5 bg-[#00B4EA] hover:bg-[#0FA8D6] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center gap-1.5 uppercase tracking-wider"
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
          /* EMPTY STATE */
          <div className="text-center py-16 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#0FA8D6]/10 text-[#0FA8D6] flex items-center justify-center mx-auto mb-4 border border-[#0FA8D6]/20">
              <Stethoscope size={30} />
            </div>
            <h3 className="text-lg font-medium text-[#012442] mb-1">No Doctors Found</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
              No doctors are currently available. Please check back shortly.
            </p>
          </div>
        )}

        {/* Pagination */}
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
  );
});

DoctorGrid.displayName = "DoctorGrid";
export default DoctorGrid;