import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HeartPulse,
  ChevronDown,
  Calendar,
  Building2,
  Search,
  Phone,
  User,
  MapPin,
  Ambulance,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";
import { fetchSettings } from "../redux/features/setting/settingThunk";
import { motion, AnimatePresence } from "framer-motion";
import GlobalSearchModal from "../components/GlobalSearchModal";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const deptRef = useRef(null);

  // Ctrl+K Shortcut for Global Search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!departments || departments.length === 0) dispatch(fetchAllDepartments());
    dispatch(fetchSettings());
  }, [dispatch, departments.length]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/doctors", label: "Doctors" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
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

  return (
    <header className="sticky top-0 z-50 font-sans select-none">
      {/* ── TOP UTILITY BAR (EXACT MOCKUP DESIGN) ── */}
      <div className="bg-[#00383a] text-white hidden lg:block border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[12.5px] font-semibold">
          {/* Left: Location & Accreditation */}
          <div className="flex items-center gap-3.5 text-slate-200">
            <a
              href="https://maps.google.com/?q=Usthi+Hospital+Nayapalli+Bhubaneswar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors no-underline font-medium"
            >
              <MapPin size={14} className="text-[#a7f3d0] shrink-0" />
              <span>IRC Village, Nayapalli, Bhubaneshwar, Odisha 751015</span>
            </a>
            <span className="text-white/25">|</span>
            <div className="flex items-center gap-1.5 text-white/90 font-medium">
              <ShieldCheck size={14} className="text-[#a7f3d0] shrink-0" />
              <span>NABH Accredited Hospital</span>
            </div>
          </div>

          {/* Right: Emergency, Call Us, Patient Portal */}
          <div className="flex items-center gap-3">
            {/* 24x7 Emergency Pill */}
            <a
              href={`tel:${settings?.emergencyPhone || "9090963722"}`}
              className="flex items-center gap-1.5 bg-[#ba1a1a] hover:bg-[#d32f2f] text-white px-3.5 py-1 rounded-full font-bold transition-all shadow-xs active:scale-95 no-underline cursor-pointer text-xs"
            >
              <Ambulance size={13} className="shrink-0" />
              <span>24x7 Emergency: {settings?.emergencyPhone || "9090963722"}</span>
            </a>

            {/* Call Us */}
            <a
              href="tel:+919090963722"
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors px-2 py-1 no-underline font-semibold"
            >
              <Phone size={13} className="text-[#a7f3d0]" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`bg-white transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3 border-b border-slate-200/90"
            : "shadow-xs py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* ── 1. Logo & Brand ── */}
          <Link to="/" className="flex items-center gap-3 no-underline shrink-0 group">
            <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={settings?.logo || "/usthi.webp"}
                alt={settings?.hospitalName || "Usthi Hospital Logo"}
                onError={(e) => {
                  e.currentTarget.src = "/usthi.webp";
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none tracking-tight font-sans">
                {settings?.hospitalName || "Usthi Hospital"}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 font-black tracking-widest uppercase mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                <span>{settings?.tagline || "CARING FOR LIFE"}</span>
              </div>
            </div>
          </Link>

          {/* ── 2. Center Pill Navigation Dock ── */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 shadow-2xs">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {/* Home */}
              <li className="relative flex flex-col items-center">
                <Link
                  to="/"
                  className={`text-[13.5px] font-bold px-3.5 py-1.5 rounded-full no-underline transition-colors ${
                    location.pathname === "/"
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  Home
                </Link>
                {location.pathname === "/" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}
              </li>

              {/* About Us */}
              <li className="relative flex flex-col items-center">
                <Link
                  to="/about"
                  className={`text-[13.5px] px-3.5 py-1.5 rounded-full no-underline transition-colors ${
                    location.pathname === "/about"
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  About Us
                </Link>
                {location.pathname === "/about" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}
              </li>

              {/* Doctors */}
              <li className="relative flex flex-col items-center">
                <Link
                  to="/doctors"
                  className={`text-[13.5px] px-3.5 py-1.5 rounded-full no-underline transition-colors ${
                    location.pathname.startsWith("/doctors")
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  Doctors
                </Link>
                {location.pathname.startsWith("/doctors") && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}
              </li>

              {/* Departments Mega Dropdown */}
              <li
                className="relative flex flex-col items-center"
                ref={deptRef}
                onMouseEnter={() => setDepartmentsOpen(true)}
                onMouseLeave={() => setDepartmentsOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 text-[13.5px] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors border-none bg-transparent ${
                    departmentsOpen || location.pathname.startsWith("/departments")
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  <span>Departments</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      departmentsOpen ? "rotate-180 text-emerald-700" : ""
                    }`}
                  />
                </button>
                {location.pathname.startsWith("/departments") && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {departmentsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] w-auto p-4 z-50"
                      onMouseEnter={() => setDepartmentsOpen(true)}
                      onMouseLeave={() => setDepartmentsOpen(false)}
                    >
                      {departments && departments.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 min-w-[580px] max-h-[380px] overflow-y-auto no-scrollbar p-1">
                          {departments.map((dept) => (
                            <Link
                              key={dept._id || dept.name}
                              to={`/departments/${dept.slug || dept._id}`}
                              onClick={() => setDepartmentsOpen(false)}
                              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200/60 transition-all group no-underline"
                            >
                              <div className="text-emerald-700 w-9 h-9 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs border border-emerald-100">
                                {getDepartmentIcon(dept.name, { size: 18 })}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-850 group-hover:text-emerald-800 transition-colors truncate">
                                  {dept.name}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {dept.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <NavbarDropdownSkeleton />
                      )}
                      <div className="border-t border-slate-100 mt-3 pt-3 px-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Comprehensive Medical Services
                        </span>
                        <Link
                          to="/departments"
                          onClick={() => setDepartmentsOpen(false)}
                          className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs hover:underline no-underline"
                        >
                          <span>View All Clinical Departments</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Gallery */}
              <li className="relative flex flex-col items-center">
                <Link
                  to="/gallery"
                  className={`text-[13.5px] px-3.5 py-1.5 rounded-full no-underline transition-colors ${
                    location.pathname === "/gallery"
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  Gallery
                </Link>
                {location.pathname === "/gallery" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}
              </li>

              {/* Blog */}
              <li className="relative flex flex-col items-center">
                <Link
                  to="/blog"
                  className={`text-[13.5px] px-3.5 py-1.5 rounded-full no-underline transition-colors ${
                    location.pathname.startsWith("/blog")
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  Blog
                </Link>
                {location.pathname.startsWith("/blog") && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}
              </li>

              {/* Contact Us */}
              <li className="relative flex flex-col items-center">
                <Link
                  to="/contact"
                  className={`text-[13.5px] px-3.5 py-1.5 rounded-full no-underline transition-colors ${
                    location.pathname === "/contact"
                      ? "text-emerald-700 font-extrabold"
                      : "text-slate-700 hover:text-slate-950 font-semibold"
                  }`}
                >
                  Contact Us
                </Link>
                {location.pathname === "/contact" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="w-5 h-0.5 bg-emerald-700 rounded-full -mt-0.5"
                  />
                )}
              </li>
            </ul>
          </div>

          {/* ── 3. Right Action Controls (Search + Book Appointment Pill) ── */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Circular Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs"
              title="Search (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Book Appointment CTA Pill with Arrow Circle */}
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="flex items-center gap-3 bg-gradient-to-r from-[#00875a] to-[#006e52] hover:opacity-95 text-white text-sm font-bold pl-5 pr-2 py-2 rounded-full transition-all shadow-[0_4px_18px_rgba(0,135,90,0.3)] hover:shadow-lg active:scale-98 cursor-pointer border-none group"
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Book Appointment</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border-none cursor-pointer"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer text-slate-800"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span
                  className={`block w-5 h-0.5 bg-slate-800 rounded-full transition-all ${
                    isOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-slate-800 rounded-full transition-all ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-slate-800 rounded-full transition-all ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ── MOBILE SLIDEOUT DRAWER ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100vh - 64px)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 top-16 bg-white z-50 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-1">
                {links.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-sm font-bold px-4 py-3.5 rounded-2xl no-underline transition-all ${
                      location.pathname === to
                        ? "text-emerald-800 bg-emerald-50 font-extrabold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{label}</span>
                  </Link>
                ))}

                {/* Mobile Departments Collapsible */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setMobileDepartmentsOpen(!mobileDepartmentsOpen)}
                    className="flex items-center justify-between w-full text-sm font-bold px-4 py-3.5 rounded-2xl text-slate-700 hover:bg-slate-50 border-none bg-transparent cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <Building2 size={18} className="text-emerald-700" />
                      Departments
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileDepartmentsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileDepartmentsOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {departments.map((dept) => (
                        <Link
                          key={dept._id || dept.name}
                          to={`/departments/${dept.slug || dept._id}`}
                          onClick={() => {
                            setMobileDepartmentsOpen(false);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 transition-all no-underline"
                        >
                          <div className="text-emerald-700 w-6 h-6 flex items-center justify-center shrink-0">
                            {getDepartmentIcon(dept.name, { size: 16 })}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{dept.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Drawer Bottom Quick Action */}
              <div className="border-t border-slate-100 bg-slate-50/90 p-4 space-y-2.5">
                <a
                  href={`tel:${settings?.emergencyPhone || "9090963722"}`}
                  className="flex items-center justify-center gap-2 bg-[#ba1a1a] text-white text-xs font-bold py-3 rounded-2xl no-underline shadow-xs"
                >
                  <Ambulance size={16} />
                  <span>Emergency Hotline: {settings?.emergencyPhone || "9090963722"}</span>
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    dispatch(openAppointmentModal());
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00875a] to-[#007a87] text-white text-xs font-bold py-3.5 rounded-2xl shadow-md border-none cursor-pointer uppercase tracking-wider"
                >
                  <Calendar size={16} />
                  <span>Book Appointment Now</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;