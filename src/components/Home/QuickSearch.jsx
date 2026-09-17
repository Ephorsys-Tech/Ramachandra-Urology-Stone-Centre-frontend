import { useState, useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Landmark, Activity, UserRound, Check } from "lucide-react";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import { fetchAllDoctorsPublic } from "../../redux/features/doctor/doctorThunk";

const QuickSearch = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { departments = [] } = useSelector((state) => state.department || {});
  const { doctors = [] } = useSelector((state) => state.doctor || {});

  const [selectedHospital, setSelectedHospital] = useState("Ramachandra Urology & Stone Centre");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");

  // Custom Dropdown Open States
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

  // References for click-outside detection
  const hospitalRef = useRef(null);
  const specialtyRef = useRef(null);
  const doctorRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllDepartments());
    dispatch(fetchAllDoctorsPublic());
  }, [dispatch]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hospitalRef.current && !hospitalRef.current.contains(event.target)) {
        setIsHospitalOpen(false);
      }
      if (specialtyRef.current && !specialtyRef.current.contains(event.target)) {
        setIsSpecialtyOpen(false);
      }
      if (doctorRef.current && !doctorRef.current.contains(event.target)) {
        setIsDoctorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation listener (Escape key)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsHospitalOpen(false);
        setIsSpecialtyOpen(false);
        setIsDoctorOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dynamically filter doctors based on selected speciality
  const filteredDoctorsList = (doctors || []).filter((doc) => {
    if (selectedSpecialty === "All") return true;
    const docDept = (doc.department?.name || doc.department || "").toLowerCase().trim();
    const selDept = selectedSpecialty.toLowerCase().trim();
    return docDept === selDept || docDept.includes(selDept) || selDept.includes(docDept);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSpecialty !== "All") params.set("specialty", selectedSpecialty);
    if (selectedDoctor !== "All") params.set("doctor", selectedDoctor);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <section className="bg- py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative font-sans border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl lg:rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.06)] p-2.5 sm:p-3 lg:p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between border border-slate-200/90 gap-2 sm:gap-3 lg:gap-0 w-full overflow-visible"
        >
          {/* Select Hospital */}
          <div
            ref={hospitalRef}
            onClick={() => {
              setIsHospitalOpen(!isHospitalOpen);
              setIsSpecialtyOpen(false);
              setIsDoctorOpen(false);
            }}
            className={`flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-2 relative group rounded-xl lg:rounded-full hover:bg-slate-50 transition-colors cursor-pointer select-none bg-slate-50/60 lg:bg-transparent ${isHospitalOpen ? "z-30 bg-slate-100/80 lg:bg-slate-50" : "z-10"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 flex items-center justify-center text-[#024363] shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-[#0FA8D6]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 cursor-pointer">
                Hospital Centre
              </label>
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-[#012442] text-xs sm:text-[13.5px] leading-tight truncate">
                  {selectedHospital === "Ramachandra Urology & Stone Centre"
                    ? "Ramachandra Urology, Sambalpur"
                    : selectedHospital}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-all duration-200 shrink-0 ml-1 sm:ml-2 ${isHospitalOpen ? "rotate-180 text-[#0FA8D6]" : "group-hover:text-[#0FA8D6]"
                    }`}
                />
              </div>
            </div>

            {/* Custom Dropdown Option List */}
            <AnimatePresence>
              {isHospitalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[280px] bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHospital("Ramachandra Urology & Stone Centre");
                      setIsHospitalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${selectedHospital === "Ramachandra Urology & Stone Centre"
                      ? "text-[#024363] bg-[#0FA8D6]/10"
                      : "text-slate-700"
                      }`}
                  >
                    <span className="truncate">Ramachandra Urology & Stone Centre, Sambalpur</span>
                    {selectedHospital === "Ramachandra Urology & Stone Centre" && (
                      <Check className="w-4 h-4 text-[#0FA8D6] shrink-0" />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Separator */}
          <div className="hidden lg:block border-l border-slate-200 h-8 self-center shrink-0" />

          {/* Select Speciality */}
          <div
            ref={specialtyRef}
            onClick={() => {
              setIsSpecialtyOpen(!isSpecialtyOpen);
              setIsHospitalOpen(false);
              setIsDoctorOpen(false);
            }}
            className={`flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-2 relative group rounded-xl lg:rounded-full hover:bg-slate-50 transition-colors cursor-pointer select-none bg-slate-50/60 lg:bg-transparent ${isSpecialtyOpen ? "z-30 bg-slate-100/80 lg:bg-slate-50" : "z-10"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 flex items-center justify-center text-[#024363] shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-[#0FA8D6]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 cursor-pointer">
                Speciality / Care Wing
              </label>
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-[#012442] text-xs sm:text-[13.5px] leading-tight truncate">
                  {selectedSpecialty === "All" ? "All Specialties" : selectedSpecialty}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-all duration-200 shrink-0 ml-1 sm:ml-2 ${isSpecialtyOpen ? "rotate-180 text-[#0FA8D6]" : "group-hover:text-[#0FA8D6]"
                    }`}
                />
              </div>
            </div>

            {/* Custom Dropdown Option List */}
            <AnimatePresence>
              {isSpecialtyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[260px] bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[220px] overflow-y-auto scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSpecialty("All");
                        setSelectedDoctor("All");
                        setIsSpecialtyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${selectedSpecialty === "All" ? "text-[#024363] bg-[#0FA8D6]/10" : "text-slate-700"
                        }`}
                    >
                      <span>All Specialities</span>
                      {selectedSpecialty === "All" && <Check className="w-4 h-4 text-[#0FA8D6] shrink-0" />}
                    </button>
                    {(departments || []).map((dept) => (
                      <button
                        key={dept._id || dept.name}
                        type="button"
                        onClick={() => {
                          setSelectedSpecialty(dept.name);
                          setSelectedDoctor("All");
                          setIsSpecialtyOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${selectedSpecialty === dept.name ? "text-[#024363] bg-[#0FA8D6]/10" : "text-slate-700"
                          }`}
                      >
                        <span className="truncate">{dept.name}</span>
                        {selectedSpecialty === dept.name && <Check className="w-4 h-4 text-[#0FA8D6] shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Separator */}
          <div className="hidden lg:block border-l border-slate-200 h-8 self-center shrink-0" />

          {/* Select Doctor */}
          <div
            ref={doctorRef}
            onClick={() => {
              setIsDoctorOpen(!isDoctorOpen);
              setIsHospitalOpen(false);
              setIsSpecialtyOpen(false);
            }}
            className={`flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-2 relative group rounded-xl lg:rounded-full hover:bg-slate-50 transition-colors cursor-pointer select-none bg-slate-50/60 lg:bg-transparent ${isDoctorOpen ? "z-30 bg-slate-100/80 lg:bg-slate-50" : "z-10"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 flex items-center justify-center text-[#024363] shrink-0 group-hover:scale-105 transition-transform">
              <UserRound className="w-5 h-5 text-[#0FA8D6]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 cursor-pointer">
                Specialist Doctor
              </label>
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-[#012442] text-xs sm:text-[13.5px] leading-tight truncate">
                  {selectedDoctor === "All" ? "All Doctors" : `Dr. ${selectedDoctor}`}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-all duration-200 shrink-0 ml-1 sm:ml-2 ${isDoctorOpen ? "rotate-180 text-[#0FA8D6]" : "group-hover:text-[#0FA8D6]"
                    }`}
                />
              </div>
            </div>

            {/* Custom Dropdown Option List */}
            <AnimatePresence>
              {isDoctorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[260px] bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[220px] overflow-y-auto scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoctor("All");
                        setIsDoctorOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${selectedDoctor === "All" ? "text-[#024363] bg-[#0FA8D6]/10" : "text-slate-700"
                        }`}
                    >
                      <span>All Doctors ({doctors.length})</span>
                      {selectedDoctor === "All" && <Check className="w-4 h-4 text-[#0FA8D6] shrink-0" />}
                    </button>
                    {filteredDoctorsList.map((doc) => (
                      <button
                        key={doc._id || doc.name}
                        type="button"
                        onClick={() => {
                          setSelectedDoctor(doc.name);
                          setIsDoctorOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${selectedDoctor === doc.name ? "text-[#024363] bg-[#0FA8D6]/10" : "text-slate-700"
                          }`}
                      >
                        <span className="truncate">{doc.name.startsWith("Dr") ? doc.name : `Dr. ${doc.name}`}</span>
                        {selectedDoctor === doc.name && <Check className="w-4 h-4 text-[#0FA8D6] shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <div className="lg:pl-2 shrink-0">
            <button
              type="submit"
              className="w-full lg:w-auto bg-gradient-to-r from-[#0FA8D6] to-[#0284c7] hover:from-[#00bbf0] hover:to-[#0396e3] text-white font-black rounded-xl lg:rounded-full px-7 py-3 lg:py-3.5 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-white shrink-0" />
              <span>Search Specialist</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
});

QuickSearch.displayName = "QuickSearch";
export default QuickSearch;
