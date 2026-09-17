import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  Bookmark,
  Share2,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../redux/features/blog/blogThunk";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { BlogCardSkeleton } from "../common/Skeletons";

const categoryOptions = [
  "All",
  "Urology",
  "Kidney Stones",
  "Laser Surgery",
  "Men's Health",
  "Cardiology",
  "Pediatrics",
  "Orthopedics",
  "General Wellness"
];

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, currentPage, totalPages, categoryCounts = {} } = useSelector(
    (state) => state.blog || { blogs: [], loading: false, currentPage: 1, totalPages: 1, categoryCounts: {} }
  );
  const { settings } = useSelector((state) => state.setting || { settings: null });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  const emergencyPhone = settings?.emergencyPhone || "9937566625";

  // Fetch blogs when filter changes
  useEffect(() => {
    dispatch(
      fetchBlogs({
        search,
        category: selectedCategory === "All" ? "" : selectedCategory,
        page,
        limit: 6
      })
    );
  }, [dispatch, search, selectedCategory, page]);

  // Reset page when category or search changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Get featured post (1st post on page 1 without active search)
  const featuredPost = page === 1 && !search && selectedCategory === "All" && blogs.length > 0 ? blogs[0] : null;
  const standardPosts = featuredPost ? blogs.slice(1) : blogs;
  const recentPosts = blogs.slice(0, 4);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* ── TOP CATEGORY QUICK FILTER BAR ── */}
      <div className="flex items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#012442] uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Tag size={13} className="text-[#0FA8D6]" />
            Topics:
          </span>
          {categoryOptions.slice(0, 7).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#024363] text-white border-[#024363] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-[#0FA8D6]/50 hover:text-[#024363]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search quick box on desktop */}
        <div className="relative hidden md:block w-72 shrink-0">
          <input
            type="text"
            placeholder="Search medical guides..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border border-slate-200 text-[#012442] rounded-full pl-9 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-[#0FA8D6] focus:bg-white focus:ring-2 focus:ring-[#0FA8D6]/15 transition-all placeholder:text-slate-400"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── FEATURED SPOTLIGHT ARTICLE (Page 1 Top) ── */}
      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden group border border-[#0FA8D6]/25"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0FA8D6]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Featured Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-[#0FA8D6] text-[#012442] shadow-xs">
                  <Sparkles size={12} />
                  Featured Medical Insight
                </span>
                {featuredPost.category && (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/15 backdrop-blur-xs">
                    {featuredPost.category}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                <Link
                  to={`/blog/${featuredPost._id}`}
                  className="hover:text-cyan-300 transition-colors text-white no-underline"
                >
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {featuredPost.description}
              </p>

              {/* Author & Read Time Meta */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-semibold border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 flex items-center justify-center text-[#0FA8D6] font-bold text-xs">
                    <User size={14} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{featuredPost.authorName || "Specialist Surgeon"}</div>
                    <div className="text-[10.5px] text-cyan-200/80">Sambalpur Clinical Team</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar size={13} className="text-[#0FA8D6]" />
                  <span>
                    {featuredPost.date ||
                      (featuredPost.createdAt
                        ? new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })
                        : "Published Recently")}
                  </span>
                </div>

                {featuredPost.readTime && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock size={13} className="text-[#0FA8D6]" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to={`/blog/${featuredPost._id}`}
                  className="inline-flex items-center gap-2 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] font-medium text-xs px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg no-underline tracking-wide uppercase"
                >
                  <span>Read Full Medical Guide</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column: High-Res Image Card */}
            <div className="lg:col-span-5 relative">
              <Link
                to={`/blog/${featuredPost._id}`}
                className="block relative rounded-2xl overflow-hidden aspect-[16/11] border-2 border-white/20 shadow-2xl group/img"
              >
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    Explore Article Details <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── MAIN CONTENT GRID WITH SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* LEFT 8 COLUMNS: MAGAZINE BLOG CARDS */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-xl font-extrabold text-[#012442] tracking-tight">
              {selectedCategory === "All" ? "All Clinical Articles" : `${selectedCategory} Guides`}
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {blogs.length} {blogs.length === 1 ? "Article" : "Articles"}
            </span>
          </div>

          {loading && blogs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <BlogCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {standardPosts && standardPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {standardPosts.map((post, index) => {
                    return (
                      <motion.article
                        key={post._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/40 transition-all duration-300 flex flex-col overflow-hidden group"
                      >
                        {/* Card Image */}
                        <Link
                          to={`/blog/${post._id}`}
                          className="relative aspect-[16/10] overflow-hidden block bg-slate-100"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/95 text-[#024363] border border-slate-200 shadow-xs backdrop-blur-xs">
                              {post.category || "Urology Care"}
                            </span>
                          </div>
                        </Link>

                        {/* Card Content */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col">
                          {/* Metadata row */}
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mb-2.5">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-[#0FA8D6]" />
                              {post.date ||
                                (post.createdAt
                                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric"
                                    })
                                  : "Recently")}
                            </span>
                            {post.readTime && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={13} className="text-[#0FA8D6]" />
                                  {post.readTime}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-base sm:text-lg font-bold text-[#012442] leading-snug group-hover:text-[#0FA8D6] transition-colors line-clamp-2 mb-2">
                            <Link to={`/blog/${post._id}`} className="no-underline text-inherit">
                              {post.title}
                            </Link>
                          </h4>

                          {/* Excerpt */}
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
                            {post.description}
                          </p>

                          {/* Card Footer */}
                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#0FA8D6]/10 text-[#024363] flex items-center justify-center font-bold text-[10px]">
                                <User size={11} />
                              </div>
                              <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                                {post.authorName || "Specialist"}
                              </span>
                            </div>

                            <Link
                              to={`/blog/${post._id}`}
                              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#024363] group-hover:text-[#0FA8D6] transition-colors no-underline"
                            >
                              <span>Read Guide</span>
                              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                !loading && (
                  <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-3xl p-8">
                    <BookOpen size={36} className="text-[#0FA8D6] mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-[#012442] mb-1">No articles found</h4>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                      {search
                        ? `No results matched "${search}". Try searching for terms like "stone", "laser", or "urology".`
                        : "There are currently no published articles in this category."}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-4 text-xs font-bold text-[#0FA8D6] hover:underline cursor-pointer border-none bg-transparent"
                      >
                        Clear Search Query
                      </button>
                    )}
                  </div>
                )
              )}
            </AnimatePresence>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-200 bg-white text-[#012442] rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-200 bg-white text-[#012442] rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT 4 COLUMNS: INTERACTIVE SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Mobile Search Widget (visible on mobile only) */}
          <div className="block md:hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-extrabold text-[#012442] uppercase tracking-wider mb-3">
              Search Library
            </h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-slate-50 border border-slate-200 text-[#012442] rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0FA8D6]"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* 1. Category Topics Widget */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <h4 className="text-xs font-extrabold text-[#012442] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag size={14} className="text-[#0FA8D6]" />
              Browse By Specialty
            </h4>
            <ul className="space-y-2.5">
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] || (cat === "All" ? blogs.length : 0);
                return (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all border-none bg-transparent cursor-pointer ${
                        isSelected
                          ? "bg-[#0FA8D6]/10 text-[#024363]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#012442]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-[#0FA8D6]" : "bg-slate-300"
                          }`}
                        />
                        <span>{cat === "All" ? "All Specialties" : cat}</span>
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 2. Urgent Consultation CTA Card */}
          <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] rounded-2xl p-6 text-white shadow-md border border-[#0FA8D6]/20">
            <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/20 text-[#0FA8D6] flex items-center justify-center mb-3">
              <Phone size={18} />
            </div>
            <h4 className="text-base font-extrabold text-white tracking-tight mb-1">
              Need Direct Urology Advice?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Speak with our specialist care coordinators or schedule a priority consultation today in Sambalpur.
            </p>
            <div className="space-y-2.5">
              <a
                href={`tel:${emergencyPhone}`}
                className="w-full flex items-center justify-center gap-2 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] font-medium text-xs py-2.5 rounded-xl no-underline transition-colors shadow-xs"
              >
                <Phone size={13} />
                <span>Call Helpline: +91 {emergencyPhone}</span>
              </a>
              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs py-2.5 rounded-xl border border-white/20 cursor-pointer transition-colors"
              >
                Book Clinical Appointment
              </button>
            </div>
          </div>

          {/* 3. Recent / Trending Articles Widget */}
          {recentPosts && recentPosts.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h4 className="text-xs font-extrabold text-[#012442] uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-[#0FA8D6]" />
                Trending Medical Guides
              </h4>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    to={`/blog/${post._id}`}
                    key={post._id}
                    className="flex items-start gap-3 group no-underline"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-14 rounded-lg object-cover shrink-0 border border-slate-200 group-hover:border-[#0FA8D6]/40 transition-colors"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-[#012442] group-hover:text-[#0FA8D6] transition-colors line-clamp-2 leading-snug mb-1">
                        {post.title}
                      </h5>
                      <span className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar size={10} className="text-[#0FA8D6]" />
                        {post.date ||
                          (post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                              })
                            : "Recent")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. Trust / Verified Hospital Seal */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#024363] mb-1">
              <CheckCircle2 size={15} className="text-[#0FA8D6]" />
              <span>Physician-Verified Content</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              All articles published by Ramachandra Urology & Stone Centre are reviewed by certified urologists for clinical accuracy.
            </p>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default BlogList;

