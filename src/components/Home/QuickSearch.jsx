import { useState, useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Landmark, UserRound, Check } from "lucide-react";
import { fetchAllDoctorsPublic } from "../../redux/features/doctor/doctorThunk";
import { getDoctorSlug } from "../../Helper/slugify";

const QuickSearch = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors = [] } = useSelector((state) => state.doctor || {});

  const [selectedHospital, setSelectedHospital] = useState("Ramachandra Urology & Stone Centre");
  const [selectedDoctor, setSelectedDoctor] = useState("All");

  // Sticky state when scrolled past main search bar
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef(null);

  // Main Section Dropdown Open States
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

  // Sticky Bottom Bar Dropdown Open States
  const [isStickyHospitalOpen, setIsStickyHospitalOpen] = useState(false);
  const [isStickyDoctorOpen, setIsStickyDoctorOpen] = useState(false);

  // References for click-outside detection (Main)
  const hospitalRef = useRef(null);
  const doctorRef = useRef(null);

  // References for click-outside detection (Sticky)
  const stickyHospitalRef = useRef(null);
  const stickyDoctorRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllDoctorsPublic());
  }, [dispatch]);

  // Scroll listener to toggle sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // When the bottom of the section has scrolled past the top of the viewport
      if (rect.bottom < 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Main Dropdowns
      if (hospitalRef.current && !hospitalRef.current.contains(event.target)) {
        setIsHospitalOpen(false);
      }
      if (doctorRef.current && !doctorRef.current.contains(event.target)) {
        setIsDoctorOpen(false);
      }

      // Sticky Dropdowns
      if (stickyHospitalRef.current && !stickyHospitalRef.current.contains(event.target)) {
        setIsStickyHospitalOpen(false);
      }
      if (stickyDoctorRef.current && !stickyDoctorRef.current.contains(event.target)) {
        setIsStickyDoctorOpen(false);
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
        setIsDoctorOpen(false);
        setIsStickyHospitalOpen(false);
        setIsStickyDoctorOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // If a specific doctor is selected → go directly to their profile
    if (selectedDoctor !== "All") {
      const doc = (doctors || []).find((d) => d.name === selectedDoctor);
      if (doc) {
        navigate(`/doctors/${getDoctorSlug(doc.name)}`);
        return;
      }
    }
    navigate("/doctors");
  };

  return (
    <>
      {/* ── MAIN IN-PAGE SEARCH SECTION (Below Hero) ── */}
      <section ref={sectionRef} className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl lg:rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.06)] p-2.5 sm:p-3 lg:p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between border border-slate-200/90 gap-2 sm:gap-3 lg:gap-0 w-full overflow-visible"
          >
            {/* Select Hospital */}
            <div
              ref={hospitalRef}
              onClick={() => {
                setIsHospitalOpen(!isHospitalOpen);
                setIsDoctorOpen(false);
              }}
              className={`flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 lg:py-2 relative group rounded-xl lg:rounded-full hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/60 lg:bg-transparent ${
                isHospitalOpen ? "z-30 bg-slate-100/80 lg:bg-slate-50" : "z-10"
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
                    className={`w-4 h-4 text-slate-400 transition-all duration-200 shrink-0 ml-1 sm:ml-2 ${
                      isHospitalOpen ? "rotate-180 text-[#0FA8D6]" : "group-hover:text-[#0FA8D6]"
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
                    className="absolute top-[calc(100%+8px)] left-0 right-0 w-full min-w-0 sm:min-w-[280px] max-w-full bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHospital("Ramachandra Urology & Stone Centre");
                        setIsHospitalOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${
                        selectedHospital === "Ramachandra Urology & Stone Centre"
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

            {/* Select Doctor */}
            <div
              ref={doctorRef}
              onClick={() => {
                setIsDoctorOpen(!isDoctorOpen);
                setIsHospitalOpen(false);
              }}
              className={`flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 lg:py-2 relative group rounded-xl lg:rounded-full hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/60 lg:bg-transparent ${
                isDoctorOpen ? "z-30 bg-slate-100/80 lg:bg-slate-50" : "z-10"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 flex items-center justify-center text-[#024363] shrink-0 group-hover:scale-105 transition-transform">
                <UserRound className="w-5 h-5 text-[#0FA8D6]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 cursor-pointer">
                  Doctor
                </label>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-[#012442] text-xs sm:text-[13.5px] leading-tight truncate">
                    {selectedDoctor === "All" ? "All Doctors" : `Dr. ${selectedDoctor}`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-all duration-200 shrink-0 ml-1 sm:ml-2 ${
                      isDoctorOpen ? "rotate-180 text-[#0FA8D6]" : "group-hover:text-[#0FA8D6]"
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
                    className="absolute top-[calc(100%+8px)] left-0 right-0 w-full min-w-0 sm:min-w-[260px] max-w-full bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-[220px] overflow-y-auto scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctor("All");
                          setIsDoctorOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${
                          selectedDoctor === "All" ? "text-[#024363] bg-[#0FA8D6]/10" : "text-slate-700"
                        }`}
                      >
                        <span>All Doctors ({doctors.length})</span>
                        {selectedDoctor === "All" && <Check className="w-4 h-4 text-[#0FA8D6] shrink-0" />}
                      </button>
                      {(doctors || []).map((doc) => (
                        <button
                          key={doc._id || doc.name}
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(doc.name);
                            setIsDoctorOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer border-none bg-transparent ${
                            selectedDoctor === doc.name ? "text-[#024363] bg-[#0FA8D6]/10" : "text-slate-700"
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
                className="w-full lg:w-auto bg-gradient-to-r from-[#0FA8D6] to-[#0284c7] hover:from-[#00bbf0] hover:to-[#0396e3] text-white font-medium rounded-xl lg:rounded-full px-7 py-3 lg:py-3.5 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
              >
                <Search className="w-4 h-4 text-white shrink-0" />
                <span>Search Doctor</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── FLOATING COMPACT STICKY BOTTOM BAR (When Scrolled Down) ── */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-r from-[#012442] via-[#024363] to-[#012442] text-white rounded-full shadow-[0_20px_50px_rgba(1,36,66,0.45)] p-1.5 sm:p-2 flex items-center justify-between border border-[#0FA8D6]/40 gap-1 sm:gap-2 w-full ring-1 ring-white/10"
            >
              {/* Sticky Hospital */}
              <div
                ref={stickyHospitalRef}
                onClick={() => {
                  setIsStickyHospitalOpen(!isStickyHospitalOpen);
                  setIsStickyDoctorOpen(false);
                }}
                className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer relative"
              >
                <div className="w-7 h-7 rounded-full bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 flex items-center justify-center text-[#0FA8D6] shrink-0">
                  <Landmark className="w-3.5 h-3.5 text-[#0FA8D6]" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-[9px] font-bold text-cyan-300 uppercase tracking-wider leading-none mb-0.5">
                    Centre
                  </div>
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    Ramachandra Urology
                  </div>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-cyan-200/70 shrink-0 ml-1 transition-transform ${
                    isStickyHospitalOpen ? "rotate-180 text-cyan-300" : ""
                  }`}
                />

                {/* Dropdown Opening UPWARD */}
                <AnimatePresence>
                  {isStickyHospitalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-[calc(100%+10px)] left-0 w-full min-w-0 sm:min-w-[280px] max-w-[calc(100vw-32px)] bg-[#012442] border border-[#0FA8D6]/40 rounded-2xl shadow-2xl p-1.5 z-50 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHospital("Ramachandra Urology & Stone Centre");
                          setIsStickyHospitalOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between text-cyan-200 bg-[#0FA8D6]/20 rounded-xl cursor-pointer border-none"
                      >
                        <span className="truncate">Ramachandra Urology & Stone Centre</span>
                        <Check className="w-3.5 h-3.5 text-[#0FA8D6]" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-6 w-px bg-white/20 shrink-0" />

              {/* Sticky Doctor */}
              <div
                ref={stickyDoctorRef}
                onClick={() => {
                  setIsStickyDoctorOpen(!isStickyDoctorOpen);
                  setIsStickyHospitalOpen(false);
                }}
                className="flex-1 min-w-0 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer relative"
              >
                <div className="w-7 h-7 rounded-full bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 flex items-center justify-center text-[#0FA8D6] shrink-0">
                  <UserRound className="w-3.5 h-3.5 text-[#0FA8D6]" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-[9px] font-bold text-cyan-300 uppercase tracking-wider leading-none mb-0.5">
                    Doctor
                  </div>
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    {selectedDoctor === "All" ? "All Doctors" : `Dr. ${selectedDoctor}`}
                  </div>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-cyan-200/70 shrink-0 ml-1 transition-transform ${
                    isStickyDoctorOpen ? "rotate-180 text-cyan-300" : ""
                  }`}
                />

                {/* Dropdown Opening UPWARD */}
                <AnimatePresence>
                  {isStickyDoctorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-[calc(100%+10px)] left-0 w-full min-w-0 sm:min-w-[260px] max-w-[calc(100vw-32px)] bg-[#012442] border border-[#0FA8D6]/40 rounded-2xl shadow-2xl p-1.5 z-50 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoctor("All");
                            setIsStickyDoctorOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between rounded-xl cursor-pointer border-none ${
                            selectedDoctor === "All"
                              ? "bg-[#0FA8D6]/20 text-cyan-300"
                              : "hover:bg-[#024363] text-slate-200 bg-transparent"
                          }`}
                        >
                          <span>All Doctors ({doctors.length})</span>
                          {selectedDoctor === "All" && <Check className="w-3.5 h-3.5 text-[#0FA8D6]" />}
                        </button>
                        {(doctors || []).map((doc) => (
                          <button
                            key={doc._id || doc.name}
                            type="button"
                            onClick={() => {
                              setSelectedDoctor(doc.name);
                              setIsStickyDoctorOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between rounded-xl cursor-pointer border-none ${
                              selectedDoctor === doc.name
                                ? "bg-[#0FA8D6]/20 text-cyan-300"
                                : "hover:bg-[#024363] text-slate-200 bg-transparent"
                            }`}
                          >
                            <span className="truncate">{doc.name.startsWith("Dr") ? doc.name : `Dr. ${doc.name}`}</span>
                            {selectedDoctor === doc.name && <Check className="w-3.5 h-3.5 text-[#0FA8D6]" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Submit Button */}
              <button
                type="submit"
                className="bg-[#00B4EA] hover:bg-[#00bbf0] text-[#012442] font-extrabold text-xs px-5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer border-none shadow-md transition-all hover:scale-105 active:scale-95 uppercase tracking-wider shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

QuickSearch.displayName = "QuickSearch";
export default QuickSearch;
