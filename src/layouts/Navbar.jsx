import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  Calendar,
  Building2,
  Phone,
  MapPin,
  Ambulance,
  ArrowRight,
  ShieldCheck,
  Menu,
  X,
  Stethoscope,
  Activity,
  HeartPulse
} from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";
import { fetchSettings } from "../redux/features/setting/settingThunk";
import { motion, AnimatePresence } from "framer-motion";
import { getDepartmentIcon } from "../Helper/departmentIcon";
import { NavbarDropdownSkeleton } from "../components/common/Skeletons";

const Navbar = () => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.department || { departments: [] });
  const { settings } = useSelector((state) => state.setting || { settings: null });

  const [isOpen, setIsOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [mobileDepartmentsOpen, setMobileDepartmentsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const deptRef = useRef(null);

  useEffect(() => {
    if (!departments || departments.length === 0) dispatch(fetchAllDepartments());
    dispatch(fetchSettings());
  }, [dispatch, departments.length]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/doctors", label: "Doctors" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) setDepartmentsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsOpen(false);
    setDepartmentsOpen(false);
    setMobileDepartmentsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const emergencyNumber = settings?.emergencyPhone || "9090963722";

  return (
    <header className="sticky top-0 z-50 font-sans select-none transition-all duration-300">
      {/* ── 1. ULTRA-MODERN TOP EMERGENCY & INFORMATION STRIP ── */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-slate-200 hidden lg:block border-b border-teal-500/20 text-xs py-2 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between relative z-10">
          {/* Left Info: Map Location & Accreditation */}
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="https://maps.google.com/?q=Ramachandra+Urology+and+Stone+Centre+Sambalpur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors no-underline font-medium"
            >
              <MapPin size={13} className="text-emerald-400 shrink-0" />
              <span>Sambalpur, Odisha, India</span>
            </a>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
              <span>NABH Accredited & ISO 9001 Certified</span>
            </div>

            <span className="text-slate-700">|</span>

            {/* Live ECG Wave pulse status indicator */}
            <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Activity size={13} className="animate-pulse text-emerald-400 shrink-0" />
              <span className="text-[11px]">24x7 Trauma & Laser Urology OPD</span>
            </div>
          </div>

          {/* Right Info: 24x7 Emergency SOS Pill & Call Hotline */}
          <div className="flex items-center gap-3">
            {/* 24x7 Emergency SOS Button with Pulse Beacon */}
            <a
              href={`tel:${emergencyNumber}`}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white px-4 py-1 rounded-full font-extrabold transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)] active:scale-95 no-underline cursor-pointer text-xs group"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <Ambulance size={14} className="shrink-0 group-hover:rotate-12 transition-transform" />
              <span>24x7 SOS: {emergencyNumber}</span>
            </a>

            <a
              href={`tel:${emergencyNumber}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors px-2 py-1 no-underline font-semibold"
            >
              <Phone size={13} className="text-emerald-400" />
              <span>Direct Hotline</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. NEXT-LEVEL FLOATING GLASS ISLAND NAVBAR ── */}
      <div className={`transition-all duration-300 ${scrolled ? "px-3 sm:px-6 pt-2" : "px-0"}`}>
        <nav
          className={`transition-all duration-300 ${scrolled
            ? "max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(0,135,90,0.12)] rounded-3xl py-2.5 px-4 sm:px-6"
            : "bg-white border-b border-slate-100 shadow-xs py-3.5 px-4"
            }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

            {/* ── BRAND LOGO (CLEAN /LOGO.PNG) ── */}
            <Link to="/" className="flex items-center no-underline shrink-0 group py-1">
              <img
                src="/logo.png"
                alt="Hospital Logo"
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${scrolled ? "h-11 sm:h-12" : "h-12 sm:h-14"
                  }`}
              />
            </Link>

            {/* ── CENTER FLOATING PILL NAVIGATION DOCK ── */}
            <div className="hidden xl:flex items-center bg-slate-100/90 backdrop-blur-md border border-slate-200/80 rounded-full px-2 py-1 shadow-inner">
              <ul className="flex items-center gap-1 list-none m-0 p-0">
                {navLinks.map(({ to, label }) => {
                  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                  return (
                    <li key={to} className="relative flex flex-col items-center">
                      <Link
                        to={to}
                        className={`text-xs font-extrabold px-4 py-2 rounded-full no-underline transition-all relative z-10 ${isActive
                          ? "text-emerald-900"
                          : "text-slate-600 hover:text-slate-950 font-bold hover:bg-slate-200/60"
                          }`}
                      >
                        {label}
                      </Link>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute inset-0 bg-white rounded-full shadow-md border border-emerald-200/60 z-0"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                    </li>
                  );
                })}

                {/* Mega Dropdown: Departments */}
                <li
                  className="relative flex flex-col items-center z-20"
                  ref={deptRef}
                  onMouseEnter={() => setDepartmentsOpen(true)}
                  onMouseLeave={() => setDepartmentsOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-full cursor-pointer transition-all border-none bg-transparent ${departmentsOpen || location.pathname.startsWith("/departments")
                      ? "text-emerald-900 bg-white shadow-md border border-emerald-200/60"
                      : "text-slate-600 hover:text-slate-950 font-bold hover:bg-slate-200/60"
                      }`}
                  >
                    <span>Departments</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${departmentsOpen ? "rotate-180 text-emerald-700" : ""
                        }`}
                    />
                  </button>

                  {/* Mega Dropdown Menu */}
                  <AnimatePresence>
                    {departmentsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-white/98 backdrop-blur-2xl border border-emerald-100/90 rounded-3xl shadow-[0_25px_70px_rgba(0,135,90,0.18)] w-auto p-5 z-50 min-w-[640px]"
                        onMouseEnter={() => setDepartmentsOpen(true)}
                        onMouseLeave={() => setDepartmentsOpen(false)}
                      >
                        {/* Header Banner inside Dropdown */}
                        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Stethoscope size={18} />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                Clinical Specialities & Care Wings
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                Advanced laser surgery & stone management
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            {departments?.length || 0} Specialities
                          </span>
                        </div>

                        {departments && departments.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto no-scrollbar p-1">
                            {departments.map((dept) => (
                              <Link
                                key={dept._id || dept.name}
                                to={`/departments/${dept.slug || dept._id}`}
                                onClick={() => setDepartmentsOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/50 hover:bg-emerald-50/90 border border-slate-100 hover:border-emerald-300 transition-all group no-underline hover:-translate-y-0.5 shadow-2xs"
                              >
                                <div className="text-emerald-700 w-10 h-10 rounded-xl bg-white group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs border border-slate-200/80 mt-0.5">
                                  {getDepartmentIcon(dept.name, { size: 18 })}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-extrabold text-slate-850 group-hover:text-emerald-900 transition-colors truncate">
                                    {dept.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                                    {dept.description || "Expert medical care & OPD"}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <NavbarDropdownSkeleton />
                        )}

                        <div className="border-t border-slate-100 mt-4 pt-3 px-3 flex items-center justify-between bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-3xl">
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                            <HeartPulse size={16} className="text-emerald-600 animate-pulse" />
                            <span>Same-day clinical appointments available</span>
                          </div>
                          <Link
                            to="/departments"
                            onClick={() => setDepartmentsOpen(false)}
                            className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs hover:text-emerald-900 no-underline bg-emerald-100/60 px-3 py-1.5 rounded-full hover:bg-emerald-200/60 transition-colors"
                          >
                            <span>Explore All Clinical Wings</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </ul>
            </div>

            {/* ── RIGHT CTA: BOOK APPOINTMENT SUPER-BUTTON ── */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black pl-5 pr-2 py-2 rounded-full transition-all shadow-[0_6px_25px_rgba(0,135,90,0.35)] hover:shadow-[0_10px_35px_rgba(0,135,90,0.45)] active:scale-95 cursor-pointer border-none group"
              >
                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 w-1/2 bg-white/20 skew-x-12 animate-shimmer pointer-events-none" />

                <div className="flex items-center gap-2 relative z-10">
                  <Calendar size={16} className="group-hover:rotate-12 transition-transform" />
                  <span className="tracking-wide">Book Appointment</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/35 flex items-center justify-center transition-colors relative z-10">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>

            {/* ── MOBILE HAMBURGER MENU TOGGLE ── */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center border border-slate-200 cursor-pointer text-slate-800 transition-all shadow-2xs"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── MOBILE SLIDEOUT DRAWER ── */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "calc(100vh - 70px)" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden fixed inset-0 top-[70px] bg-white/98 backdrop-blur-2xl z-50 flex flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
                  {/* Emergency Banner inside mobile menu */}
                  <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-3.5 mb-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Ambulance size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-black">24x7 Emergency SOS</div>
                        <div className="text-[11px] text-red-100 font-bold">{emergencyNumber}</div>
                      </div>
                    </div>
                    <a
                      href={`tel:${emergencyNumber}`}
                      className="bg-white text-red-700 text-xs font-black px-3.5 py-1.5 rounded-full no-underline shadow-xs"
                    >
                      Call Now
                    </a>
                  </div>

                  {navLinks.map(({ to, label }) => {
                    const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                    return (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between text-sm font-black px-4 py-3.5 rounded-2xl no-underline transition-all ${isActive
                          ? "text-emerald-900 bg-emerald-50 border border-emerald-200"
                          : "text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span>{label}</span>
                        <ArrowRight size={16} className={isActive ? "text-emerald-600" : "text-slate-400"} />
                      </Link>
                    );
                  })}

                  {/* Mobile Departments Collapsible */}
                  <div className="pt-2 border-t border-slate-100 mt-3">
                    <button
                      onClick={() => setMobileDepartmentsOpen(!mobileDepartmentsOpen)}
                      className="flex items-center justify-between w-full text-sm font-black px-4 py-3.5 rounded-2xl text-slate-700 hover:bg-slate-50 border-none bg-transparent cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Building2 size={18} className="text-emerald-600" />
                        Departments
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${mobileDepartmentsOpen ? "rotate-180 text-emerald-600" : ""
                          }`}
                      />
                    </button>

                    {mobileDepartmentsOpen && (
                      <div className="pl-4 mt-1 space-y-1.5 border-l-2 border-emerald-200 ml-4">
                        {departments.map((dept) => (
                          <Link
                            key={dept._id || dept.name}
                            to={`/departments/${dept.slug || dept._id}`}
                            onClick={() => {
                              setMobileDepartmentsOpen(false);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 transition-all no-underline"
                          >
                            <div className="text-emerald-600 w-6 h-6 flex items-center justify-center shrink-0">
                              {getDepartmentIcon(dept.name, { size: 15 })}
                            </div>
                            <span className="text-xs font-bold text-slate-800">{dept.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Drawer Bottom Quick Action */}
                <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      dispatch(openAppointmentModal());
                    }}
                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-sm font-black py-4 rounded-2xl shadow-lg border-none cursor-pointer tracking-wider uppercase"
                  >
                    <Calendar size={18} />
                    <span>Book Appointment Now</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;