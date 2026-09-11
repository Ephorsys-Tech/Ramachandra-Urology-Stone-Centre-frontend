import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  Search,
  Phone,
  Calendar,
  Building2,
  Menu,
  X,
  Stethoscope,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HeartPulse
} from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";
import { fetchSettings } from "../redux/features/setting/settingThunk";
import { motion, AnimatePresence } from "framer-motion";
import { getDepartmentIcon } from "../Helper/departmentIcon";
import { NavbarDropdownSkeleton } from "../components/common/Skeletons";
import GlobalSearchModal from "../components/GlobalSearchModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.department || { departments: [] });
  const { settings } = useSelector((state) => state.setting || { settings: null });

  // Navigation states
  const [isOpen, setIsOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [mobileDepartmentsOpen, setMobileDepartmentsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [languageOpen, setLanguageOpen] = useState(false);

  const location = useLocation();
  const deptRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    if (!departments || departments.length === 0) dispatch(fetchAllDepartments());
    dispatch(fetchSettings());
  }, [dispatch, departments?.length]);

  // Original nav links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/doctors", label: "Doctors" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact Us" },
  ];

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) {
        setDepartmentsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setDepartmentsOpen(false);
    setMobileDepartmentsOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const primaryNumber = "+91 88950 62072";
  const emergencyNumber = "+91 99375 66625";
  const alternateNumbers = ["+91 76538 99199", "0663-4075199"];

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white font-sans select-none border-b border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* ── TOP RIGHT INFORMATION & ACCREDITATION STRIP (Reference UI) ── */}
      <div className="hidden lg:block bg-white border-b border-slate-100 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-end gap-6 text-[12px]">
          
          {/* 1. Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-1 text-slate-700 hover:text-[#0FA8D6] font-semibold cursor-pointer bg-transparent border-none py-1 transition-colors"
            >
              <Globe size={13} className="text-slate-500" />
              <span>{selectedLanguage}</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${languageOpen ? "rotate-180 text-[#0FA8D6]" : ""}`} />
            </button>

            <AnimatePresence>
              {languageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 w-36 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.label.split(" ")[0]);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between cursor-pointer border-none bg-transparent ${
                        selectedLanguage === lang.label.split(" ")[0] ? "text-[#024363] font-bold bg-[#0FA8D6]/10" : "text-slate-700"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.label.split(" ")[0] && <CheckCircle2 size={12} className="text-[#0FA8D6]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* 2. Accreditation Badges (NABH SHCO, Ayushman/GJAY, Thulium Fiber Laser) */}
          <div className="flex items-center gap-2">
            {/* Badge 1: NABH SHCO Accreditation */}
            <div
              className="group relative flex items-center justify-center cursor-pointer"
              title="NABH Entry Level SHCO Accredited (PESHCO-0306-13433)"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 shadow-2xs transition-transform group-hover:scale-105">
                <Award size={13} className="text-amber-600 shrink-0" />
                <span className="text-[10px] font-black tracking-tight">NABH SHCO</span>
              </div>
              <div className="absolute top-full mt-2 hidden group-hover:block bg-[#012442] text-white text-[10px] px-2.5 py-1 rounded shadow-md whitespace-nowrap z-50 pointer-events-none">
                NABH Entry Level SHCO (Valid 2025–2028)
              </div>
            </div>

            {/* Badge 2: Ayushman Bharat / GJAY */}
            <div
              className="group relative flex items-center justify-center cursor-pointer"
              title="Ayushman Bharat (PM-JAY) & GJAY Cashless"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-2xs transition-transform group-hover:scale-105">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span className="text-[10px] font-black tracking-tight">Ayushman / GJAY</span>
              </div>
              <div className="absolute top-full mt-2 hidden group-hover:block bg-[#012442] text-white text-[10px] px-2.5 py-1 rounded shadow-md whitespace-nowrap z-50 pointer-events-none">
                100% Cashless Govt. Healthcare
              </div>
            </div>

            {/* Badge 3: Thulium Fiber Laser */}
            <div
              className="group relative flex items-center justify-center cursor-pointer"
              title="Thulium Fiber Laser Lithotripsy & Endo-Lap Surgery"
            >
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 border border-[#0FA8D6]/40 text-[#024363] shadow-2xs transition-transform group-hover:scale-105">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0FA8D6] animate-pulse shrink-0" />
                <span className="text-[10px] font-black tracking-tight">Thulium LASER</span>
              </div>
              <div className="absolute top-full mt-2 hidden group-hover:block bg-[#012442] text-white text-[10px] px-2.5 py-1 rounded shadow-md whitespace-nowrap z-50 pointer-events-none">
                Advanced Laser Kidney Stone & Prostate Care
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* 3. 24/7 Appointment Helpline */}
          <a
            href={`tel:${primaryNumber.replace(/\s+/g, "")}`}
            className="flex flex-col items-start leading-tight text-slate-700 hover:text-[#0FA8D6] no-underline transition-colors group"
          >
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              24/7 APPOINTMENT HELPLINE
            </span>
            <span className="text-[13px] font-extrabold text-[#012442] group-hover:text-[#0FA8D6] tracking-tight transition-colors">
              {primaryNumber}
            </span>
          </a>

          <div className="h-4 w-px bg-slate-200" />

          {/* 4. Emergency / OPD Hotline */}
          <a
            href={`tel:${emergencyNumber.replace(/\s+/g, "")}`}
            className="flex flex-col items-start leading-tight text-slate-700 hover:text-[#0FA8D6] no-underline transition-colors group"
          >
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              EMERGENCY & OPD
            </span>
            <span className="text-[13px] font-extrabold text-[#012442] group-hover:text-[#0FA8D6] tracking-tight transition-colors">
              {emergencyNumber}
            </span>
          </a>

        </div>
      </div>

      {/* ── MAIN LOGO & NAVIGATION MENU ROW ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center no-underline shrink-0 py-0.5 group">
            <img
              src="/logo.png"
              alt="Ramachandra Urology & Stone Centre"
              className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Main Desktop Navigation Items (Exact Original Data & Links) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* 1. Home */}
            <Link
              to="/"
              className={`text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors no-underline ${
                location.pathname === "/"
                  ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                  : "text-[#012442]/90 hover:text-[#0FA8D6]"
              }`}
            >
              Home
            </Link>

            {/* 2. About Us */}
            <Link
              to="/about"
              className={`text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors no-underline ${
                location.pathname.startsWith("/about")
                  ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                  : "text-[#012442]/90 hover:text-[#0FA8D6]"
              }`}
            >
              About Us
            </Link>

            {/* 3. Doctors */}
            <Link
              to="/doctors"
              className={`text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors no-underline ${
                location.pathname.startsWith("/doctors")
                  ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                  : "text-[#012442]/90 hover:text-[#0FA8D6]"
              }`}
            >
              Doctors
            </Link>

            {/* 4. Departments / Specialities Dropdown */}
            <div
              className="relative"
              ref={deptRef}
              onMouseEnter={() => setDepartmentsOpen(true)}
              onMouseLeave={() => setDepartmentsOpen(false)}
            >
              <button
                onClick={() => setDepartmentsOpen(!departmentsOpen)}
                className={`flex items-center gap-1 text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors cursor-pointer border-none bg-transparent ${
                  departmentsOpen || location.pathname.startsWith("/departments")
                    ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                    : "text-[#012442]/90 hover:text-[#0FA8D6]"
                }`}
              >
                <span>Departments</span>
                <ChevronDown
                  size={13}
                  className={`text-slate-500 transition-transform duration-200 ${
                    departmentsOpen ? "rotate-180 text-[#0FA8D6]" : ""
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              <AnimatePresence>
                {departmentsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(1,36,66,0.15)] w-[680px] p-5 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#0FA8D6]/15 text-[#024363] flex items-center justify-center">
                          <Stethoscope size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-[#012442] tracking-wide uppercase">
                            Clinical Specialities & Care Wings
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Advanced laser surgery & stone management
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#024363] bg-[#0FA8D6]/10 px-2.5 py-0.5 rounded-full border border-[#0FA8D6]/30">
                        {departments?.length || 0} Specialities
                      </span>
                    </div>

                    {departments && departments.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto no-scrollbar p-1">
                        {departments.map((dept) => (
                          <Link
                            key={dept._id || dept.name}
                            to={`/departments/${dept.slug || dept._id}`}
                            onClick={() => setDepartmentsOpen(false)}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 hover:bg-[#0FA8D6]/10 border border-slate-100 hover:border-[#0FA8D6]/30 transition-all group no-underline"
                          >
                            <div className="text-[#024363] w-8 h-8 rounded-lg bg-white group-hover:bg-[#024363] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs border border-slate-200/60 mt-0.5">
                              {getDepartmentIcon(dept.name, { size: 15 })}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#012442] group-hover:text-[#0FA8D6] transition-colors truncate">
                                {dept.name}
                              </div>
                              <div className="text-[10.5px] text-slate-400 group-hover:text-slate-600 line-clamp-1 font-normal">
                                {dept.description || "Expert medical care & OPD"}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <NavbarDropdownSkeleton />
                    )}

                    <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between bg-slate-50/80 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                        <HeartPulse size={14} className="text-[#0FA8D6] animate-pulse" />
                        <span>Same-day clinical appointments available</span>
                      </div>
                      <Link
                        to="/departments"
                        onClick={() => setDepartmentsOpen(false)}
                        className="flex items-center gap-1 text-[#024363] font-bold text-xs hover:text-[#0FA8D6] no-underline bg-[#0FA8D6]/15 hover:bg-[#0FA8D6]/25 px-3 py-1 rounded-full transition-colors"
                      >
                        <span>Explore All Clinical Wings</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Gallery */}
            <Link
              to="/gallery"
              className={`text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors no-underline ${
                location.pathname.startsWith("/gallery")
                  ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                  : "text-[#012442]/90 hover:text-[#0FA8D6]"
              }`}
            >
              Gallery
            </Link>

            {/* 6. Blog */}
            <Link
              to="/blog"
              className={`text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors no-underline ${
                location.pathname.startsWith("/blog")
                  ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                  : "text-[#012442]/90 hover:text-[#0FA8D6]"
              }`}
            >
              Blog
            </Link>

            {/* 7. Contact Us */}
            <Link
              to="/contact"
              className={`text-[13.5px] xl:text-[14px] font-semibold px-3 py-2 rounded-md transition-colors no-underline ${
                location.pathname.startsWith("/contact")
                  ? "text-[#024363] font-bold border-b-2 border-[#0FA8D6] rounded-b-none"
                  : "text-[#012442]/90 hover:text-[#0FA8D6]"
              }`}
            >
              Contact Us
            </Link>

            {/* 🔍 Search Icon Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="ml-1.5 p-2 rounded-full text-[#012442] hover:text-[#0FA8D6] hover:bg-slate-100 transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
              aria-label="Search website"
              title="Search (Ctrl + K)"
            >
              <Search size={18} className="stroke-[2.2]" />
            </button>

            {/* Book Appointment Button */}
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="ml-2 flex items-center gap-1.5 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-xs hover:shadow-md cursor-pointer border-none"
            >
              <Calendar size={13} />
              <span>Book Appointment</span>
            </button>
          </nav>

          {/* ── MOBILE ACTIONS (Search + Phone + Hamburger) ── */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <a
              href={`tel:${emergencyNumber}`}
              className="p-2 rounded-full text-[#024363] bg-[#0FA8D6]/15 hover:bg-[#0FA8D6]/25 transition-colors no-underline flex items-center justify-center"
              aria-label="Call Helpline"
            >
              <Phone size={17} />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#012442] hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer ml-1"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE SLIDEOUT DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 65px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 top-[65px] bg-white z-50 flex flex-col overflow-hidden border-t border-slate-200"
          >
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
              
              {/* Emergency Banner in Mobile Menu */}
              <div className="bg-gradient-to-r from-[#012442] via-[#024363] to-[#012442] text-white rounded-2xl p-3.5 mb-3 shadow-md flex items-center justify-between border border-[#0FA8D6]/20">
                <div>
                  <div className="text-[10px] text-[#0FA8D6] font-bold uppercase tracking-wider">
                    24/7 Helpline & OPD
                  </div>
                  <div className="text-sm font-extrabold mt-0.5">
                    {primaryNumber}
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">
                    Emergency: {emergencyNumber}
                  </div>
                </div>
                <a
                  href={`tel:${primaryNumber.replace(/\s+/g, "")}`}
                  className="bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] text-xs font-black px-3.5 py-1.5 rounded-full no-underline transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Phone size={12} />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Accreditations Bar */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-600 font-semibold mb-2">
                <span>Accreditations:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    NABH SHCO
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Ayushman / GJAY
                  </span>
                  <span className="text-[10px] font-extrabold text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                    Thulium Laser
                  </span>
                </div>
              </div>

              {/* Mobile Original Links */}
              {navLinks.map(({ to, label }) => {
                const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between text-sm font-bold px-3.5 py-3 rounded-xl no-underline transition-all ${
                      isActive
                        ? "text-[#024363] bg-[#0FA8D6]/10 border border-[#0FA8D6]/30"
                        : "text-[#012442] hover:bg-slate-50"
                    }`}
                  >
                    <span>{label}</span>
                    <ArrowRight size={15} className={isActive ? "text-[#0FA8D6]" : "text-slate-400"} />
                  </Link>
                );
              })}

              {/* Mobile Departments Collapsible */}
              <div className="pt-1 border-t border-slate-100 mt-2">
                <button
                  onClick={() => setMobileDepartmentsOpen(!mobileDepartmentsOpen)}
                  className="flex items-center justify-between w-full text-sm font-bold px-3.5 py-3 rounded-xl text-[#012442] hover:bg-slate-50 border-none bg-transparent cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#0FA8D6]" />
                    Departments
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${mobileDepartmentsOpen ? "rotate-180 text-[#0FA8D6]" : ""}`}
                  />
                </button>

                {mobileDepartmentsOpen && (
                  <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#0FA8D6] ml-3">
                    {departments && departments.length > 0 ? (
                      departments.map((dept) => (
                        <Link
                          key={dept._id || dept.name}
                          to={`/departments/${dept.slug || dept._id}`}
                          onClick={() => {
                            setMobileDepartmentsOpen(false);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#0FA8D6]/10 text-slate-700 text-xs font-medium no-underline transition-colors"
                        >
                          <div className="text-[#0FA8D6] w-5 h-5 flex items-center justify-center shrink-0">
                            {getDepartmentIcon(dept.name, { size: 14 })}
                          </div>
                          <span className="truncate">{dept.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 py-2">Loading departments...</div>
                    )}
                    <Link
                      to="/departments"
                      onClick={() => {
                        setMobileDepartmentsOpen(false);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-2 text-[#024363] hover:text-[#0FA8D6] text-xs font-bold no-underline"
                    >
                      <span>Explore All Departments →</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pt-3 border-t border-slate-200 mt-3 flex items-center justify-between px-2">
                <span className="text-xs font-semibold text-slate-500">Language / भाषा:</span>
                <div className="flex items-center gap-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.label.split(" ")[0])}
                      className={`text-xs px-2.5 py-1 rounded-md border cursor-pointer ${
                        selectedLanguage === lang.label.split(" ")[0]
                          ? "bg-[#024363] text-white border-[#024363] font-bold"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {lang.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Mobile Bottom CTA */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  dispatch(openAppointmentModal());
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-sm font-bold py-3.5 rounded-xl shadow-md border-none cursor-pointer tracking-wide uppercase transition-all"
              >
                <Calendar size={16} />
                <span>Book Appointment</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GLOBAL SEARCH MODAL ── */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
};

export default Navbar;