import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Stethoscope,
  FileText,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Calendar,
  PhoneCall,
  Building2,
  Sparkles,
  CornerDownLeft
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";
import { fetchAllDoctorsPublic } from "../redux/features/doctor/doctorThunk";
import { fetchBlogs } from "../redux/features/blog/blogThunk";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { getDoctorSlug } from "../Helper/slugify";

const POPULAR_SEARCHES = [
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Ophthalmology",
  "Health Tips",
];

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Redux state
  const { departments = [] } = useSelector((state) => state.department || {});
  const { doctors = [] } = useSelector((state) => state.doctor || {});
  const { blogs = [] } = useSelector((state) => state.blog || {});

  // Search local states
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sortBy, setSortBy] = useState("Relevance");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Fetch all resources when search modal is opened
  useEffect(() => {
    if (isOpen) {
      if (departments.length === 0) dispatch(fetchAllDepartments());
      if (doctors.length === 0) dispatch(fetchAllDoctorsPublic());
      if (blogs.length === 0) dispatch(fetchBlogs({ limit: 100 }));

      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, dispatch, departments.length, doctors.length, blogs.length]);

  // Debouncing the input query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setSelectedIndex(0);
    }, 100);
    return () => clearTimeout(handler);
  }, [query]);

  // Filtered Results Calculation
  const { filteredResults, counts } = useMemo(() => {
    const lowerQuery = debouncedQuery.trim().toLowerCase();

    let deptMatches = [];
    let doctorMatches = [];
    let blogMatches = [];

    if (lowerQuery) {
      // 1. Departments
      departments.forEach((dept) => {
        if (
          dept.name?.toLowerCase().includes(lowerQuery) ||
          dept.description?.toLowerCase().includes(lowerQuery)
        ) {
          deptMatches.push({
            id: dept._id,
            type: "department",
            badge: "Department",
            title: dept.name,
            subtitle: dept.description || "Specialized clinical department",
            photo: dept.image || dept.icon,
            link: `/urology-services/${dept.slug || dept._id}`,
            icon: Building2,
            tagColor: "bg-emerald-100/80 text-emerald-800",
            iconBg: "bg-emerald-50 text-emerald-600",
          });
        }
      });

      // 2. Doctors
      doctors.forEach((doc) => {
        if (
          doc.name?.toLowerCase().includes(lowerQuery) ||
          doc.specialization?.toLowerCase().includes(lowerQuery) ||
          doc.qualifications?.toLowerCase().includes(lowerQuery)
        ) {
          doctorMatches.push({
            id: doc._id,
            type: "doctor",
            badge: "Doctor",
            title: doc.name?.startsWith("Dr.") ? doc.name : `Dr. ${doc.name}`,
            subtitle: `${doc.specialization || "Medical Specialist"} • ${doc.experience || 0}+ yrs exp`,
            photo: doc.photo,
            link: `/doctors/${getDoctorSlug(doc.name)}`,
            icon: Stethoscope,
            tagColor: "bg-emerald-100/80 text-emerald-800",
            iconBg: "bg-sky-50 text-sky-600",
          });
        }
      });

      // 3. Blogs
      blogs.forEach((blog) => {
        if (
          blog.title?.toLowerCase().includes(lowerQuery) ||
          blog.category?.toLowerCase().includes(lowerQuery) ||
          blog.description?.toLowerCase().includes(lowerQuery)
        ) {
          blogMatches.push({
            id: blog._id,
            type: "blog",
            badge: "Article",
            title: blog.title,
            subtitle: `${blog.category || "General"} • ${blog.readTime || "5 min read"}`,
            photo: blog.image,
            link: `/blog/${blog._id}`,
            icon: FileText,
            tagColor: "bg-emerald-100/80 text-emerald-800",
            iconBg: "bg-teal-50 text-teal-600",
          });
        }
      });
    }

    const totalCounts = {
      all: deptMatches.length + doctorMatches.length + blogMatches.length,
      doctors: doctorMatches.length,
      departments: deptMatches.length,
      blogs: blogMatches.length,
    };

    let finalResults = [];
    if (activeTab === "all") {
      finalResults = [...blogMatches, ...doctorMatches, ...deptMatches];
    } else if (activeTab === "departments") {
      finalResults = deptMatches;
    } else if (activeTab === "doctors") {
      finalResults = doctorMatches;
    } else if (activeTab === "blogs") {
      finalResults = blogMatches;
    }

    return { filteredResults: finalResults, counts: totalCounts };
  }, [debouncedQuery, activeTab, departments, doctors, blogs]);

  // Handle bookmark toggle
  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Navigate on select
  const handleSelectResult = useCallback(
    (result) => {
      navigate(result.link);
      onClose();
      setQuery("");
    },
    [navigate, onClose]
  );

  // Quick Action Handler
  const handleQuickAction = (action) => {
    onClose();
    if (action === "appointment") {
      dispatch(openAppointmentModal());
    } else if (action === "doctors") {
      navigate("/doctors");
    } else if (action === "departments") {
      navigate("/urology-services");
    } else if (action === "emergency") {
      window.location.href = "tel:8895062072";
    }
  };

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelectResult(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filteredResults, selectedIndex, handleSelectResult]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Close when clicking overlay
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const tabs = [
    { id: "all", label: "All Results", count: counts.all },
    { id: "doctors", label: "Doctors", count: counts.doctors },
    { id: "departments", label: "Departments", count: counts.departments },
    { id: "blogs", label: "Articles", count: counts.blogs },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-white rounded-[32px] border border-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] my-auto"
          >
            {/* ── Top Search Input Box (Elevated Card in Mockup) ── */}
            <div className="p-4 sm:p-5 pb-3 bg-white">
              <div className="flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs px-3.5 py-2.5 sm:py-3 transition-all focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mr-3">
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, doctors, departments..."
                  className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 outline-none text-base sm:text-lg font-semibold border-0"
                />
                {query ? (
                  <button
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer border-none bg-transparent"
                    aria-label="Clear Search"
                  >
                    <X className="w-5 h-5 stroke-[2]" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
                    ESC
                  </kbd>
                )}
              </div>
            </div>

            {/* ── Category Tabs Pill Bar ── */}
            <div className="px-4 sm:px-5 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <div key={tab.id} className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSelectedIndex(0);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isActive
                            ? "bg-[#004649] text-white border-[#004649] shadow-sm"
                            : "bg-white text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                      {isActive && (
                        <motion.div
                          layoutId="activeSearchTabIndicator"
                          className="w-5 h-0.5 bg-[#004649] rounded-full mt-1.5"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Results Summary Header with Relevance Bar ── */}
            {query.trim() && filteredResults.length > 0 && (
              <div className="px-5 sm:px-6 py-2.5 mx-4 sm:mx-5 rounded-2xl bg-slate-50/80 border border-slate-100/90 mb-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-2">
                  <span>{filteredResults.length} results found</span>
                  <div className="flex items-center gap-1 text-slate-700 cursor-pointer hover:text-emerald-700 font-bold">
                    <span>Sorted by {sortBy}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200/70 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full w-[70%] transition-all duration-500"></div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">70%</span>
                </div>
              </div>
            )}

            {/* ── Modal Body Content ── */}
            <div
              ref={resultsContainerRef}
              className="overflow-y-auto flex-1 px-4 sm:px-5 py-2 space-y-3 select-none"
            >
              {/* Zero State: Quick Actions & Trending Searches */}
              {!query.trim() ? (
                <div className="py-2 space-y-5">
                  {/* Quick Shortcut Tiles */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
                      Quick Access
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleQuickAction("appointment")}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 hover:border-emerald-300 hover:shadow-xs transition-all text-left cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <Calendar className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 group-hover:text-emerald-700 transition-colors">
                            Book an Appointment
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Schedule a visit with a doctor
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all" />
                      </button>

                      <button
                        onClick={() => handleQuickAction("doctors")}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-sky-50/60 border border-sky-200/60 hover:border-sky-300 hover:shadow-xs transition-all text-left cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <Stethoscope className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 group-hover:text-sky-700 transition-colors">
                            Find Specialists
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Browse all medical experts
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 group-hover:text-sky-600 transition-all" />
                      </button>

                      <button
                        onClick={() => handleQuickAction("departments")}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/60 border border-purple-200/60 hover:border-purple-300 hover:shadow-xs transition-all text-left cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <Building2 className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 group-hover:text-purple-700 transition-colors">
                            Clinical Departments
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Cardiology, Pediatrics & more
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 group-hover:text-purple-600 transition-all" />
                      </button>

                      <button
                        onClick={() => handleQuickAction("emergency")}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/60 border border-rose-200/60 hover:border-rose-300 hover:shadow-xs transition-all text-left cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <PhoneCall className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 group-hover:text-rose-700 transition-colors">
                            24/7 Emergency Line
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Call +91 88950 62072 instantly
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 group-hover:text-rose-600 transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Popular Search Suggestions */}
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 px-1">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(term);
                            inputRef.current?.focus();
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 text-slate-700 text-xs font-bold transition-all cursor-pointer hover:border-secondary/30 flex items-center gap-1.5"
                        >
                          <Search className="w-3 h-3 text-secondary" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Search Results List Styled Exactly like Mockup */
                <div className="space-y-3 pb-2">
                  {filteredResults.map((result, idx) => {
                    const ResultIcon = result.icon;
                    const isSelected = idx === selectedIndex;
                    const isBookmarked = bookmarkedIds.has(result.id);

                    return (
                      <motion.div
                        key={result.type + "-" + result.id}
                        data-index={idx}
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                          isSelected
                            ? "bg-emerald-50/20 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20"
                            : "bg-white border-slate-200/85 hover:border-slate-300 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 pr-3">
                          {/* Circular Left Image/Avatar */}
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-slate-200/80 bg-slate-100">
                            {result.photo ? (
                              <img
                                src={result.photo}
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full flex items-center justify-center ${result.iconBg}`}
                              >
                                <ResultIcon className="w-6 h-6 stroke-[2]" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="min-w-0">
                            <div className="mb-1">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${result.tagColor}`}
                              >
                                {result.badge}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-snug">
                              {result.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">
                              {result.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Right Icons: Chevron & Bookmark */}
                        <div className="flex flex-col items-end justify-between h-14 shrink-0">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                          <button
                            onClick={(e) => toggleBookmark(e, result.id)}
                            className="p-1 text-slate-400 hover:text-emerald-700 transition cursor-pointer border-none bg-transparent"
                            aria-label="Bookmark"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                isBookmarked
                                  ? "fill-emerald-600 text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* No Results Found State */
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-3">
                    <X className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    No results for "{query}"
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mb-4">
                    Try checking your spelling or choose from popular searches below.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {POPULAR_SEARCHES.slice(0, 4).map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer border border-slate-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer Bar Styled with Pill Badges ── */}
            <div className="border-t border-slate-100 px-5 py-3 bg-white flex items-center justify-between text-xs text-slate-500 font-medium select-none">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 rounded-full border border-slate-200/60 text-[11px] text-slate-600 font-semibold">
                  <span className="font-bold">↑↓</span>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 rounded-full border border-slate-200/60 text-[11px] text-slate-600 font-semibold">
                  <CornerDownLeft className="w-3 h-3" />
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 rounded-full border border-slate-200/60 text-[11px] text-slate-400 font-semibold">
                  <span className="font-bold">ESC</span>
                  <span>Close</span>
                </div>
              </div>

              {query.trim() && (
                <div className="text-xs font-bold text-emerald-700">
                  {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
